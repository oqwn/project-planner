import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
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
  const user = useAuthStore((state) => state.user);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState<
    TeamAvailabilityData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    fetchAvailabilityData();
  }, [projectId, currentMonth]);

  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getTeamAvailability(
        projectId,
        format(monthStart, 'yyyy-MM-dd'),
        format(monthEnd, 'yyyy-MM-dd')
      );
      setAvailabilityData(data);
    } catch (error) {
      console.error('Error fetching availability data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleSaveAvailability = async (
    status: TeamAvailabilityData['status'],
    notes?: string
  ) => {
    if (!selectedDate || !user) return;

    try {
      const availability = {
        userId: user.email, // This will be converted to UUID on backend
        date: format(selectedDate, 'yyyy-MM-dd'),
        status,
        notes,
      };

      await reportService.updateAvailability(projectId, availability);
      await fetchAvailabilityData();
      setShowModal(false);
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get unique team members
  const teamMembers = Array.from(
    new Set(
      availabilityData.map((a) =>
        JSON.stringify({ id: a.userId, name: a.userName, email: a.userEmail })
      )
    )
  ).map((member) => JSON.parse(member));

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
          <button className="nav-btn" onClick={handlePreviousMonth}>
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
          <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
          <button className="nav-btn" onClick={handleNextMonth}>
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
        <div className="calendar-grid">
          <div className="calendar-row header-row">
            <div className="calendar-cell member-header">Team Member</div>
            {weekDays.map((day) => (
              <div key={day} className="calendar-cell day-header">
                {day}
              </div>
            ))}
          </div>

          {teamMembers.map((member) => (
            <div key={member.id} className="calendar-row">
              <div className="calendar-cell member-name">
                <div className="member-info">
                  <span className="name">{member.name}</span>
                  <span className="email">{member.email}</span>
                </div>
              </div>
              {Array(getDay(monthStart))
                .fill(null)
                .map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="calendar-cell empty"
                  ></div>
                ))}
              {monthDays.map((date) => {
                const availability = getAvailabilityForDate(date, member.id);
                const isCurrentUser = member.email === user?.email;
                return (
                  <div
                    key={format(date, 'yyyy-MM-dd')}
                    className={`calendar-cell date-cell ${availability ? getStatusColor(availability.status) : ''} ${isCurrentUser ? 'clickable' : ''}`}
                    onClick={() => isCurrentUser && handleDateClick(date)}
                    title={availability?.notes || ''}
                  >
                    <span className="date-number">{format(date, 'd')}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedDate && (
        <div className="availability-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              Update Availability for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="status-options">
              <button
                className="status-btn status-available"
                onClick={() => handleSaveAvailability('AVAILABLE')}
              >
                Available
              </button>
              <button
                className="status-btn status-busy"
                onClick={() => handleSaveAvailability('BUSY')}
              >
                Busy
              </button>
              <button
                className="status-btn status-out"
                onClick={() => handleSaveAvailability('OUT_OF_OFFICE')}
              >
                Out of Office
              </button>
              <button
                className="status-btn status-holiday"
                onClick={() => handleSaveAvailability('HOLIDAY')}
              >
                Holiday
              </button>
              <button
                className="status-btn status-sick"
                onClick={() => handleSaveAvailability('SICK_LEAVE')}
              >
                Sick Leave
              </button>
            </div>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
