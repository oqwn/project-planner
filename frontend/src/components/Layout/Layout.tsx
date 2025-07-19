import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="layout">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};
