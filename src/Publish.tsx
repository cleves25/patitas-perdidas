import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePets } from './PetContext';

function PublishScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addPet } = usePets();

  const state = location.state as { type?: 'PERDIDO' | 'ENCONTRADO' } | null;
  const mode = state?.type || 'PERDIDO';

  const themeColor = mode === 'PERDIDO' ? 'text-brand-salmon' : 'text-brand-menta';
  const borderColor = mode === 'PERDIDO' ? 'border-brand-salmon' : 'border-brand-menta';

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [name, setName] = useState(""); 
  const [myCoords, setMyCoords] = useState<{lat: number, lng: number} | null>(null);
  
  const hasGPS = typeof navigator !== 'undefined' && "geolocation" in navigator;
  const [locating, setLocating] = useState(hasGPS);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasGPS) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMyCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocating(false);
            },
            (error) => {
                console.error("Error GPS:", error);
                setLocating(false);
            }
        );
    }
  }, [hasGPS]);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  // --- AQUÍ ESTÁ EL CAMBIO MÁGICO ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // En lugar de crear una URL temporal, leemos el archivo como Base64
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Cuando termine de leer, el resultado será un texto largo que representa la imagen
        const base64String = reader.result as string;
        setSelectedImage(base64String);
      };

      // Iniciamos la lectura
      reader.readAsDataURL(file);
    }
  };
  // ----------------------------------

  const handlePublish = () => {
    if (!selectedImage || !name) {
        alert("¡Falta foto o nombre!");
        return;
    }
    
    const finalLat = myCoords ? myCoords.lat : -34.6037;
    const finalLng = myCoords ? myCoords.lng : -58.3816;

    const newPet = {
        id: Date.now(),
        name: name,
        type: mode,
        zone: 'Mi Ubicación Actual',
        details: 'Recién publicado',
        img: selectedImage, // Ahora guardamos el texto Base64, no la URL temporal
        lat: finalLat,
        lng: finalLng
    };

    addPet(newPet);
    alert(`¡Mascota publicada!`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full h-[100dvh] md:h-[850px] md:w-[430px] bg-white relative md:rounded-[50px] md:shadow-2xl flex flex-col md:border-[12px] border-brand-phone overflow-hidden">
        
        {/* HEADER */}
        <div className="px-6 pt-10 pb-4 bg-white border-b border-gray-100 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="text-brand-text" />
            </button>
            <h1 className="text-xl font-black text-brand-text">
                {mode === 'PERDIDO' ? 'Perdí mi Mascota' : 'Encontré una Mascota'}
            </h1>
        </div>

        {/* FORMULARIO */}
        <div className="flex-1 p-6 bg-brand-bg flex flex-col gap-6">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            <div onClick={handleCameraClick} className={`w-full h-56 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden group ${selectedImage ? borderColor : `border-gray-300 hover:${borderColor}`}`}>
                {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <div className={`bg-gray-100 p-5 rounded-full group-hover:scale-110 transition-transform`}>
                            <Camera size={32} className={`text-gray-400 group-hover:${themeColor}`} />
                        </div>
                        <span className={`font-bold text-sm text-gray-400 group-hover:${themeColor}`}>Toca para subir foto</span>
                    </>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <div className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 focus-within:${borderColor}`}>
                    <label className="text-xs font-bold text-gray-400 uppercase">Nombre</label>
                    <input type="text" placeholder="Ej: Rex" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 font-bold text-lg text-brand-text outline-none bg-transparent"/>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className={`p-2.5 rounded-full ${mode === 'PERDIDO' ? 'bg-red-100 text-brand-salmon' : 'bg-teal-100 text-brand-menta'}`}>
                        <MapPin size={22} className={locating ? "animate-bounce" : ""} />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Ubicación</label>
                        <p className="font-bold text-brand-text text-sm">
                            {locating ? "Buscando GPS..." : (myCoords ? "Ubicación detectada" : "Ubicación por defecto")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <button onClick={handlePublish} disabled={locating} className={`w-full text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform ${mode === 'PERDIDO' ? 'bg-brand-salmon' : 'bg-brand-menta'} ${locating ? 'opacity-50' : ''}`}>
                    {locating ? 'ESPERANDO GPS...' : 'PUBLICAR AHORA'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default PublishScreen;