// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>
            {getGreeting()}, {user.displayName}!
          </h1>
          <p style={{ margin: 0, color: '#666' }}>
            {user.role === 'parent' && user.profile.childName
              ? `Continuemos el aprendizaje de ${user.profile.childName}`
              : 'Continuemos con el aprendizaje'}
          </p>
          <div style={{ marginTop: '10px' }}>
            <span style={{
              padding: '4px 12px',
              backgroundColor: user.subscription.status === 'active' ? '#28a745' : '#ffc107',
              color: 'white',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Plan {user.subscription.plan === 'free' ? 'Gratuito' : 'Premium'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2c5aa0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showProfile ? 'Ocultar Perfil' : 'Ver Perfil'}
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Perfil (si está visible) */}
      {showProfile && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c5aa0' }}>Información del Perfil</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h4>Información Personal</h4>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
              {user.role === 'parent' && (
                <>
                  <p><strong>Nombre del niño/a:</strong> {user.profile.childName || 'No especificado'}</p>
                  <p><strong>Edad:</strong> {user.profile.childAge || 'No especificada'}</p>
                  <p><strong>Diagnóstico:</strong> {user.profile.diagnosis || 'No especificado'}</p>
                </>
              )}
            </div>
            
            <div>
              <h4>Preferencias</h4>
              <p><strong>Tema:</strong> {user.profile.preferences.theme}</p>
              <p><strong>Tamaño de fuente:</strong> {user.profile.preferences.fontSize}</p>
              <p><strong>Reducir animaciones:</strong> {user.profile.preferences.reduceMotion ? 'Sí' : 'No'}</p>
              <p><strong>Sonidos:</strong> {user.profile.preferences.soundEnabled ? 'Habilitados' : 'Deshabilitados'}</p>
            </div>
            
            <div>
              <h4>Progreso</h4>
              <p><strong>Nivel actual:</strong> {user.profile.progress.currentLevel}</p>
              <p><strong>Juegos completados:</strong> {user.profile.progress.gamesCompleted}</p>
              <p><strong>Tiempo total:</strong> {Math.round(user.profile.progress.totalTimeSpent / 60)} minutos</p>
              <p><strong>Logros:</strong> {user.profile.progress.achievements.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎮</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>Juegos Completados</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {user.profile.progress.gamesCompleted}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏰</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>Tiempo de Aprendizaje</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>
            {Math.round(user.profile.progress.totalTimeSpent / 60)} min
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏆</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>Logros</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {user.profile.progress.achievements.length}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📈</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c5aa0' }}>Nivel Actual</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
            {user.profile.progress.currentLevel}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0, color: '#2c5aa0' }}>Acciones Rápidas</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          <button style={{
            padding: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontWeight: 'bold' }}>Continuar Aprendizaje</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Retoma donde lo dejaste</div>
          </button>

          <button style={{
            padding: '20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontWeight: 'bold' }}>Ver Progreso Detallado</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Seguimiento completo</div>
          </button>

          <button style={{
            padding: '20px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎮</div>
            <div style={{ fontWeight: 'bold' }}>Explorar Juegos</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Nuevas actividades</div>
          </button>

          <button style={{
            padding: '20px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
            <div style={{ fontWeight: 'bold' }}>Configuración</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Personalizar experiencia</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;