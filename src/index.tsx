import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Configuración de accesibilidad global
const configureAccessibility = () => {
  // Configurar focus management
  document.addEventListener('keydown', (e) => {
    // Mejorar navegación por teclado
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Configurar anuncios para lectores de pantalla
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Hacer disponible globalmente
  (window as any).announceToScreenReader = announceToScreenReader;
};

// Configurar error boundary global
const setupErrorHandling = () => {
  window.addEventListener('error', (event) => {
    console.error('Error global capturado:', event.error);
    
    // En producción, podrías enviar errores a un servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // Aquí integrarías con servicios como Sentry, LogRocket, etc.
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rechazada no manejada:', event.reason);
  });
};

// Inicializar configuraciones
configureAccessibility();
setupErrorHandling();

// Crear root de React 18
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Renderizar aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Configurar Web Vitals para monitoreo de performance
reportWebVitals((metric) => {
  // Registrar métricas importantes para la experiencia del usuario
  console.log('Web Vital:', metric);
  
  // En producción, enviarías estas métricas a tu servicio de analytics
  if (process.env.NODE_ENV === 'production') {
    // Ejemplo: enviar a Google Analytics, DataDog, etc.
    // analytics.track('web-vital', metric);
  }
});

// Configuración específica para usuarios con TEA
const configureForAccessibility = () => {
  // Detectar preferencias del sistema
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
  
  // Aplicar configuraciones según preferencias
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }
  
  if (prefersHighContrast) {
    document.documentElement.classList.add('high-contrast');
  }
  
  // Configurar tamaño de fuente si está configurado
  const savedFontSize = localStorage.getItem('mente-azul-font-size');
  if (savedFontSize) {
    document.documentElement.style.setProperty('--base-font-size', savedFontSize);
  }
  
  // Configurar tema si está guardado
  const savedTheme = localStorage.getItem('mente-azul-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
};

// Aplicar configuraciones de accesibilidad
configureForAccessibility();

// Monitorear cambios en preferencias del sistema
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', configureForAccessibility);
window.matchMedia('(prefers-contrast: high)').addEventListener('change', configureForAccessibility);