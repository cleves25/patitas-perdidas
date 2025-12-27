import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePets } from './PetContext';

function ChatScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pets, messages, addMessage } = usePets(); // Si esto falla, es el paso 2
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const petId = Number(id);
  const pet = pets.find((p) => p.id === petId);

  // Filtramos mensajes o iniciamos array vacío si no existen
  const myChat = messages ? messages.filter(m => m.petId === petId) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [myChat]);

  useEffect(() => {
    const lastMsg = myChat[myChat.length - 1];
    if (lastMsg && lastMsg.sender === 'ME') {
        const timeout = setTimeout(() => {
            const responses = [
                "¡Hola! Sí, todavía lo tengo.",
                "¿Estás cerca de la zona?",
                "Podemos coordinar para vernos.",
                "Gracias por escribir.",
                "Sisi, es ese mismo."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(petId, randomResponse, 'OTHER');
        }, 1500);
        return () => clearTimeout(timeout);
    }
  }, [myChat, addMessage, petId]);

  const handleSend = () => {
    if (inputText.trim()) {
        addMessage(petId, inputText, 'ME');
        setInputText("");
    }
  };

  if (!pet) return <div className="p-10 text-center">Cargando chat... (Si no carga, vuelve al inicio)</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full h-[100dvh] md:h-[850px] md:w-[430px] bg-[#E5DDD5] relative md:rounded-[50px] md:shadow-2xl flex flex-col md:border-[12px] border-brand-phone overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-brand-text px-4 py-3 flex items-center gap-3 shadow-md z-10 text-white">
            <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <img src={pet.img} alt="Pet" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
                <h2 className="font-bold text-base leading-none">{pet.name}</h2>
                <p className="text-[10px] opacity-80 mt-1">En línea</p>
            </div>
            <Phone size={20} className="mr-2" />
            <MoreVertical size={20} />
        </div>

        {/* MENSAJES */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
            <div className="flex justify-center my-4">
                <span className="bg-yellow-100 text-yellow-800 text-[10px] px-3 py-1 rounded-lg shadow-sm font-medium border border-yellow-200">
                    Chat sobre {pet.name}
                </span>
            </div>
            {myChat.map((msg) => (
                <div key={msg.id} className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm relative ${msg.sender === 'ME' ? 'bg-[#E7FFDB] self-end rounded-tr-none text-gray-800' : 'bg-white self-start rounded-tl-none text-gray-800'}`}>
                    <p>{msg.text}</p>
                    <span className="text-[9px] text-gray-400 absolute bottom-1 right-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="bg-gray-100 px-2 py-2 flex items-center gap-2">
            <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                type="text" placeholder="Mensaje..." 
                className="flex-1 bg-white rounded-full px-4 py-3 text-sm focus:outline-none border-none shadow-sm"
            />
            <button onClick={handleSend} className="bg-brand-menta p-3 rounded-full text-white shadow-md active:scale-95 transition-transform">
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;