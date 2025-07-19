import React from 'react';
import type { Task } from '../../types/task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  priorityColor: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  priorityColor,
}) => {
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true };
    if (diffDays === 0) return { text: 'Due today', isToday: true };
    if (diffDays === 1) return { text: 'Due tomorrow', isTomorrow: true };
    if (diffDays <= 7) return { text: `${diffDays}d left`, isThisWeek: true };
    return { text: `${diffDays}d left`, isNormal: true };
  };

  const dueDateInfo = getDaysUntilDue();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-card-header">
        <div className={`priority-indicator ${priorityColor}`}></div>
        <div className="task-actions">
          {task.attachments.length > 0 && (
            <span
              className="attachment-count"
              title={`${task.attachments.length} attachments`}
            >
              📎 {task.attachments.length}
            </span>
          )}
          {task.comments.length > 0 && (
            <span
              className="comment-count"
              title={`${task.comments.length} comments`}
            >
              💬 {task.comments.length}
            </span>
          )}
        </div>
      </div>

      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      {totalSubtasks > 0 && (
        <div className="subtasks-section">
          <div className="subtasks-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${subtaskProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        </div>
      )}

      <div className="task-meta">
        <div className="due-date">
          <span
            className={`due-date-text ${
              dueDateInfo.isOverdue
                ? 'overdue'
                : dueDateInfo.isToday
                  ? 'today'
                  : dueDateInfo.isTomorrow
                    ? 'tomorrow'
                    : dueDateInfo.isThisWeek
                      ? 'this-week'
                      : 'normal'
            }`}
          >
            🕒 {dueDateInfo.text}
          </span>
        </div>

        <div className="assignee-section">
          <div className="assignee-avatar" title={task.assigneeName}>
            {task.assigneeAvatar ? (
              <img
                src={task.assigneeAvatar}
                alt={task.assigneeName || task.assignee || 'Unknown'}
              />
            ) : (
              <span>
                {getInitials(task.assigneeName || task.assignee || 'Unknown')}
              </span>
            )}
          </div>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="task-tag">
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="tag-overflow">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {task.estimatedHours && (
        <div className="estimated-hours">
          ⏱️ {task.estimatedHours}h estimated
        </div>
      )}
    </div>
  );
};
