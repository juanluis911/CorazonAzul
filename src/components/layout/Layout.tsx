// src/components/layout/Layout.tsx
import React from 'react';
import Sidebar, { useSidebar } from '../common/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const { isOpen, toggle } = useSidebar();

  const mainContentStyle = {
    marginLeft: showSidebar ? (isOpen ? '280px' : '70px') : '0',
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar - solo mostrar si showSidebar es true */}
      {showSidebar && <Sidebar isOpen={isOpen} onToggle={toggle} />}
      
      {/* Main Content */}
      <main style={mainContentStyle}>
        {children}
      </main>
    </div>
  );
};

export default Layout;