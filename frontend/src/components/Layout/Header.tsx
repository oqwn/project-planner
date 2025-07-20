import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/auth';
import { ProjectSwitcher } from '../ProjectSwitcher/ProjectSwitcher';
import './Header.css';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    authService.logout();
    logout();
    navigate('/login');
  };
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
        <ProjectSwitcher />
        
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
          <button className="user-menu-btn" onClick={handleLogout}>
            <div className="user-avatar-small">👤</div>
            <span className="user-name-header">{user?.name || 'User'}</span>
            <span className="dropdown-arrow">🚪</span>
          </button>
        </div>
      </div>
    </header>
  );
};
