import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/auth';
import { ProjectSwitcher } from '../ProjectSwitcher/ProjectSwitcher';
import './Header.css';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
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
        <ProjectSwitcher />
      </div>

      <div className="header-right">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="search-input"
          />
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 19L14.65 14.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="notifications">
          <button className="notification-btn">
            <svg
              className="notification-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 6.5C15 5.17392 14.4732 3.90215 13.5355 2.96447C12.5979 2.02678 11.3261 1.5 10 1.5C8.67392 1.5 7.40215 2.02678 6.46447 2.96447C5.52678 3.90215 5 5.17392 5 6.5C5 12.5 2.5 14.5 2.5 14.5H17.5C17.5 14.5 15 12.5 15 6.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.44 18.5C11.2655 18.8031 11.0111 19.0547 10.7021 19.2275C10.3931 19.4004 10.0409 19.4883 9.68253 19.4818C9.32419 19.4754 8.97278 19.3749 8.66531 19.1908C8.35783 19.0068 8.10506 18.7454 7.93253 18.4337"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="notification-badge">3</span>
          </button>
        </div>

        <div className="user-menu">
          <button className="user-menu-btn" onClick={handleLogout}>
            <div className="user-avatar-small">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M5.5 20.5C5.5 17.4624 8.13401 15 11.5 15H12.5C15.866 15 18.5 17.4624 18.5 20.5V21.5H5.5V20.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="user-name-header">{user?.name || 'User'}</span>
            <svg
              className="dropdown-arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
