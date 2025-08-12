// src/hooks/useSidebar.ts
import { useState, useEffect } from 'react';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(() => {
    // Verificar si estamos en el cliente y el ancho de pantalla
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true; // Valor por defecto para SSR
  });

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isOpen, toggle, open, close };
};