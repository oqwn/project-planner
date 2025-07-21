import React, { useState, useEffect } from 'react';
import { TimeEntryForm } from './TimeEntryForm';
import { TimeEntriesTable } from './TimeEntriesTable';
import { useProject } from "../../hooks/useProject";
import { taskApi, timeTrackingApi } from '../../services/api';
import type { Task } from '../../types/task';
import type { TimeEntry } from '../../types/timeTracking';
import './TimeTracking.css';

export const TimeTracking: React.FC = () => {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProject) {
      loadData();
    }
  }, [selectedProject]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (!selectedProject) return;

      // Load tasks for dropdown
      const tasksData = await taskApi.getTasks(selectedProject.id);
      setTasks(tasksData);

      // Load time entries
      const entriesData = await timeTrackingApi.getProjectTimeEntries(
        selectedProject.id
      );
      setTimeEntries(entriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = (entry: TimeEntry) => {
    setTimeEntries([entry, ...timeEntries]);
  };

  const handleDeleteEntry = (entryId: string) => {
    setTimeEntries(timeEntries.filter((entry) => entry.id !== entryId));
  };

  return (
    <div className="time-tracking">
      <div className="time-tracking-header">
        <h1>Time Tracking</h1>
        <p>Log your work hours and track time spent on tasks</p>
      </div>

      <div className="time-tracking-content">
        <div className="time-entry-section">
          <TimeEntryForm tasks={tasks} onEntryAdded={handleAddEntry} />
        </div>

        <div className="time-entries-section">
          <TimeEntriesTable
            entries={timeEntries}
            loading={loading}
            onDeleteEntry={handleDeleteEntry}
          />
        </div>
      </div>
    </div>
  );
};
