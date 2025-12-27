import React, { createContext, useState, useContext, useEffect } from 'react';

// === 1. Tipos de Datos ===
export type Pet = {
  id: number;
  name: string;
  type: 'PERDIDO' | 'ENCONTRADO';
  zone: string;
  img: string;
  details: string; 
  lat: number;
  lng: number;
};

export type Message = {
  id: number;
  petId: number;
  text: string;
  sender: 'ME' | 'OTHER';
  timestamp: number;
};

// === 2. Definición ===
type PetContextType = {
  pets: Pet[];
  messages: Message[];
  addPet: (pet: Pet) => void;
  deletePet: (id: number) => void;
  addMessage: (petId: number, text: string, sender: 'ME' | 'OTHER') => void;
};

const PetContext = createContext<PetContextType | undefined>(undefined);

// === 3. El Proveedor ===
export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // CARGAR MASCOTAS
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem('myPetsApp_data');
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Rex', type: 'PERDIDO', zone: 'Parque Central', details: 'Caniche - Blanco', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RexDog', lat: -34.6037, lng: -58.3816 },
        { id: 2, name: 'Mishi', type: 'ENCONTRADO', zone: 'Av. Libertador', details: 'Gato - Naranja', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LunaCat', lat: -34.5800, lng: -58.4200 },
      ];
    } catch { 
      // <--- ¡ELIMINAMOS LA 'e'! Si falla, simplemente devolvemos array vacío
      return [];
    }
  });

  // CARGAR CHAT
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMsgs = localStorage.getItem('myPetsApp_chat');
      return savedMsgs ? JSON.parse(savedMsgs) : [];
    } catch { 
      // <--- AQUÍ TAMBIÉN: ¡Sin 'e'!
      return [];
    }
  });

  // Guardar cambios
  useEffect(() => {
    localStorage.setItem('myPetsApp_data', JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem('myPetsApp_chat', JSON.stringify(messages));
  }, [messages]);

  // Funciones
  const addPet = (pet: Pet) => {
    setPets((prev) => [pet, ...prev]);
  };
  
  const deletePet = (id: number) => {
    if (window.confirm("¿Estás seguro de borrar este aviso?")) {
      setPets((prev) => prev.filter(p => p.id !== id));
    }
  };

  const addMessage = (petId: number, text: string, sender: 'ME' | 'OTHER') => {
    const newMsg: Message = { 
        id: Date.now(), 
        petId, 
        text, 
        sender, 
        timestamp: Date.now() 
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <PetContext.Provider value={{ pets, messages, addPet, deletePet, addMessage }}>
      {children}
    </PetContext.Provider>
  );
};

// === 4. Hook ===
// eslint-disable-next-line react-refresh/only-export-components
export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) throw new Error("usePets error");
  return context;
};

export default PetProvider;