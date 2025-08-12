// src/components/MainApp.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './auth/LoginForm';
import Dashboard from './Dashboard';

/**
 * Componente principal de la aplicación que maneja el enrutamiento
 * y la autenticación global
 */
export const MainApp: React.FC = () => {
  const { loading, isAuthenticated } = useAuth();

  // Mostrar pantalla de carga mientras se inicializa
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e9ecef',
          borderTop: '4px solid #2c5aa0',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2 style={{ color: '#2c5aa0', margin: '0 0 10px 0' }}>MenteAzul</h2>
        <p style={{ color: '#666', margin: 0 }}>Inicializando aplicación...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <div className="main-app">
        <Routes>
          {/* Ruta de login - solo visible si no está autenticado */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
            } 
          />
          
          {/* Ruta del dashboard - protegida */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Otras rutas */}
          <Route 
            path="/games" 
            element={
              isAuthenticated ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>🎮 Sección de Juegos</h2>
                  <p>En desarrollo - Próximamente disponible</p>
                  <button onClick={() => window.history.back()}>
                    Volver al Dashboard
                  </button>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/progress" 
            element={
              isAuthenticated ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>📊 Seguimiento de Progreso</h2>
                  <p>En desarrollo - Próximamente disponible</p>
                  <button onClick={() => window.history.back()}>
                    Volver al Dashboard
                  </button>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h2>⚙️ Configuración</h2>
                  <p>En desarrollo - Próximamente disponible</p>
                  <button onClick={() => window.history.back()}>
                    Volver al Dashboard
                  </button>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Ruta por defecto */}
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
          
          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>❌ Página no encontrada</h2>
                <p>La página que buscas no existe.</p>
                <button 
                  onClick={() => window.history.back()}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2c5aa0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Volver
                </button>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default MainApp;