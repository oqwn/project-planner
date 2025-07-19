import React from 'react';
import './ProjectProgress.css';

interface Project {
  id: string;
  name: string;
  progress: number;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  tasksCompleted: number;
  totalTasks: number;
}

export const ProjectProgress: React.FC = () => {
  const projects: Project[] = [
    {
      id: '1',
      name: 'Project Alpha',
      progress: 75,
      dueDate: '2025-02-15',
      status: 'on-track',
      tasksCompleted: 18,
      totalTasks: 24
    },
    {
      id: '2',
      name: 'Beta Release',
      progress: 45,
      dueDate: '2025-01-30',
      status: 'at-risk',
      tasksCompleted: 9,
      totalTasks: 20
    },
    {
      id: '3',
      name: 'Mobile App',
      progress: 30,
      dueDate: '2025-01-25',
      status: 'delayed',
      tasksCompleted: 6,
      totalTasks: 20
    },
    {
      id: '4',
      name: 'UI Redesign',
      progress: 90,
      dueDate: '2025-02-01',
      status: 'on-track',
      tasksCompleted: 27,
      totalTasks: 30
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'green';
      case 'at-risk': return 'yellow';
      case 'delayed': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return '🟢';
      case 'at-risk': return '🟡';
      case 'delayed': return '🔴';
      default: return '⚫';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  return (
    <div className="project-progress">
      <div className="progress-header">
        <h2>Project Progress</h2>
        <button className="manage-projects-btn">Manage</button>
      </div>

      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.id} className="project-item">
            <div className="project-header">
              <div className="project-info">
                <h3 className="project-name">{project.name}</h3>
                <div className="project-meta">
                  <span className="task-count">
                    {project.tasksCompleted}/{project.totalTasks} tasks
                  </span>
                  <span className="due-date">
                    {getDaysRemaining(project.dueDate)}
                  </span>
                </div>
              </div>
              
              <div className="project-status">
                <span className={`status-indicator ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                </span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${getStatusColor(project.status)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{project.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-summary">
        <div className="summary-stat">
          <span className="stat-label">Average Progress</span>
          <span className="stat-value">60%</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">On Track</span>
          <span className="stat-value">2/4</span>
        </div>
      </div>
    </div>
  );
};