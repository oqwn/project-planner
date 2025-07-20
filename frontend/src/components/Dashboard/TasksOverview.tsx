import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../services/api';
import './TasksOverview.css';

interface DashboardTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
}

export const TasksOverview: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Using Project Alpha ID from test data
        const projectId = '550e8400-e29b-41d4-a716-446655440001';
        const recentTasks = await dashboardApi.getRecentTasks(projectId, 10);
        // Map Task to DashboardTask
        const dashboardTasks: DashboardTask[] = recentTasks.map((task) => ({
          id: task.id,
          title: task.title,
          assignee: task.assignee || task.assigneeName || 'Unassigned',
          dueDate: task.dueDate,
          priority: task.priority,
          status: task.status === 'parked' ? 'todo' : task.status,
        }));
        setTasks(dashboardTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || task.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in-progress':
        return 'blue';
      case 'overdue':
        return 'red';
      case 'todo':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <div className="tasks-overview">
      <div className="tasks-header">
        <h2>Tasks Overview</h2>
        <button className="create-task-btn" onClick={() => navigate('/tasks')}>
          + Create Task
        </button>
      </div>

      <div className="tasks-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="task-search"
          />
        </div>

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="task-filter"
        >
          <option value="all">All Tasks</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-title">Task</div>
          <div className="col-assignee">Assignee</div>
          <div className="col-due">Due Date</div>
          <div className="col-priority">Priority</div>
          <div className="col-status">Status</div>
        </div>

        <div className="table-body">
          {loading ? (
            <div className="loading-message">Loading tasks...</div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="table-row">
                <div className="col-title">
                  <span className="task-title">{task.title}</span>
                </div>
                <div className="col-assignee">
                  <div className="assignee">
                    <div className="assignee-avatar">
                      {task.assignee
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <span>{task.assignee}</span>
                  </div>
                </div>
                <div className="col-due">
                  <span
                    className={task.status === 'overdue' ? 'overdue-date' : ''}
                  >
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-priority">
                  <span
                    className={`priority-badge ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="col-status">
                  <span
                    className={`status-badge ${getStatusColor(task.status)}`}
                  >
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {filteredTasks.length === 0 && (
        <div className="no-tasks">
          <span>No tasks found matching your criteria</span>
        </div>
      )}
    </div>
  );
};
