// src/components/MainApp.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Dashboard from './Dashboard';
import LoadingScreen from './common/LoadingScreen';

/**
 * Componente principal que maneja el estado de autenticación
 * y muestra el contenido apropiado según el estado del usuario
 */
export const MainApp: React.FC = () => {
  const { loading, isAuthenticated, user } = useAuth();

  // Mostrar pantalla de carga mientras se inicializa
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      <ProtectedRoute requireAuth={true}>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
};