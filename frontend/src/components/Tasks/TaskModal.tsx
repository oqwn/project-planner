import React, { useState, useEffect } from 'react';
import type { Task, CreateTaskRequest, TaskPriority } from '../../types/task';
import { CustomDropdown } from '../common/CustomDropdown';
import './TaskModal.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: CreateTaskRequest) => void;
  task?: Task; // For editing existing tasks
  teamMembers: Array<{ id: string; name: string; avatar?: string }>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  teamMembers,
}) => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    priority: 'medium',
    estimatedHours: 1,
    subtasks: [],
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
        dueDate: task.dueDate,
        priority: task.priority,
        estimatedHours: task.estimatedHours || 1,
        subtasks: task.subtasks.map((st) => ({
          title: st.title,
          completed: st.completed,
          dependsOn: st.dependsOn,
        })),
        tags: task.tags || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        dueDate: '',
        priority: 'medium',
        estimatedHours: 1,
        subtasks: [],
        tags: [],
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Please assign this task to a team member';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    if (formData.estimatedHours <= 0) {
      newErrors.estimatedHours = 'Estimated hours must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData((prev) => ({
        ...prev,
        subtasks: [
          ...(prev.subtasks || []),
          { title: newSubtask.trim(), completed: false },
        ],
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title..."
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the task..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignee">Assignee *</label>
              <CustomDropdown
                options={teamMembers.map(member => ({
                  value: member.id,
                  label: member.name,
                  icon: (
                    <div className="member-avatar">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} />
                      ) : (
                        member.name.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                  )
                }))}
                value={formData.assigneeId}
                onChange={(value) => setFormData((prev) => ({ ...prev, assigneeId: value }))}
                placeholder="Select assignee..."
                error={!!errors.assigneeId}
                searchable={true}
              />
              {errors.assigneeId && (
                <span className="error-message">{errors.assigneeId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <CustomDropdown
                options={[
                  { 
                    value: 'low', 
                    label: 'Low Priority',
                    icon: <div className="priority-indicator blue"></div>
                  },
                  { 
                    value: 'medium', 
                    label: 'Medium Priority',
                    icon: <div className="priority-indicator yellow"></div>
                  },
                  { 
                    value: 'high', 
                    label: 'High Priority',
                    icon: <div className="priority-indicator red"></div>
                  }
                ]}
                value={formData.priority}
                onChange={(value) => setFormData((prev) => ({ ...prev, priority: value as TaskPriority }))}
                placeholder="Select priority..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && (
                <span className="error-message">{errors.dueDate}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="estimatedHours">Estimated Hours *</label>
              <input
                id="estimatedHours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedHours: parseFloat(e.target.value) || 0,
                  }))
                }
                className={errors.estimatedHours ? 'error' : ''}
              />
              {errors.estimatedHours && (
                <span className="error-message">{errors.estimatedHours}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Subtasks</label>
            <div className="subtask-input">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addSubtask)}
                placeholder="Add a subtask..."
              />
              <button
                type="button"
                onClick={addSubtask}
                className="add-subtask-btn"
              >
                Add
              </button>
            </div>

            {formData.subtasks && formData.subtasks.length > 0 && (
              <div className="subtasks-list">
                {formData.subtasks.map((subtask, index) => (
                  <div key={index} className="subtask-item">
                    <span>{subtask.title}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="remove-subtask-btn"
                      aria-label="Remove subtask"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
