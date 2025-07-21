import React from 'react';
import type { TimeEntry } from '../../types/timeTracking';
import { timeTrackingApi } from '../../services/api';
import './TimeEntriesTable.css';

interface TimeEntriesTableProps {
  entries: TimeEntry[];
  loading: boolean;
  onDeleteEntry: (entryId: string) => void;
}

export const TimeEntriesTable: React.FC<TimeEntriesTableProps> = ({
  entries,
  loading,
  onDeleteEntry,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      try {
        await timeTrackingApi.deleteTimeEntry(entryId);
        onDeleteEntry(entryId);
      } catch (error) {
        console.error('Failed to delete time entry:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="time-entries-table">
        <h2>Time Entries</h2>
        <div className="loading-message">Loading time entries...</div>
      </div>
    );
  }

  return (
    <div className="time-entries-table">
      <h2>Time Entries</h2>
      
      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No time entries yet. Start logging your work hours above!</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Task</th>
                <th>Hours</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="date-cell">{formatDate(entry.date)}</td>
                  <td className="task-cell">{entry.taskName}</td>
                  <td className="hours-cell">{entry.hours}h</td>
                  <td className="description-cell">{entry.description || '-'}</td>
                  <td className="actions-cell">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry.id)}
                      aria-label="Delete time entry"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="total-label">Total Hours:</td>
                <td className="total-hours">
                  {entries.reduce((sum, entry) => sum + entry.hours, 0).toFixed(2)}h
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};