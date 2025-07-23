import React, { useState, useEffect } from 'react';
import { MeetingRoom } from './MeetingRoom';
import meetingService from '../../services/meetingService';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useAuthStore } from '../../store/authStore';
import './Meetings.css';

interface Meeting {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  startTime: Date;
  duration: number;
  code: string;
  status: 'scheduled' | 'active' | 'ended';
  projectId?: string;
}

export const Meetings: React.FC = () => {
  const { selectedProject } = useProjectContext();
  const currentUser = useAuthStore((state) => state.user);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeMeeting, setActiveMeeting] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProject) {
      loadMeetings();
    }
  }, [selectedProject]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      if (selectedProject) {
        const projectMeetings = await meetingService.getMeetingsByProject(
          selectedProject.id
        );
        setMeetings(projectMeetings);
      }
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (title: string) => {
    try {
      const newMeeting = await meetingService.createMeeting({
        title,
        projectId: selectedProject?.id,
      });
      setMeetings([...meetings, newMeeting]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting');
    }
  };

  const joinMeeting = (meetingId: string) => {
    setActiveMeeting(meetingId);
  };

  const leaveMeeting = () => {
    setActiveMeeting(null);
  };

  const deleteMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) {
      return;
    }

    try {
      await meetingService.deleteMeeting(meetingId);
      setMeetings(meetings.filter((m) => m.id !== meetingId));
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting');
    }
  };

  if (activeMeeting) {
    const meeting = meetings.find((m) => m.id === activeMeeting);
    if (meeting) {
      return <MeetingRoom meeting={meeting} onLeave={leaveMeeting} />;
    }
  }

  return (
    <div className="meetings-container">
      <div className="meetings-header">
        <h1>Meetings</h1>
        <div className="meetings-actions">
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 5V15M5 10H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            New Meeting
          </button>
        </div>
      </div>

      <div className="meetings-content">
        <div className="join-meeting-section">
          <h2>Join a Meeting</h2>
          <div className="join-meeting-form">
            <input
              type="text"
              placeholder="Enter meeting code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button
              className="btn-secondary"
              onClick={async () => {
                try {
                  const meeting =
                    await meetingService.getMeetingByCode(joinCode);
                  if (meeting && meeting.id) {
                    joinMeeting(meeting.id);
                  }
                } catch {
                  alert('Invalid meeting code');
                }
              }}
              disabled={joinCode.length !== 6}
            >
              Join
            </button>
          </div>
        </div>

        <div className="meetings-list">
          <h2>Your Meetings</h2>
          {loading ? (
            <div className="empty-state">
              <p>Loading meetings...</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                className="empty-icon"
              >
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M8 18L7 20M17 18L16 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p>No meetings scheduled</p>
            </div>
          ) : (
            <div className="meetings-grid">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="meeting-card">
                  <div className="meeting-card-header">
                    <h3>{meeting.title}</h3>
                    <span className={`status-badge ${meeting.status}`}>
                      {meeting.status}
                    </span>
                  </div>
                  <div className="meeting-details">
                    <p>Host: {meeting.hostName}</p>
                    <p>
                      Code: <strong>{meeting.code}</strong>
                    </p>
                    <p>Duration: {meeting.duration} min</p>
                  </div>
                  <div className="meeting-actions">
                    <button
                      className="btn-primary"
                      onClick={() => joinMeeting(meeting.id)}
                    >
                      Join Meeting
                    </button>
                    {currentUser?.name === meeting.hostName ? (
                      <button
                        className="btn-delete"
                        onClick={() => deleteMeeting(meeting.id)}
                        title="Delete meeting"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M7 3V2C7 1.448 7.448 1 8 1H12C12.552 1 13 1.448 13 2V3M3 5H17M16 5L15.133 17.142C15.068 18.172 14.208 19 13.176 19H6.824C5.792 19 4.932 18.172 4.867 17.142L4 5H16Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Meeting</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                createMeeting(title);
              }}
            >
              <div className="form-group">
                <label>Meeting Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter meeting title"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
