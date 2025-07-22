import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar collapsed={false} />
      <div className="main-content">
        <Header
          sidebarCollapsed={false}
        />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};
