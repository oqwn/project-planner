import React, { useState, useEffect } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import type { Task } from 'gantt-task-react';
import reportService from '../../services/reportService';
import 'gantt-task-react/dist/index.css';
import './GanttChart.css';

interface GanttChartProps {
  projectId: string;
}

export const GanttChart: React.FC<GanttChartProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGanttData();
  }, [projectId]);

  const fetchGanttData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getGanttData(projectId);
      console.log('Received Gantt data:', data);

      // Convert API data to Gantt Task format
      const ganttTasks: Task[] = data
        .filter((task) => {
          // More thorough validation
          return task && 
                 task.startDate && 
                 task.endDate && 
                 task.id && 
                 task.title;
        })
        .map((task) => {
          try {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            
            // Validate that dates are valid
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.warn('Invalid date found in task:', task);
              return null;
            }

            // Ensure end date is after start date
            if (endDate <= startDate) {
              console.warn('End date before/equal start date, adjusting:', task);
              endDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
            }

            return {
              start: startDate,
              end: endDate,
              name: task.title || 'Untitled Task',
              id: task.id,
              type: task.type === 'milestone' ? 'milestone' : 'task',
              progress: Math.max(0, Math.min(100, task.progress || 0)),
              dependencies: task.dependencies || [],
              styles: {
                backgroundColor: getTaskColor(task.status),
                backgroundSelectedColor: getTaskColor(task.status),
                progressColor: '#1e40af',
                progressSelectedColor: '#1e3a8a',
              },
              isDisabled: false,
              project: task.assigneeName || 'Unassigned',
            };
          } catch (error) {
            console.error('Error processing task:', task, error);
            return null;
          }
        })
        .filter((task): task is Task => task !== null); // Remove null tasks

      console.log('Converted Gantt tasks:', ganttTasks);
      setTasks(ganttTasks);
    } catch (error) {
      console.error('Error fetching Gantt data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return '#10b981';
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'DELAYED':
        return '#ef4444';
      case 'PLANNED':
      default:
        return '#6b7280';
    }
  };

  const handleTaskChange = (task: Task) => {
    console.log('Task changed:', task);
    // TODO: Implement task update API call
  };

  const handleTaskDelete = (task: Task) => {
    console.log('Task delete:', task);
    // TODO: Implement task delete if needed
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  if (loading) {
    return (
      <div className="gantt-loading">
        <div className="loading-spinner">Loading Gantt chart...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="gantt-empty">
        <p>No tasks or milestones found for this project.</p>
      </div>
    );
  }

  return (
    <div className="gantt-container">
      <div className="gantt-controls">
        <div className="view-mode-selector">
          <label>View Mode:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
          >
            <option value={ViewMode.Hour}>Hour</option>
            <option value={ViewMode.QuarterDay}>Quarter Day</option>
            <option value={ViewMode.HalfDay}>Half Day</option>
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
            <option value={ViewMode.QuarterYear}>Quarter Year</option>
            <option value={ViewMode.Year}>Year</option>
          </select>
        </div>

        <div className="gantt-legend">
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: '#10b981' }}
            ></span>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: '#3b82f6' }}
            ></span>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: '#6b7280' }}
            ></span>
            <span>Planned</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: '#ef4444' }}
            ></span>
            <span>Delayed</span>
          </div>
        </div>
      </div>

      <div className="gantt-wrapper">
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          onDateChange={handleTaskChange}
          onDelete={handleTaskDelete}
          onExpanderClick={handleExpanderClick}
          listCellWidth="155px"
          columnWidth={viewMode === ViewMode.Month ? 300 : 65}
          barCornerRadius={3}
          barFill={60}
        />
      </div>
    </div>
  );
};
