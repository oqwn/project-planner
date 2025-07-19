import React from 'react';
import './RecentActivity.css';

interface Activity {
  id: string;
  type: 'task_created' | 'task_completed' | 'comment_added' | 'file_uploaded' | 'milestone_reached';
  user: string;
  description: string;
  timestamp: string;
  targetItem?: string;
}

export const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'task_completed',
      user: 'Sarah Chen',
      description: 'completed',
      targetItem: 'User authentication flow',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'comment_added',
      user: 'Mike Johnson',
      description: 'commented on',
      targetItem: 'API integration testing',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'task_created',
      user: 'Emily Davis',
      description: 'created',
      targetItem: 'Mobile responsiveness',
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      type: 'file_uploaded',
      user: 'John Doe',
      description: 'uploaded file to',
      targetItem: 'Design System Documentation',
      timestamp: '8 hours ago'
    },
    {
      id: '5',
      type: 'milestone_reached',
      user: 'Lisa Wang',
      description: 'reached milestone',
      targetItem: 'MVP Release v1.0',
      timestamp: '1 day ago'
    },
    {
      id: '6',
      type: 'task_created',
      user: 'Tom Wilson',
      description: 'created',
      targetItem: 'Performance optimization',
      timestamp: '1 day ago'
    },
    {
      id: '7',
      type: 'comment_added',
      user: 'Sarah Chen',
      description: 'commented on',
      targetItem: 'Database schema update',
      timestamp: '2 days ago'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return '✅';
      case 'task_created': return '📋';
      case 'comment_added': return '💬';
      case 'file_uploaded': return '📎';
      case 'milestone_reached': return '🎯';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed': return 'green';
      case 'task_created': return 'blue';
      case 'comment_added': return 'purple';
      case 'file_uploaded': return 'orange';
      case 'milestone_reached': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h2>Recent Activity</h2>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className={`activity-icon ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="activity-content">
              <div className="activity-text">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-action">{activity.description}</span>
                {activity.targetItem && (
                  <span className="activity-target">{activity.targetItem}</span>
                )}
              </div>
              <div className="activity-time">{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="activity-footer">
        <button className="load-more-btn">Load More</button>
      </div>
    </div>
  );
};