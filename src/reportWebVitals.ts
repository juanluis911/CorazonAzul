// Archivo para reportar Web Vitals - métricas importantes de performance
// Especialmente importante para usuarios con TEA que pueden ser sensibles a la latencia

import { ReportHandler } from 'web-vitals';

/**
 * Función para reportar métricas Web Vitals
 * Las Web Vitals son métricas clave para medir la experiencia del usuario
 * 
 * Para usuarios con TEA, la performance es crítica porque:
 * - Delays pueden causar frustración
 * - Interfaces lentas interrumpen el flujo de aprendizaje
 * - La predictibilidad es importante para la experiencia
 */
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Importación dinámica para no cargar la librería si no se necesita
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // CLS - Cumulative Layout Shift
      // Mide la estabilidad visual. Importante para usuarios con TEA
      // que pueden ser sensibles a cambios inesperados en la interfaz
      getCLS(onPerfEntry);
      
      // FID - First Input Delay  
      // Mide la capacidad de respuesta a la primera interacción
      // Crítico para la experiencia interactiva de los juegos
      getFID(onPerfEntry);
      
      // FCP - First Contentful Paint
      // Mide cuándo aparece el primer contenido
      // Importante para reducir la ansiedad de carga
      getFCP(onPerfEntry);
      
      // LCP - Largest Contentful Paint
      // Mide cuándo se carga el contenido principal
      // Esencial para que los juegos se carguen rápidamente
      getLCP(onPerfEntry);
      
      // TTFB - Time to First Byte
      // Mide la velocidad del servidor
      // Fundamental para una experiencia fluida
      getTTFB(onPerfEntry);
    });
  }
};

/**
 * Configuración específica para el proyecto MenteAzul
 * Métricas adicionales importantes para educación especializada
 */
export const setupPerformanceMonitoring = () => {
  // Monitoreo de métricas específicas para TEA
  const measureUserInteractionLatency = () => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          console.log(`Latencia de interacción: ${entry.duration}ms`);
          
          // Si la latencia es muy alta, podríamos tomar acciones
          if (entry.duration > 100) {
            console.warn('Latencia alta detectada - puede afectar experiencia TEA');
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
  };

  // Monitoreo de errores JavaScript que podrían interrumpir los juegos
  const setupErrorTracking = () => {
    window.addEventListener('error', (event) => {
      console.error('Error JavaScript:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
      
      // En producción, enviarías estos errores a un servicio de monitoreo
      if (process.env.NODE_ENV === 'production') {
        // Ejemplo: enviar a servicio de monitoreo
        // analytics.track('javascript-error', errorData);
      }
    });
  };

  // Monitoreo de memoria para prevenir problemas de performance
  const monitorMemoryUsage = () => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      
      const checkMemory = () => {
        const usedMB = memoryInfo.usedJSHeapSize / 1048576;
        const totalMB = memoryInfo.totalJSHeapSize / 1048576;
        const limitMB = memoryInfo.jsHeapSizeLimit / 1048576;
        
        console.log(`Memoria utilizada: ${usedMB.toFixed(2)}MB de ${totalMB.toFixed(2)}MB (límite: ${limitMB.toFixed(2)}MB)`);
        
        // Alertar si el uso de memoria es muy alto
        if (usedMB / limitMB > 0.8) {
          console.warn('Uso alto de memoria detectado');
        }
      };
      
      // Verificar memoria cada 30 segundos en desarrollo
      if (process.env.NODE_ENV === 'development') {
        setInterval(checkMemory, 30000);
      }
    }
  };

  // Configurar todos los monitoreos
  measureUserInteractionLatency();
  setupErrorTracking();
  monitorMemoryUsage();
};

/**
 * Función para medir tiempo de carga específico de juegos
 * Útil para optimizar la experiencia de los usuarios con TEA
 */
export const measureGameLoadTime = (gameName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    console.log(`Tiempo de carga del juego "${gameName}": ${loadTime.toFixed(2)}ms`);
    
    // Alertar si el tiempo de carga es muy alto
    if (loadTime > 2000) {
      console.warn(`Juego "${gameName}" tardó más de 2 segundos en cargar`);
    }
    
    return loadTime;
  };
};

/**
 * Función para medir tiempo de respuesta a interacciones
 * Especialmente importante para mantener la atención de usuarios con TEA
 */
export const measureInteractionResponse = (interactionType: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    console.log(`Tiempo de respuesta "${interactionType}": ${responseTime.toFixed(2)}ms`);
    
    // La respuesta debe ser menor a 100ms para buena experiencia
    if (responseTime > 100) {
      console.warn(`Respuesta lenta en "${interactionType}": ${responseTime.toFixed(2)}ms`);
    }
    
    return responseTime;
  };
};

export default reportWebVitals;