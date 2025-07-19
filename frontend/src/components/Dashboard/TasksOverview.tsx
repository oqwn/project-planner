import React, { useState } from 'react';
import './TasksOverview.css';

interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
}

export const TasksOverview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Design system implementation',
      assignee: 'Sarah Chen',
      dueDate: '2025-01-25',
      priority: 'high',
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'API integration testing',
      assignee: 'Mike Johnson',
      dueDate: '2025-01-23',
      priority: 'medium',
      status: 'todo'
    },
    {
      id: '3',
      title: 'User authentication flow',
      assignee: 'Emily Davis',
      dueDate: '2025-01-20',
      priority: 'high',
      status: 'overdue'
    },
    {
      id: '4',
      title: 'Database optimization',
      assignee: 'John Doe',
      dueDate: '2025-01-28',
      priority: 'low',
      status: 'completed'
    },
    {
      id: '5',
      title: 'Mobile responsiveness',
      assignee: 'Lisa Wang',
      dueDate: '2025-01-26',
      priority: 'medium',
      status: 'in-progress'
    }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || task.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'overdue': return 'red';
      case 'todo': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <div className="tasks-overview">
      <div className="tasks-header">
        <h2>Tasks Overview</h2>
        <button className="create-task-btn">+ Create Task</button>
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
          {filteredTasks.map((task) => (
            <div key={task.id} className="table-row">
              <div className="col-title">
                <span className="task-title">{task.title}</span>
              </div>
              <div className="col-assignee">
                <div className="assignee">
                  <div className="assignee-avatar">
                    {task.assignee.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{task.assignee}</span>
                </div>
              </div>
              <div className="col-due">
                <span className={task.status === 'overdue' ? 'overdue-date' : ''}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="col-priority">
                <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div className="col-status">
                <span className={`status-badge ${getStatusColor(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
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