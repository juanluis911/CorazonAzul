// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './common/UserProfile';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Header con información del usuario */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="logo-section">
            <h1 className="main-title">
              <span className="mente">Mente</span>
              <span className="azul">Azul</span>
            </h1>
          </div>

          <div className="user-section">
            <div className="welcome-message">
              <h2>
                ¡Hola, {user.displayName}! 👋
              </h2>
              {user.role === 'parent' && user.profile.childName && (
                <p className="child-info">
                  Perfil de: <strong>{user.profile.childName}</strong>
                  {user.profile.childAge && ` (${user.profile.childAge} años)`}
                </p>
              )}
            </div>

            <div className="user-controls">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="profile-btn"
                aria-label="Ver perfil de usuario"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Avatar" 
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="user-name">{user.displayName}</span>
              </button>

              <button
                onClick={handleLogout}
                className="logout-btn"
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Perfil desplegable */}
        {showProfile && (
          <UserProfile 
            user={user} 
            onClose={() => setShowProfile(false)} 
          />
        )}
      </header>

      {/* Contenido principal */}
      <main className="dashboard-main">
        <div className="main-container">
          
          {/* Mensaje de bienvenida personalizado */}
          <section className="welcome-section">
            <div className="welcome-card">
              <h3>
                🎉 ¡Bienvenido a tu espacio de aprendizaje!
              </h3>
              <p>
                {user.role === 'parent' 
                  ? `Aquí podrás encontrar juegos y actividades especialmente diseñados para ${user.profile.childName || 'tu hijo/a'}.`
                  : 'Aquí encontrarás herramientas educativas especializadas para tus estudiantes.'
                }
              </p>
              <div className="subscription-status">
                <span className={`status-badge ${user.subscription.status}`}>
                  Plan {user.subscription.plan === 'free' ? 'Gratuito' : 'Premium'}
                </span>
              </div>
            </div>
          </section>

          {/* Navegación principal */}
          <section className="main-navigation">
            <h3>¿Qué te gustaría hacer hoy?</h3>
            
            <div className="nav-grid">
              <button 
                className="nav-card primary"
                onClick={() => console.log('Ir a Juegos')}
                aria-label="Acceder a los juegos educativos"
              >
                <div className="card-icon">🎮</div>
                <h4>Juegos Educativos</h4>
                <p>Actividades interactivas para desarrollar habilidades</p>
                <div className="card-stats">
                  {user.profile.progress.gamesCompleted} juegos completados
                </div>
              </button>
              
              <button 
                className="nav-card secondary"
                onClick={() => console.log('Ir a Progreso')}
                aria-label="Ver progreso de aprendizaje"
              >
                <div className="card-icon">📊</div>
                <h4>Mi Progreso</h4>
                <p>Seguimiento del desarrollo y logros</p>
                <div className="card-stats">
                  Nivel {user.profile.progress.currentLevel}
                </div>
              </button>
              
              <button 
                className="nav-card tertiary"
                onClick={() => console.log('Ir a Recursos')}
                aria-label="Acceder a recursos educativos"
              >
                <div className="card-icon">📚</div>
                <h4>Recursos</h4>
                <p>Guías y material de apoyo</p>
                <div className="card-stats">
                  Para {user.role === 'parent' ? 'padres' : 'educadores'}
                </div>
              </button>
              
              <button 
                className="nav-card quaternary"
                onClick={() => setShowProfile(true)}
                aria-label="Configurar preferencias"
              >
                <div className="card-icon">⚙️</div>
                <h4>Configuración</h4>
                <p>Personalizar experiencia y accesibilidad</p>
                <div className="card-stats">
                  Tema: {user.profile.preferences.theme}
                </div>
              </button>
            </div>
          </section>

          {/* Actividad reciente */}
          <section className="recent-activity">
            <h3>Actividad Reciente</h3>
            <div className="activity-card">
              <div className="activity-content">
                <p>
                  🎯 Te registraste en MenteAzul con éxito
                </p>
                <p className="activity-time">
                  {user.createdAt.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* Información del proyecto */}
          <section className="project-info">
            <div className="info-card">
              <h4>📋 Estado del Proyecto CorazónAzul</h4>
              <ul className="project-status">
                <li>✅ Sistema de autenticación implementado</li>
                <li>✅ Dashboard personalizado</li>
                <li>✅ Perfiles de usuario especializados</li>
                <li>⏳ Juegos educativos (próximamente)</li>
                <li>⏳ Sistema de progreso (próximamente)</li>
                <li>⏳ Recursos para padres (próximamente)</li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-container">
          <p>
            <strong>MenteAzul</strong> - Proyecto CorazónAzul v0.1.0
          </p>
          <p>
            Desarrollado con ❤️ para la comunidad TEA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;