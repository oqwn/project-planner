import React from 'react';
import { StatsCards } from './StatsCards';
import { TasksOverview } from './TasksOverview';
import { RecentActivity } from './RecentActivity';
import { ProjectProgress } from './ProjectProgress';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your projects.</p>
      </div>

      <StatsCards />

      <div className="dashboard-grid">
        <div className="dashboard-card tasks-overview">
          <TasksOverview />
        </div>
        
        <div className="dashboard-card recent-activity">
          <RecentActivity />
        </div>
        
        <div className="dashboard-card project-progress">
          <ProjectProgress />
        </div>
      </div>
    </div>
  );
};