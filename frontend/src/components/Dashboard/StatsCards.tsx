import React from 'react';
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
  const stats: StatCard[] = [
    {
      title: 'Total Tasks',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: '📋',
      color: 'blue'
    },
    {
      title: 'In Progress',
      value: '24',
      change: '+8%',
      trend: 'up',
      icon: '⚡',
      color: 'orange'
    },
    {
      title: 'Completed',
      value: '89',
      change: '+15%',
      trend: 'up',
      icon: '✅',
      color: 'green'
    },
    {
      title: 'Overdue',
      value: '7',
      change: '-3%',
      trend: 'down',
      icon: '⚠️',
      color: 'red'
    }
  ];

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
              <span className={`stat-change ${stat.trend}`}>
                {stat.change}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};