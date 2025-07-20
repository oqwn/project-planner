import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../services/api';
import type { ProjectProgress as ProjectProgressType } from '../../types/dashboard';
import './ProjectProgress.css';

export const ProjectProgress: React.FC = () => {
  const [projects, setProjects] = useState<ProjectProgressType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Using Project Alpha ID from test data
        const projectId = '550e8400-e29b-41d4-a716-446655440001';
        const projectProgress =
          await dashboardApi.getProjectProgress(projectId);
        setProjects(projectProgress);
      } catch (error) {
        console.error('Failed to load project progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'green';
      case 'at-risk':
        return 'yellow';
      case 'delayed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return '🟢';
      case 'at-risk':
        return '🟡';
      case 'delayed':
        return '🔴';
      default:
        return '⚫';
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
        {loading ? (
          <div className="loading-message">Loading projects...</div>
        ) : (
          projects.map((project) => (
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
                  <span
                    className={`status-indicator ${getStatusColor(project.status)}`}
                  >
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
          ))
        )}
      </div>

      <div className="progress-summary">
        <div className="summary-stat">
          <span className="stat-label">Average Progress</span>
          <span className="stat-value">
            {projects.length > 0
              ? Math.round(
                  projects.reduce((sum, p) => sum + p.progress, 0) /
                    projects.length
                )
              : 0}
            %
          </span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">On Track</span>
          <span className="stat-value">
            {projects.filter((p) => p.status === 'on-track').length}/
            {projects.length}
          </span>
        </div>
      </div>
    </div>
  );
};
