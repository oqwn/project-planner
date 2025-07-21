import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../services/api';
import { useProject } from '../../hooks/useProject';
import './StatsCards.css';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedProject } = useProject();

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!selectedProject) return;

        const dashboardStats = await dashboardApi.getStats(selectedProject.id);

        const statsData: StatCard[] = [
          {
            title: 'Total Tasks',
            value: dashboardStats.totalTasks.value.toString(),
            change: dashboardStats.totalTasks.trend,
            trend: dashboardStats.totalTasks.trend.startsWith('+')
              ? 'up'
              : 'down',
            icon: '📋',
            color: 'blue',
          },
          {
            title: 'In Progress',
            value: dashboardStats.inProgress.value.toString(),
            change: dashboardStats.inProgress.trend,
            trend: dashboardStats.inProgress.trend.startsWith('+')
              ? 'up'
              : 'down',
            icon: '⚡',
            color: 'orange',
          },
          {
            title: 'Completed',
            value: dashboardStats.completed.value.toString(),
            change: dashboardStats.completed.trend,
            trend: dashboardStats.completed.trend.startsWith('+')
              ? 'up'
              : 'down',
            icon: '✅',
            color: 'green',
          },
          {
            title: 'Overdue',
            value: dashboardStats.overdue.value.toString(),
            change: dashboardStats.overdue.trend,
            trend: dashboardStats.overdue.trend.startsWith('-') ? 'down' : 'up',
            icon: '⚠️',
            color: 'red',
          },
        ];

        setStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [selectedProject]);

  if (loading) {
    return <div className="stats-cards loading">Loading stats...</div>;
  }

  return (
    <div className="stats-cards">
      {stats.map((stat) => (
        <div key={stat.title} className={`stat-card ${stat.color}`}>
          <div className="stat-icon">
            <span>{stat.icon}</span>
          </div>
          <div className="stat-content">
            <div className="stat-header">
              <h3 className="stat-title">{stat.title}</h3>
              <span className={`stat-change ${stat.trend}`}>{stat.change}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
