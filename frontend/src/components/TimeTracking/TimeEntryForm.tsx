import React, { useState } from 'react';
import type { Task } from '../../types/task';
import type { CreateTimeEntryRequest, TimeEntry } from '../../types/timeTracking';
import { timeTrackingApi } from '../../services/api';
import './TimeEntryForm.css';

interface TimeEntryFormProps {
  tasks: Task[];
  onEntryAdded: (entry: TimeEntry) => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ tasks, onEntryAdded }) => {
  const [formData, setFormData] = useState<CreateTimeEntryRequest>({
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.taskId) {
      newErrors.taskId = 'Please select a task';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.hours <= 0 || formData.hours > 24) {
      newErrors.hours = 'Hours must be between 0 and 24';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      // Call API to create time entry
      const response = await timeTrackingApi.createTimeEntry(formData);
      
      // Transform response to match TimeEntry type
      const newEntry: TimeEntry = {
        ...response,
        taskName: response.taskName || tasks.find(t => t.id === formData.taskId)?.title || '',
        updatedAt: response.updatedAt || response.createdAt,
      };

      onEntryAdded(newEntry);

      // Reset form
      setFormData({
        taskId: '',
        date: new Date().toISOString().split('T')[0],
        hours: 0,
        description: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to add time entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="time-entry-form">
      <h2>Log Time Entry</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task">Task *</label>
          <select
            id="task"
            value={formData.taskId}
            onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
            className={errors.taskId ? 'error' : ''}
          >
            <option value="">Select a task...</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
          {errors.taskId && <span className="error-message">{errors.taskId}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={errors.date ? 'error' : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="hours">Hours Worked *</label>
            <input
              id="hours"
              type="number"
              step="0.25"
              min="0"
              max="24"
              value={formData.hours || ''}
              onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 0 })}
              className={errors.hours ? 'error' : ''}
              placeholder="0"
            />
            {errors.hours && <span className="error-message">{errors.hours}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What did you work on?"
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Adding...' : 'Add Time Entry'}
        </button>
      </form>
    </div>
  );
};