import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '✅', label: 'Tasks', path: '/tasks' },
    { icon: '⏱️', label: 'Timesheets', path: '/timesheets' },
    { icon: '💬', label: 'Collaboration', path: '/collaboration' },
    { icon: '📈', label: 'Reports', path: '/reports' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          {!collapsed && <span className="logo-text">ProjectPlanner</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Project Manager</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};