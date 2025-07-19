import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../services/api';
import type { RecentActivity as RecentActivityType } from '../../types/dashboard';
import './RecentActivity.css';

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<RecentActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      // Using a default project ID for now
      const projectId = '1a2b3c4d-5e6f-7890-abcd-ef1234567890';
      const recentActivities = await dashboardApi.getRecentActivities(
        projectId,
        page * limit
      );
      setActivities(recentActivities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setPage((prev) => prev + 1);
    await loadActivities();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return '✅';
      case 'task_created':
        return '📋';
      case 'comment_added':
        return '💬';
      case 'file_uploaded':
        return '📎';
      case 'milestone_reached':
        return '🎯';
      default:
        return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task_completed':
        return 'green';
      case 'task_created':
        return 'blue';
      case 'comment_added':
        return 'purple';
      case 'file_uploaded':
        return 'orange';
      case 'milestone_reached':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h2>Recent Activity</h2>
        <button className="view-all-btn">View All</button>
      </div>

      <div className="activity-list">
        {loading ? (
          <div className="loading-message">Loading activities...</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div
                className={`activity-icon ${getActivityColor(activity.type)}`}
              >
                {getActivityIcon(activity.type)}
              </div>

              <div className="activity-content">
                <div className="activity-text">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-action">{activity.action}</span>
                  {activity.target && (
                    <span className="activity-target">{activity.target}</span>
                  )}
                </div>
                <div className="activity-time">{activity.timestamp}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="activity-footer">
        <button className="load-more-btn" onClick={loadMore}>
          Load More
        </button>
      </div>
    </div>
  );
};
