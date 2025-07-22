import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { Milestone } from '../../types/report.types';
import './MilestoneModal.css';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onSave: (milestone: Partial<Milestone>) => void;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  milestone,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'PLANNED' as Milestone['status'],
  });

  useEffect(() => {
    if (milestone) {
      // Convert ISO date string to yyyy-MM-dd format for date input
      const targetDate = milestone.targetDate
        ? format(new Date(milestone.targetDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');

      setFormData({
        name: milestone.name,
        description: milestone.description || '',
        targetDate,
        status: milestone.status,
      });
    }
  }, [milestone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert date string to ISO format for backend
    const targetDate = new Date(
      formData.targetDate + 'T12:00:00.000Z'
    ).toISOString();

    onSave({
      ...formData,
      targetDate,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{milestone ? 'Edit Milestone' : 'Create Milestone'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Milestone Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter milestone name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetDate">Target Date</label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DELAYED">Delayed</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {milestone ? 'Update' : 'Create'} Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
