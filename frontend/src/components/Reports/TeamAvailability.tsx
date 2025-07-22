import React, { useState, useEffect } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
} from 'date-fns';
import reportService from '../../services/reportService';
import type { TeamAvailability as TeamAvailabilityData } from '../../types/report.types';
import { useAuthStore } from '../../store/authStore';
import './TeamAvailability.css';

interface TeamAvailabilityProps {
  projectId: string;
}

export const TeamAvailability: React.FC<TeamAvailabilityProps> = ({
  projectId,
}) => {
  const currentUser = useAuthStore((state) => state.user);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<
    TeamAvailabilityData[]
  >([]);
  const [teamMembers, setTeamMembers] = useState<
    {id: string, name: string, email: string}[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    fetchAvailabilityData();
    fetchTeamMembers();
  }, [projectId, currentWeek]);

  useEffect(() => {
    if (!editingCell) return;

    const handleClickOutsideEvent = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target?.closest('.inline-status-selector') &&
        !target?.closest('.availability-cell.clickable')
      ) {
        setEditingCell(null);
      }
    };

    // Add a small delay to prevent immediate cancellation of newly set editing state
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutsideEvent);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutsideEvent);
    };
  }, [editingCell]);

  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getTeamAvailability(
        projectId,
        format(weekStart, 'yyyy-MM-dd'),
        format(weekEnd, 'yyyy-MM-dd')
      );
      setAvailabilityData(data);
    } catch (error) {
      console.error('Error fetching availability data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const members = await reportService.getProjectMembers(projectId);
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleDateClick = (date: Date, memberEmail: string) => {
    console.log('Cell clicked:', format(date, 'yyyy-MM-dd'), memberEmail);
    console.log(
      'Setting editing cell to:',
      `${format(date, 'yyyy-MM-dd')}-${memberEmail}`
    );
    const cellKey = `${format(date, 'yyyy-MM-dd')}-${memberEmail}`;
    setEditingCell(cellKey);
  };

  const handleCellStatusChange = async (
    date: Date,
    memberEmail: string,
    status: TeamAvailabilityData['status']
  ) => {
    try {
      // Find the member's UUID by email
      const member = teamMembers.find(m => m.email === memberEmail);
      if (!member) {
        console.error('Member not found:', memberEmail);
        return;
      }

      const availability = {
        userId: member.id, // Use the actual UUID
        date: format(date, 'yyyy-MM-dd'),
        status,
        notes: '',
      };

      await reportService.updateAvailability(projectId, availability);
      await fetchAvailabilityData();
      setEditingCell(null);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const getAvailabilityForDate = (date: Date, userId: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availabilityData.find(
      (a) => a.date === dateStr && a.userId === userId
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'AVAILABLE':
        return 'status-available';
      case 'BUSY':
        return 'status-busy';
      case 'OUT_OF_OFFICE':
        return 'status-out';
      case 'HOLIDAY':
        return 'status-holiday';
      case 'SICK_LEAVE':
        return 'status-sick';
      default:
        return '';
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  console.log('TeamAvailability Debug:', {
    availabilityDataLength: availabilityData.length,
    teamMembersLength: teamMembers.length,
    loading,
    projectId,
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd')
  });

  if (loading) {
    return (
      <div className="availability-loading">Loading team availability...</div>
    );
  }

  return (
    <div className="team-availability">
      <div className="availability-header">
        <h2>Team Availability Calendar</h2>
        <div className="calendar-navigation">
          <button className="nav-btn" onClick={handlePreviousWeek}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h3>
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          <button className="nav-btn" onClick={handleNextWeek}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="availability-info">
        <div className="availability-hint">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="info-icon">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>You can only edit your own availability. Other team members' schedules are view-only.</span>
        </div>
      </div>

      <div className="availability-legend">
        <div className="legend-item">
          <span className="legend-dot status-available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot status-busy"></span>
          <span>Busy</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot status-out"></span>
          <span>Out of Office</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot status-holiday"></span>
          <span>Holiday</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot status-sick"></span>
          <span>Sick Leave</span>
        </div>
      </div>

      <div className="calendar-container">
        {/* Calendar Header with Days of Week */}
        <div className="calendar-header">
          <div className="member-column-header">Team Members</div>
          <div className="calendar-days-header">
            {dayLabels.map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Date Numbers Row */}
          <div className="dates-row">
            <div className="member-column-spacer"></div>
            <div className="calendar-dates">
              {weekDays.map((date, index) => (
                <div key={`date-${index}`} className="date-number-cell">
                  {format(date, 'd')}
                </div>
              ))}
            </div>
          </div>

          {/* Team Member Rows */}
          {teamMembers.map((member) => {
            const isCurrentUser = currentUser?.email === member.email;
            return (
              <div key={member.id} className={`member-row ${isCurrentUser ? 'current-user' : ''}`}>
                <div className="member-info-cell">
                  <div className="member-info">
                    <span className="name">
                      {member.name}
                      {isCurrentUser && <span className="current-user-badge">(You)</span>}
                    </span>
                    <span className="email">{member.email}</span>
                  </div>
                </div>

              <div className="member-availability-cells">
                {weekDays.map((date, index) => {
                  const availability = getAvailabilityForDate(date, member.id);
                  const cellKey = `${format(date, 'yyyy-MM-dd')}-${member.email}`;
                  const isEditing = editingCell === cellKey;
                  const isToday =
                    format(date, 'yyyy-MM-dd') ===
                    format(new Date(), 'yyyy-MM-dd');
                  const isCurrentUser = currentUser?.email === member.email;

                  return (
                    <div
                      key={`${format(date, 'yyyy-MM-dd')}-${member.id}`}
                      className={`availability-cell ${
                        isCurrentUser ? 'clickable' : 'readonly'
                      } ${isEditing ? 'editing' : ''} ${isToday ? 'today' : ''}`}
                      onClick={(e) => {
                        if (isCurrentUser) {
                          e.stopPropagation();
                          handleDateClick(date, member.email);
                        }
                      }}
                      title={
                        isCurrentUser
                          ? `${member.name} - ${format(date, 'MMM d, yyyy')}: ${availability?.status || 'Click to set availability'}`
                          : `${member.name} - ${format(date, 'MMM d, yyyy')}: ${availability?.status || 'Not set'} (View only)`
                      }
                    >
                      {isEditing ? (
                        <div
                          className="inline-status-selector"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="status-options-inline">
                            <button
                              className="status-btn-inline status-available"
                              onClick={() =>
                                handleCellStatusChange(
                                  date,
                                  member.email,
                                  'AVAILABLE'
                                )
                              }
                              title="Available"
                            >
                              <div className="status-dot-inline status-available"></div>
                            </button>
                            <button
                              className="status-btn-inline status-busy"
                              onClick={() =>
                                handleCellStatusChange(
                                  date,
                                  member.email,
                                  'BUSY'
                                )
                              }
                              title="Busy"
                            >
                              <div className="status-dot-inline status-busy"></div>
                            </button>
                            <button
                              className="status-btn-inline status-out"
                              onClick={() =>
                                handleCellStatusChange(
                                  date,
                                  member.email,
                                  'OUT_OF_OFFICE'
                                )
                              }
                              title="Out of Office"
                            >
                              <div className="status-dot-inline status-out"></div>
                            </button>
                            <button
                              className="status-btn-inline status-holiday"
                              onClick={() =>
                                handleCellStatusChange(
                                  date,
                                  member.email,
                                  'HOLIDAY'
                                )
                              }
                              title="Holiday"
                            >
                              <div className="status-dot-inline status-holiday"></div>
                            </button>
                            <button
                              className="status-btn-inline status-sick"
                              onClick={() =>
                                handleCellStatusChange(
                                  date,
                                  member.email,
                                  'SICK_LEAVE'
                                )
                              }
                              title="Sick Leave"
                            >
                              <div className="status-dot-inline status-sick"></div>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="availability-indicator">
                          {availability ? (
                            <div
                              className={`availability-dot ${getStatusColor(availability.status)}`}
                            ></div>
                          ) : (
                            <div className="availability-dot status-unset"></div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
};
