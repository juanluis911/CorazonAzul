// src/components/MainApp.tsx - Con rutas para Q-CHAT
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './auth/LoginForm';
import Dashboard from './Dashboard';
import Layout from './layout/Layout';
import ParentGuidesPage from '../pages/ParentGuidesPage';

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
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2 style={{ color: '#667eea', margin: '0 0 10px 0' }}>MenteAzul</h2>
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
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm />
              )
            } 
          />
          
          {/* Rutas protegidas con Layout y Sidebar */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Layout>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Rutas de Juegos */}
          <Route 
            path="/juegos/*" 
            element={
              isAuthenticated ? (
                <Layout>
                  <div style={{ padding: '40px' }}>
                    <h2 style={{ color: '#667eea', marginBottom: '20px' }}>🎮 Sección de Juegos</h2>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '30px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                    }}>
                      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                        Aquí encontrarás todos los juegos educativos organizados por categorías.
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginTop: '20px'
                      }}>
                        <div style={{
                          padding: '20px',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          borderRadius: '12px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '30px', marginBottom: '10px' }}>💬</div>
                          <h4>Comunicación</h4>
                          <p style={{ fontSize: '14px', margin: 0 }}>En desarrollo</p>
                        </div>
                        <div style={{
                          padding: '20px',
                          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                          color: 'white',
                          borderRadius: '12px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '30px', marginBottom: '10px' }}>👥</div>
                          <h4>Habilidades Sociales</h4>
                          <p style={{ fontSize: '14px', margin: 0 }}>Próximamente</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Rutas de Progreso */}
          <Route 
            path="/progreso/*" 
            element={
              isAuthenticated ? (
                <Layout>
                  <div style={{ padding: '40px' }}>
                    <h2 style={{ color: '#667eea', marginBottom: '20px' }}>📊 Seguimiento de Progreso</h2>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '30px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                    }}>
                      <p style={{ fontSize: '18px' }}>
                        Aquí podrás ver estadísticas detalladas, logros y reportes de progreso.
                      </p>
                    </div>
                  </div>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Rutas de Recursos - NUEVA RUTA PARA GUÍAS DE PADRES */}
          <Route 
            path="/recursos/*" 
            element={
              isAuthenticated ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={
                      <div style={{ padding: '40px' }}>
                        <h2 style={{ color: '#667eea', marginBottom: '20px' }}>📚 Recursos Educativos</h2>
                        <div style={{
                          backgroundColor: 'white',
                          padding: '30px',
                          borderRadius: '12px',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                        }}>
                          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                            Explora nuestros recursos especializados para padres y educadores.
                          </p>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px'
                          }}>
                            <div style={{
                              padding: '25px',
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              color: 'white',
                              borderRadius: '12px',
                              cursor: 'pointer'
                            }}
                            onClick={() => window.location.href = '/recursos/guias'}
                            >
                              <div style={{ fontSize: '40px', marginBottom: '15px' }}>👨‍👩‍👧‍👦</div>
                              <h3>Guías para Padres</h3>
                              <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>
                                Q-CHAT, estrategias y herramientas especializadas
                              </p>
                            </div>
                            <div style={{
                              padding: '25px',
                              background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                              color: 'white',
                              borderRadius: '12px'
                            }}>
                              <div style={{ fontSize: '40px', marginBottom: '15px' }}>📖</div>
                              <h3>Artículos</h3>
                              <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>
                                Próximamente disponible
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    } />
                    <Route path="/guias" element={<ParentGuidesPage />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Rutas de Configuración */}
          <Route 
            path="/configuracion/*" 
            element={
              isAuthenticated ? (
                <Layout>
                  <div style={{ padding: '40px' }}>
                    <h2 style={{ color: '#667eea', marginBottom: '20px' }}>⚙️ Configuración</h2>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '30px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                    }}>
                      <p style={{ fontSize: '18px' }}>
                        Personaliza tu experiencia, ajusta preferencias de accesibilidad y más.
                      </p>
                    </div>
                  </div>
                </Layout>
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
              <Layout showSidebar={isAuthenticated}>
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '50vh'
                }}>
                  <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
                  <h2 style={{ color: '#667eea', marginBottom: '10px' }}>Página no encontrada</h2>
                  <p style={{ color: '#666', marginBottom: '20px' }}>
                    La página que buscas no existe o ha sido movida.
                  </p>
                  <button 
                    onClick={() => window.history.back()}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    ← Volver
                  </button>
                </div>
              </Layout>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default MainApp;