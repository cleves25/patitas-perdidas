import React, { useState } from 'react';
import { Bell, PawPrint, MapPin, Home, User, Heart, Frown, ChevronUp, Search } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { usePets } from './PetContext';
import MapBackground from './MapBackground';

const PetListItem: React.FC<{
  name: string;
  details: string;
  zone: string;
  img: string;
  tagColor: string;
  tagName: string;
  onClick: () => void;
}> = ({ name, details, zone, img, tagColor, tagName, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-50 mb-3 cursor-pointer active:scale-95 transition-transform">
    <img src={img} alt={name} className="w-14 h-14 rounded-xl object-cover" />
    <div className="flex-1">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-brand-text text-base">{name}</h4>
                <p className="text-xs text-gray-400">{details}</p>
            </div>
            <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider ${tagColor}`}>
                {tagName}
            </span>
        </div>
      <p className="text-xs text-gray-400 flex items-center gap-1 font-medium mt-1">
        <MapPin size={12} /> {zone}
      </p>
    </div>
  </div>
);

function HomeScreen() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { pets } = usePets();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative font-sans">
      <div className="w-full h-[100dvh] md:h-[850px] md:w-[430px] bg-brand-bg relative overflow-hidden md:rounded-[50px] md:shadow-2xl flex flex-col md:border-[12px] border-brand-phone z-10">
      
        {/* HEADER */}
        {/* Agregamos transición para que también se oscurezca un poco si quieres, pero por ahora lo dejamos limpio */}
        <div className="px-6 pt-10 pb-4 bg-white z-20 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-black text-brand-text tracking-tight">Patitas Perdidas</h1>
                <div className="relative">
                    <Bell className="text-brand-text w-6 h-6" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                </div>
            </div>
            <div className="bg-brand-bg rounded-full p-2.5 flex items-center gap-3">
                <Search className="text-gray-400 w-4 h-4 ml-1" />
                <input type="text" placeholder="Buscar por nombre..." className="flex-1 bg-transparent border-none focus:outline-none text-brand-text text-sm font-medium placeholder-gray-400"/>
            </div>
        </div>

        {/* ÁREA CENTRAL */}
        <div className="flex-1 relative bg-gray-200 w-full h-full">
             
             {/* 1. EL MAPA (Fondo) */}
             <div className="absolute inset-0 z-0">
                <MapBackground />
             </div>

             {/* 2. CAPA DE "FONDO BORROSO" (Backdrop) */}
             {/* Esta capa aparece solo cuando isExpanded es true */}
             <div 
                className={`
                    absolute inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-500
                    ${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsExpanded(false)} // Si tocas el fondo borroso, se cierra la lista
             ></div>
             
             {/* 3. LOS BOTONES GIGANTES */}
             {/* Agregamos lógica para que se oculten y bajen cuando isExpanded es true */}
             <div className={`
                absolute inset-0 z-30 flex flex-col pointer-events-none transition-all duration-500 ease-in-out
                ${isExpanded ? 'opacity-0 translate-y-20 scale-95' : 'opacity-100 translate-y-0 scale-100'}
             `}>
                <div className="flex gap-4 px-6 py-6 pointer-events-auto">
                    <button 
                        onClick={() => navigate('/publicar', { state: { type: 'PERDIDO' } })}
                        className="flex-1 h-32 bg-brand-salmon rounded-[35px] relative overflow-hidden group hover:-translate-y-1 active:scale-95 transition-all shadow-lg shadow-red-200/50 flex items-center justify-center border-4 border-white/30"
                    >
                        <PawPrint size={120} className="absolute -bottom-10 -left-10 text-white opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500"/>
                        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shadow-sm">
                                <Frown size={28} className="text-white" strokeWidth={3} />
                            </div>
                            <div className="text-center leading-tight">
                                <span className="font-black text-lg block text-white tracking-wide">PERDÍ</span>
                                <span className="text-[10px] font-bold text-white/90 uppercase">Busco mi mascota</span>
                            </div>
                        </div>
                    </button>

                    <button 
                        onClick={() => navigate('/publicar', { state: { type: 'ENCONTRADO' } })}
                        className="flex-1 h-32 bg-brand-menta rounded-[35px] relative overflow-hidden group hover:-translate-y-1 active:scale-95 transition-all shadow-lg shadow-teal-200/50 flex items-center justify-center border-4 border-white/30"
                    >
                        <PawPrint size={120} className="absolute -bottom-10 -right-10 text-white opacity-10 -rotate-12 group-hover:scale-110 transition-transform duration-500"/>
                        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shadow-sm">
                                <Heart size={28} fill="white" className="text-white" />
                            </div>
                            <div className="text-center leading-tight">
                                <span className="font-black text-lg block text-white tracking-wide">ENCONTRÉ</span>
                                <span className="text-[10px] font-bold text-white/90 uppercase">Vi una mascota</span>
                            </div>
                        </div>
                    </button>
                </div>
             </div>
        </div>

        {/* LISTA DESLIZANTE */}
        {/* Z-INDEX 50 para que quede ENCIMA del fondo borroso */}
        <div className={`absolute left-0 right-0 bg-white rounded-t-[30px] shadow-[0_-5px_30px_rgba(0,0,0,0.15)] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50 flex flex-col border-t border-gray-100 ${isExpanded ? 'bottom-[70px] top-[180px]' : 'bottom-[70px] h-[40px]'} `}>
            <div className="w-full h-[40px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-t-[30px] transition-colors relative" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="absolute top-3 w-10 h-1 bg-gray-300 rounded-full"></div>
                <div className={`text-[10px] font-bold text-gray-400 mt-3 flex items-center gap-1 transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
                    <ChevronUp size={12} className="animate-bounce" />
                    Ver recientes
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4 scroll-smooth bg-gray-50/50">
                <h3 className="font-bold text-gray-800 mb-4 mt-2 px-1">Cerca de tu ubicación</h3>
                {pets.map((pet) => (
                    <PetListItem 
                        key={pet.id}
                        name={pet.name} 
                        details={pet.details} 
                        zone={pet.zone} 
                        img={pet.img} 
                        tagColor={pet.type === 'PERDIDO' ? 'bg-brand-salmon' : 'bg-brand-menta'} 
                        tagName={pet.type}
                        onClick={() => navigate(`/mascota/${pet.id}`)}
                    />
                ))}
            </div>
        </div>

        {/* MENÚ INFERIOR */}
        <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-white border-t border-gray-100 px-8 flex justify-between items-center z-40">
            <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <Home size={24} className="text-brand-active group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-brand-active">Home</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <PawPrint size={24} className="text-gray-300 group-hover:text-brand-text transition-colors" />
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-brand-text">Mascotas</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <Bell size={24} className="text-gray-300 group-hover:text-brand-text transition-colors" />
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-brand-text">Alertas</span>
            </div>
            <div 
                onClick={() => navigate('/perfil')} // <--- AHORA FUNCIONA
                className="flex flex-col items-center gap-1 cursor-pointer group"
            >
                <User size={24} className="text-gray-300 group-hover:text-brand-text transition-colors" />
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-brand-text">Perfil</span>
            </div>
        </div>

      </div>
    </div>
  );
}

export default HomeScreen;