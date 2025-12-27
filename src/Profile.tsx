import React from 'react';
import { ArrowLeft, Trash2, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePets } from './PetContext';

function ProfileScreen() {
  const navigate = useNavigate();
  const { pets, deletePet } = usePets();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full h-[100dvh] md:h-[850px] md:w-[430px] bg-brand-bg relative md:rounded-[50px] md:shadow-2xl flex flex-col md:border-[12px] border-brand-phone overflow-hidden">
        
        {/* HEADER DE PERFIL */}
        <div className="bg-white px-6 pt-10 pb-8 rounded-b-[40px] shadow-sm z-10">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="text-brand-text" />
                </button>
                <h1 className="text-lg font-black text-brand-text">Mi Perfil</h1>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Settings className="text-gray-400" size={20} />
                </button>
            </div>

            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-brand-salmon p-1 mb-3">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-gray-100" />
                </div>
                <h2 className="text-xl font-black text-brand-text">Usuario Feliz</h2>
                <p className="text-sm text-gray-400 font-medium">Altos de San Lorenzo, LP</p>
                
                <div className="flex gap-4 mt-6 w-full">
                    <div className="flex-1 bg-gray-50 rounded-2xl p-3 text-center">
                        <span className="block text-xl font-black text-brand-text">{pets.length}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Publicados</span>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-2xl p-3 text-center">
                        <span className="block text-xl font-black text-brand-menta">0</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Resueltos</span>
                    </div>
                </div>
            </div>
        </div>

        {/* LISTA DE MIS AVISOS */}
        <div className="flex-1 overflow-y-auto p-6">
            <h3 className="font-bold text-gray-800 mb-4 px-1">Gestionar mis avisos</h3>
            
            {pets.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">No tienes publicaciones activas.</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {pets.map(pet => (
                        <div key={pet.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4">
                            <img src={pet.img} alt={pet.name} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold text-brand-text">{pet.name}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${pet.type === 'PERDIDO' ? 'bg-red-100 text-brand-salmon' : 'bg-teal-100 text-brand-menta'}`}>
                                    {pet.type}
                                </span>
                            </div>
                            
                            {/* BOTÓN DE BORRAR */}
                            <button 
                                onClick={() => deletePet(pet.id)}
                                className="p-3 bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button className="w-full mt-8 flex items-center justify-center gap-2 text-red-400 font-bold text-xs py-4 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={16} />
                Cerrar Sesión
            </button>
        </div>

      </div>
    </div>
  );
}

export default ProfileScreen;