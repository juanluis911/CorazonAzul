// src/components/common/LoadingScreen.tsx
import React from 'react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Logo animado */}
        <div className="loading-logo">
          <h1 className="loading-title">
            <span className="mente">Mente</span>
            <span className="azul">Azul</span>
          </h1>
        </div>

        {/* Spinner de carga */}
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-inner">🧩</div>
        </div>

        {/* Mensaje de carga */}
        <div className="loading-message">
          <p>Cargando MenteAzul...</p>
          <p className="loading-subtitle">
            Preparando tu experiencia de aprendizaje
          </p>
        </div>

        {/* Barra de progreso animada */}
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>

      {/* Información de accesibilidad */}
      <div className="loading-accessibility" aria-live="polite">
        Cargando aplicación. Por favor espera...
      </div>
    </div>
  );
};

export default LoadingScreen;