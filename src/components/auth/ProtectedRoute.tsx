// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Muestra el formulario de login si el usuario no está autenticado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  fallback
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no requiere auth, mostrar contenido
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si está autenticado, mostrar contenido protegido
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Si no está autenticado, mostrar login o fallback
  return fallback ? <>{fallback}</> : <LoginForm />;
};

export default ProtectedRoute;