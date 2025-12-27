import React from 'react';
import { ArrowLeft, MapPin, MessageCircle, Share2, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'; // Importamos useNavigate
import { usePets } from './PetContext';

function PetDetail() {
  const navigate = useNavigate(); // Hook para navegar
  const { id } = useParams();
  const { pets } = usePets();

  const pet = pets.find((p) => p.id === Number(id));

  if (!pet) return <div>Mascota no encontrada</div>;

  const isLost = pet.type === 'PERDIDO';
  const themeColor = isLost ? 'bg-brand-salmon' : 'bg-brand-menta';
  const textColor = isLost ? 'text-brand-salmon' : 'text-brand-menta';

  // --- FUNCIÓN QUE ABRE EL CHAT ---
  const handleContact = () => {
    // Esto te lleva a la pantalla de chat que creamos
    navigate(`/chat/${pet.id}`); 
  };

  const handleShare = () => {
    if (navigator.share) {
        navigator.share({
            title: `Ayuda a ${pet.name}`,
            text: `Mira este aviso de mascota ${pet.type}: ${pet.name}`,
            url: window.location.href,
        });
    } else {
        alert("¡Enlace copiado!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full h-[100dvh] md:h-[850px] md:w-[430px] bg-white relative md:rounded-[50px] md:shadow-2xl flex flex-col md:border-[12px] border-brand-phone overflow-hidden">
        
        {/* FOTO */}
        <div className="relative h-[45%] w-full">
            <img src={pet.img} alt={pet.name} className="w-full h-full object-cover" />
            <button onClick={() => navigate(-1)} className="absolute top-10 left-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors">
                <ArrowLeft size={24} />
            </button>
            <button onClick={handleShare} className="absolute top-10 right-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors">
                <Share2 size={24} />
            </button>
            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent pt-20 flex items-end`}>
                 <span className={`px-3 py-1 rounded-full text-xs font-black text-white uppercase tracking-widest ${themeColor}`}>
                    {pet.type}
                 </span>
            </div>
        </div>

        {/* INFO */}
        <div className="flex-1 bg-brand-bg -mt-8 rounded-t-[40px] relative z-10 px-8 pt-10 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h1 className="text-3xl font-black text-brand-text">{pet.name}</h1>
                    <p className="text-gray-400 font-medium text-sm mt-1">{pet.details}</p>
                </div>
                <div className="bg-white p-3 rounded-full shadow-sm text-gray-300">
                    <Heart size={24} />
                </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500 mb-6 bg-white p-3 rounded-2xl shadow-sm border border-gray-50 w-fit mt-4">
                <MapPin size={18} className={textColor} />
                <span className="text-sm font-bold">{pet.zone}</span>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Sobre la mascota</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Ubicado en las coordenadas: {pet.lat.toFixed(4)}, {pet.lng.toFixed(4)}.
                    <br/>
                    ¡Ayuda a que vuelva a casa!
                </p>
            </div>

            {/* BOTÓN ACTUALIZADO */}
            <div className="mt-auto pb-8">
                <button 
                    onClick={handleContact} // <--- LLAMA A LA FUNCIÓN NUEVA
                    className={`w-full py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 text-white font-black text-lg ${themeColor}`}
                >
                    <MessageCircle size={24} fill="white" />
                    CHAT EN LA APP
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetail;