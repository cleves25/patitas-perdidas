import React from 'react';
// CAMBIO 1: Importamos HashRouter en lugar de BrowserRouter
import { HashRouter, Routes, Route } from 'react-router-dom'; 
import HomeScreen from './Home';
import PublishScreen from './Publish';
import PetDetail from './PetDetail';
import ProfileScreen from './Profile';
import ChatScreen from './ChatScreen';
import { PetProvider } from './PetContext';

function App() {
  return (
    <PetProvider>
      {/* CAMBIO 2: Usamos HashRouter aquí */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/publicar" element={<PublishScreen />} />
          <Route path="/mascota/:id" element={<PetDetail />} />
          <Route path="/perfil" element={<ProfileScreen />} />
          <Route path="/chat/:id" element={<ChatScreen />} />
        </Routes>
      </HashRouter>
    </PetProvider>
  );
}

export default App;