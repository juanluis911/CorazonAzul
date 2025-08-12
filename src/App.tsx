// src/App.tsx - Actualizado con sistema de autenticación
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { MainApp } from './components/MainApp';
import './App.css';

/**
 * Componente raíz de MenteAzul
 * Envuelve toda la aplicación con el AuthProvider
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;