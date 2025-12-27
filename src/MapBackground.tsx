import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet'; 
import { LocateFixed, Layers, Check, Loader2 } from 'lucide-react'; 
import { usePets } from './PetContext';
import { useNavigate } from 'react-router-dom';

// 1. Iconos personalizados
const createPetIcon = (imgUrl: string, type: 'PERDIDO' | 'ENCONTRADO') => {
  const borderClass = type === 'PERDIDO' ? 'border-brand-salmon' : 'border-brand-menta';
  return L.divIcon({
    className: 'bg-transparent border-none', 
    html: `
      <div class="relative w-12 h-12 flex items-center justify-center">
        <div class="relative w-10 h-10 rounded-full border-2 ${borderClass} shadow-md overflow-hidden bg-white z-10">
           <img src="${imgUrl}" class="w-full h-full object-cover" style="object-fit: cover;" />
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const myLocationIcon = L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="relative w-4 h-4 flex items-center justify-center"><div class="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping"></div><div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

// 2. Controles del Mapa
const MapControls = ({ 
    myPos, 
    currentFilter, 
    onFilterChange 
}: { 
    myPos: L.LatLngExpression, 
    currentFilter: string, 
    onFilterChange: (f: 'TODOS' | 'PERDIDO' | 'ENCONTRADO') => void 
}) => {
    const map = useMap();
    const [showMenu, setShowMenu] = useState(false); 

    return (
        <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-[1000] items-end">
            
            {showMenu && (
                <div className="bg-white rounded-xl shadow-xl p-2 mb-2 w-48 border border-gray-100 animate-in slide-in-from-right-5 fade-in duration-200">
                    <p className="text-[10px] uppercase font-bold text-gray-400 px-3 py-2">Filtrar Mapa</p>
                    
                    <button onClick={() => { onFilterChange('TODOS'); setShowMenu(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex justify-between items-center ${currentFilter === 'TODOS' ? 'bg-gray-100 text-brand-text' : 'text-gray-500 hover:bg-gray-50'}`}>Ver Todos {currentFilter === 'TODOS' && <Check size={14}/>}</button>
                    <button onClick={() => { onFilterChange('PERDIDO'); setShowMenu(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex justify-between items-center ${currentFilter === 'PERDIDO' ? 'bg-red-50 text-brand-salmon' : 'text-gray-500 hover:bg-gray-50'}`}>Solo Perdidos {currentFilter === 'PERDIDO' && <Check size={14}/>}</button>
                    <button onClick={() => { onFilterChange('ENCONTRADO'); setShowMenu(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex justify-between items-center ${currentFilter === 'ENCONTRADO' ? 'bg-teal-50 text-brand-menta' : 'text-gray-500 hover:bg-gray-50'}`}>Solo Encontrados {currentFilter === 'ENCONTRADO' && <Check size={14}/>}</button>
                </div>
            )}

            <button onClick={() => map.flyTo(myPos as L.LatLngTuple, 15, { duration: 1.5 })} className="bg-white p-3 rounded-full shadow-lg text-gray-600 active:bg-gray-50 hover:text-brand-salmon transition-colors">
                <LocateFixed size={20} />
            </button>
            
            <button onClick={() => setShowMenu(!showMenu)} className={`p-3 rounded-full shadow-lg transition-colors ${showMenu ? 'bg-brand-text text-white' : 'bg-white text-gray-600 hover:text-brand-salmon'}`}>
                <Layers size={20} />
            </button>
        </div>
    );
};

// 3. Controlador de Vista (Evita errores de bucle)
const LocationController = ({ center }: { center: L.LatLngExpression | null }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            // Usamos flyTo en lugar de setView para evitar conflictos síncronos bruscos
            map.flyTo(center as L.LatLngTuple, 14, { animate: true, duration: 1.5 });
        }
    }, [center, map]);
    return null;
};

// 4. Componente Principal
function MapBackground({ filter = 'TODOS' }: { filter?: 'TODOS' | 'PERDIDO' | 'ENCONTRADO' }) {
    const { pets } = usePets();
    const navigate = useNavigate();
    
    const [localFilter, setLocalFilter] = useState<'TODOS' | 'PERDIDO' | 'ENCONTRADO'>('TODOS');
    const currentFilter = filter !== 'TODOS' ? filter : localFilter;

    // Estado inicial NULL para mostrar cargando
    const [myPosition, setMyPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Éxito GPS
                    setMyPosition([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error GPS", error);
                    // Fallo GPS: Usamos setTimeout para evitar el error "Synchronous update"
                    setTimeout(() => {
                        setMyPosition([-34.6037, -58.3816] as [number, number]); 
                    }, 0);
                }
            );
        } else {
            // No hay GPS: Usamos setTimeout
            setTimeout(() => {
                setMyPosition([-34.6037, -58.3816] as [number, number]);
            }, 0);
        }
    }, []);

    // Pantalla de Carga
    if (!myPosition) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400 gap-2">
                <Loader2 className="animate-spin text-brand-salmon" size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Localizando...</span>
            </div>
        );
    }

    const filteredPets = currentFilter === 'TODOS' ? pets : pets.filter(p => p.type === currentFilter);

    return (
        <MapContainer center={myPosition} zoom={14} className="w-full h-full" zoomControl={false}>
            {/* Controlador seguro */}
            <LocationController center={myPosition} />
            
            <MapControls 
                myPos={myPosition} 
                currentFilter={currentFilter}
                onFilterChange={setLocalFilter}
            />

            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            <Marker position={myPosition} icon={myLocationIcon} />

            {filteredPets.map(pet => {
                const zoneColor = pet.type === 'PERDIDO' ? '#FF9B9B' : '#8AC6D1'; 
                return (
                    <React.Fragment key={pet.id}>
                        <Circle 
                            center={[pet.lat, pet.lng]}
                            pathOptions={{ color: zoneColor, fillColor: zoneColor, fillOpacity: 0.4, weight: 0, className: 'animate-pulse' }}
                            radius={400}
                            eventHandlers={{ click: () => navigate(`/mascota/${pet.id}`) }}
                        />
                        <Marker 
                            position={[pet.lat, pet.lng]}
                            icon={createPetIcon(pet.img, pet.type)}
                            eventHandlers={{ click: () => navigate(`/mascota/${pet.id}`) }}
                        />
                    </React.Fragment>
                );
            })}
        </MapContainer>
    );
}

export default MapBackground;