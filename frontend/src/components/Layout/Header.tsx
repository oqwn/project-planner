import React from 'react';
import './Header.css';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="header-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="notifications">
          <button className="notification-btn">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
        </div>

        <div className="user-menu">
          <button className="user-menu-btn">
            <div className="user-avatar-small">👤</div>
            <span className="user-name-header">John Doe</span>
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </div>
    </header>
  );
};