import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import reportService from '../../services/reportService';
import type { Milestone } from '../../types/report.types';
import { MilestoneModal } from './MilestoneModal';
import './MilestoneManager.css';

interface MilestoneManagerProps {
  projectId: string;
}

export const MilestoneManager: React.FC<MilestoneManagerProps> = ({
  projectId,
}) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await reportService.getMilestones(projectId);
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = () => {
    setSelectedMilestone(null);
    setShowModal(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowModal(true);
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) {
      return;
    }

    try {
      await reportService.deleteMilestone(projectId, milestoneId);
      await fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleSaveMilestone = async (milestone: Partial<Milestone>) => {
    try {
      if (selectedMilestone) {
        await reportService.updateMilestone(
          projectId,
          selectedMilestone.id,
          milestone
        );
      } else {
        await reportService.createMilestone(projectId, milestone);
      }
      await fetchMilestones();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving milestone:', error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'DELAYED':
        return 'status-delayed';
      case 'PLANNED':
      default:
        return 'status-planned';
    }
  };

  if (loading) {
    return <div className="milestone-loading">Loading milestones...</div>;
  }

  return (
    <div className="milestone-manager">
      <div className="milestone-header">
        <h2>Project Milestones</h2>
        <button className="btn-primary" onClick={handleCreateMilestone}>
          Add Milestone
        </button>
      </div>

      {milestones.length === 0 ? (
        <div className="milestone-empty">
          <p>No milestones defined for this project yet.</p>
          <button className="btn-primary" onClick={handleCreateMilestone}>
            Create First Milestone
          </button>
        </div>
      ) : (
        <div className="milestone-grid">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="milestone-card">
              <div className="milestone-card-header">
                <h3>{milestone.name}</h3>
                <span
                  className={`milestone-status ${getStatusColor(milestone.status)}`}
                >
                  {milestone.status}
                </span>
              </div>

              {milestone.description && (
                <p className="milestone-description">{milestone.description}</p>
              )}

              <div className="milestone-details">
                <div className="milestone-date">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M11 2V4M5 2V4M2 7H14M3 3H13C13.5523 3 14 3.44772 14 4V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V4C2 3.44772 2.44772 3 3 3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    {format(new Date(milestone.targetDate), 'MMM dd, yyyy')}
                  </span>
                </div>

                {milestone.completionPercentage !== undefined && (
                  <div className="milestone-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${milestone.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {milestone.completionPercentage}% Complete
                    </span>
                  </div>
                )}

                {milestone.tasksCompleted !== undefined && (
                  <div className="milestone-tasks">
                    <span>
                      {milestone.tasksCompleted} of {milestone.totalTasks} tasks
                      completed
                    </span>
                  </div>
                )}
              </div>

              <div className="milestone-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEditMilestone(milestone)}
                  title="Edit milestone"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M11.3333 2L14 4.66667L4.66667 14H2V11.3333L11.3333 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => handleDeleteMilestone(milestone.id)}
                  title="Delete milestone"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MilestoneModal
          milestone={selectedMilestone}
          onSave={handleSaveMilestone}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
