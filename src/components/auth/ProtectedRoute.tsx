// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: 'parent' | 'therapist' | 'educator';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  requiredRole 
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <Navigate to="/login" replace />;
  }

  // Verificar rol requerido si se especifica
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="access-denied">
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <p>Rol requerido: {requiredRole}</p>
        <p>Tu rol actual: {user?.role}</p>
      </div>
    );
  }

  // Si está autenticado y tiene los permisos necesarios, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;