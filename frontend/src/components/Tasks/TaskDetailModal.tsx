import React, { useState, useEffect } from 'react';
import type { Task, CreateTaskRequest } from '../../types/task';
import { TaskModal } from './TaskModal';
import './TaskDetailModal.css';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: CreateTaskRequest) => void;
  onDelete: (taskId: string) => void;
  teamMembers: Array<{ id: string; name: string; avatar?: string }>;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  teamMembers
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedSubtasks, setSelectedSubtasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (task) {
      const completedSubtasks = new Set(
        task.subtasks.filter(st => st.completed).map(st => st.id)
      );
      setSelectedSubtasks(completedSubtasks);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  if (isEditMode) {
    return (
      <TaskModal
        isOpen={isEditMode}
        onClose={() => setIsEditMode(false)}
        onSave={(taskData) => {
          onSave(taskData);
          setIsEditMode(false);
        }}
        task={task}
        teamMembers={teamMembers}
      />
    );
  }

  const handleSubtaskToggle = (subtaskId: string) => {
    const newSelected = new Set(selectedSubtasks);
    if (newSelected.has(subtaskId)) {
      newSelected.delete(subtaskId);
    } else {
      newSelected.add(subtaskId);
    }
    setSelectedSubtasks(newSelected);
    
    // Update the task with new subtask completion status
    const updatedSubtasks = task.subtasks.map(st => ({
      ...st,
      completed: newSelected.has(st.id)
    }));
    
    onSave({
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      subtasks: updatedSubtasks.map(st => ({ title: st.title, completed: st.completed, dependsOn: st.dependsOn })),
      tags: task.tags
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, this would call a function to add the comment
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return '#6b7280';
      case 'in-progress': return '#2563eb';
      case 'completed': return '#059669';
      case 'parked': return '#d97706';
      default: return '#6b7280';
    }
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
    if (diffDays === 0) return { text: 'Due today', isToday: true };
    if (diffDays === 1) return { text: 'Due tomorrow', isTomorrow: true };
    return { text: `${diffDays} days remaining`, isNormal: true };
  };

  const dueDateInfo = getDaysUntilDue();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="task-detail-header">
          <div className="task-detail-title-section">
            <div className="task-detail-priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
              {task.priority}
            </div>
            <h1 className="task-detail-title">{task.title}</h1>
            <div className="task-detail-status" style={{ backgroundColor: getStatusColor(task.status) }}>
              {task.status.replace('-', ' ')}
            </div>
          </div>
          
          <div className="task-detail-actions">
            <button 
              className="edit-btn"
              onClick={() => setIsEditMode(true)}
            >
              ✏️ Edit
            </button>
            <button 
              className="delete-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                }
              }}
            >
              🗑️ Delete
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="task-detail-content">
          <div className="task-detail-main">
            <div className="task-detail-section">
              <h3>Description</h3>
              <p className="task-description">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {task.subtasks.length > 0 && (
              <div className="task-detail-section">
                <h3>
                  Subtasks 
                  <span className="subtask-progress">
                    ({selectedSubtasks.size}/{task.subtasks.length} completed)
                  </span>
                </h3>
                <div className="subtasks-list">
                  {task.subtasks.map((subtask) => (
                    <label key={subtask.id} className="subtask-item">
                      <input
                        type="checkbox"
                        checked={selectedSubtasks.has(subtask.id)}
                        onChange={() => handleSubtaskToggle(subtask.id)}
                        className="subtask-checkbox"
                      />
                      <span className={`subtask-text ${selectedSubtasks.has(subtask.id) ? 'completed' : ''}`}>
                        {subtask.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {task.attachments.length > 0 && (
              <div className="task-detail-section">
                <h3>Attachments ({task.attachments.length})</h3>
                <div className="attachments-list">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="attachment-item">
                      <div className="attachment-icon">📎</div>
                      <div className="attachment-info">
                        <div className="attachment-name">{attachment.filename}</div>
                        <div className="attachment-meta">
                          {(attachment.fileSize / 1024).toFixed(1)} KB • 
                          Uploaded by {attachment.uploadedBy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="task-detail-section">
              <h3>Comments ({task.comments.length})</h3>
              
              <form onSubmit={handleAddComment} className="add-comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="comment-input"
                  rows={3}
                />
                <button type="submit" className="add-comment-btn" disabled={!newComment.trim()}>
                  Add Comment
                </button>
              </form>

              <div className="comments-list">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <strong className="comment-author">{comment.author}</strong>
                      <span className="comment-time">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))}
                
                {task.comments.length === 0 && (
                  <p className="no-comments">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>

          <div className="task-detail-sidebar">
            <div className="task-meta-section">
              <h4>Task Details</h4>
              
              <div className="meta-item">
                <label>Assignee</label>
                <div className="assignee-info">
                  <div className="assignee-avatar">
                    {task.assigneeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{task.assigneeName}</span>
                </div>
              </div>

              <div className="meta-item">
                <label>Due Date</label>
                <div className={`due-date ${dueDateInfo.isOverdue ? 'overdue' : dueDateInfo.isToday ? 'today' : ''}`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                  <div className="due-date-info">{dueDateInfo.text}</div>
                </div>
              </div>

              <div className="meta-item">
                <label>Estimated Hours</label>
                <span>{task.estimatedHours}h</span>
              </div>

              {task.actualHours && (
                <div className="meta-item">
                  <label>Actual Hours</label>
                  <span>{task.actualHours}h</span>
                </div>
              )}

              <div className="meta-item">
                <label>Created</label>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="meta-item">
                <label>Updated</label>
                <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="task-meta-section">
                <h4>Tags</h4>
                <div className="tags-list">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};