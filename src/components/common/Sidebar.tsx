// src/components/common/Sidebar.tsx - Con navegación real
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  onToggle,
  className = '' 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState<string[]>(['juegos']);

  // Actualizar sección activa basada en la URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/juegos')) {
      setActiveSection('juegos');
      if (path.includes('/comunicacion')) setActiveSection('comunicacion');
      if (path.includes('/social')) setActiveSection('social');
      // ... otros juegos
    } else if (path.includes('/progreso')) {
      setActiveSection('progreso');
    } else if (path.includes('/recursos')) {
      setActiveSection('recursos');
      if (path.includes('/guias')) setActiveSection('guias');
    } else if (path.includes('/configuracion')) {
      setActiveSection('configuracion');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '🏠',
      path: '/dashboard'
    },
    {
      id: 'juegos',
      title: 'Juegos Educativos',
      icon: '🎮',
      children: [
        { id: 'comunicacion', title: 'Comunicación y Lenguaje', icon: '💬', path: '/juegos/comunicacion' },
        { id: 'social', title: 'Habilidades Sociales', icon: '👥', path: '/juegos/social' },
        { id: 'cognitivo', title: 'Desarrollo Cognitivo', icon: '🧠', path: '/juegos/cognitivo' },
        { id: 'sensorial', title: 'Integración Sensorial', icon: '🌈', path: '/juegos/sensorial' },
        { id: 'motor', title: 'Habilidades Motoras', icon: '🤸', path: '/juegos/motor' },
        { id: 'emocional', title: 'Regulación Emocional', icon: '😊', path: '/juegos/emocional' }
      ]
    },
    {
      id: 'progreso',
      title: 'Seguimiento',
      icon: '📊',
      children: [
        { id: 'estadisticas', title: 'Estadísticas', icon: '📈', path: '/progreso/estadisticas' },
        { id: 'logros', title: 'Logros', icon: '🏆', path: '/progreso/logros' },
        { id: 'reportes', title: 'Reportes', icon: '📄', path: '/progreso/reportes' }
      ]
    },
    {
      id: 'recursos',
      title: 'Recursos',
      icon: '📚',
      children: [
        { id: 'guias', title: 'Guías para Padres', icon: '👨‍👩‍👧‍👦', path: '/recursos/guias' },
        { id: 'articulos', title: 'Artículos', icon: '📖', path: '/recursos/articulos' },
        { id: 'videos', title: 'Videos Educativos', icon: '🎥', path: '/recursos/videos' }
      ]
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      icon: '⚙️',
      children: [
        { id: 'perfil', title: 'Mi Perfil', icon: '👤', path: '/configuracion/perfil' },
        { id: 'accesibilidad', title: 'Accesibilidad', icon: '♿', path: '/configuracion/accesibilidad' },
        { id: 'notificaciones', title: 'Notificaciones', icon: '🔔', path: '/configuracion/notificaciones' }
      ]
    }
  ];

  const styles: { [key: string]: React.CSSProperties } = {
    sidebarContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: isOpen ? '280px' : '70px',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      padding: isOpen ? '1.5rem' : '1rem 0.75rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      minHeight: '70px'
    },
    logo: {
      fontSize: '1.75rem',
      fontWeight: 'bold'
    },
    brandText: {
      fontSize: '1.25rem',
      fontWeight: '600',
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 0.3s ease'
    },
    toggleBtn: {
      position: 'absolute',
      top: '1rem',
      right: '-15px',
      width: '30px',
      height: '30px',
      background: 'white',
      border: 'none',
      borderRadius: '50%',
      color: '#667eea',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.875rem',
      fontWeight: 'bold',
      transition: 'all 0.2s ease',
      zIndex: 1001
    },
    userSection: {
      padding: isOpen ? '1rem 1.5rem' : '1rem 0.75rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      flexShrink: 0
    },
    userInfo: {
      display: isOpen ? 'block' : 'none',
      overflow: 'hidden'
    },
    userName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      margin: 0,
      lineHeight: 1.2
    },
    userRole: {
      fontSize: '0.75rem',
      opacity: 0.8,
      margin: 0
    },
    navigation: {
      flex: 1,
      padding: '1rem 0',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: isOpen ? '0.75rem 1.5rem' : '0.75rem',
      background: 'none',
      border: 'none',
      color: 'white',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.875rem',
      textDecoration: 'none',
      gap: '0.75rem',
      margin: '2px 0.5rem',
      borderRadius: '8px'
    },
    menuItemActive: {
      background: 'rgba(255, 255, 255, 0.15)',
      fontWeight: '600'
    },
    menuIcon: {
      fontSize: '1.25rem',
      width: '24px',
      textAlign: 'center',
      flexShrink: 0
    },
    menuText: {
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 0.3s ease',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    expandIcon: {
      marginLeft: 'auto',
      transition: 'transform 0.2s ease',
      fontSize: '0.75rem'
    },
    submenu: {
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
      background: 'rgba(0, 0, 0, 0.1)',
      margin: '0 0.5rem',
      borderRadius: '8px',
      marginTop: '2px'
    },
    submenuItem: {
      padding: isOpen ? '0.5rem 1rem 0.5rem 3rem' : '0.5rem 0.75rem',
      fontSize: '0.8rem',
      opacity: 0.9
    },
    footer: {
      padding: isOpen ? '1rem 1.5rem' : '1rem 0.75rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    logoutBtn: {
      width: '100%',
      padding: '0.75rem',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    }
  };

  const handleMenuClick = (item: any, hasChildren: boolean = false) => {
    if (hasChildren) {
      toggleSection(item.id);
    } else {
      setActiveSection(item.id);
      if (item.path) {
        navigate(item.path);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
    if (activeSection !== itemId) {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
    if (activeSection !== itemId) {
      e.currentTarget.style.background = 'none';
    }
  };

  const handleLogoutMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
  };

  const handleLogoutMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
  };

  return (
    <div className={className}>
      <aside style={styles.sidebarContainer}>
        {/* Toggle Button */}
        {onToggle && (
          <button 
            style={styles.toggleBtn}
            onClick={onToggle}
            aria-label={isOpen ? 'Contraer sidebar' : 'Expandir sidebar'}
          >
            {isOpen ? '‹' : '›'}
          </button>
        )}

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🧠💙</div>
          <div style={styles.brandText}>MenteAzul</div>
        </div>

        {/* User Section */}
        <div style={styles.userSection}>
          <div style={styles.userAvatar}>
            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user?.displayName || 'Usuario'}</p>
            <p style={styles.userRole}>
              {user?.role === 'parent' ? '👨‍👩‍👧‍👦 Padre/Madre' : 
               user?.role === 'therapist' ? '🩺 Terapeuta' : 
               user?.role === 'educator' ? '👩‍🏫 Educador' : 'Usuario'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={styles.navigation}>
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                style={{
                  ...styles.menuItem,
                  ...(activeSection === item.id ? styles.menuItemActive : {}),
                }}
                onClick={() => handleMenuClick(item, !!item.children)}
                onMouseOver={(e) => handleMouseOver(e, item.id)}
                onMouseOut={(e) => handleMouseOut(e, item.id)}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <span style={styles.menuText}>{item.title}</span>
                {item.children && isOpen && (
                  <span 
                    style={{
                      ...styles.expandIcon,
                      transform: expandedSections.includes(item.id) ? 'rotate(90deg)' : 'rotate(0deg)'
                    }}
                  >
                    ▶
                  </span>
                )}
              </button>

              {/* Submenu */}
              {item.children && (
                <div style={{
                  ...styles.submenu,
                  maxHeight: expandedSections.includes(item.id) && isOpen ? '300px' : '0'
                }}>
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      style={{
                        ...styles.menuItem,
                        ...styles.submenuItem,
                        ...(activeSection === child.id ? styles.menuItemActive : {})
                      }}
                      onClick={() => handleMenuClick(child)}
                      onMouseOver={(e) => handleMouseOver(e, child.id)}
                      onMouseOut={(e) => handleMouseOut(e, child.id)}
                    >
                      <span style={styles.menuIcon}>{child.icon}</span>
                      <span style={styles.menuText}>{child.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={styles.footer}>
          <button 
            style={styles.logoutBtn}
            onClick={handleLogout}
            onMouseOver={handleLogoutMouseOver}
            onMouseOut={handleLogoutMouseOut}
          >
            <span>🚪</span>
            {isOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </div>
  );
};

// Hook para controlar la sidebar
export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isOpen, toggle, open, close };
};

export default Sidebar;