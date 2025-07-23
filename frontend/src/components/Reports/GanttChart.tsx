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
      const ganttTasks = data
        .filter((task) => {
          // More thorough validation
          return (
            task && task.startDate && task.endDate && task.id && task.title
          );
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
              console.warn(
                'End date before/equal start date, adjusting:',
                task
              );
              endDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day
            }

            return {
              start: startDate,
              end: endDate,
              name: task.title || 'Untitled Task',
              id: task.id,
              type: task.type === 'milestone' ? 'milestone' : 'task',
              progress: Math.max(0, Math.min(100, task.progress || 0)),
              dependencies: task.dependencies || ([] as string[]),
              styles: {
                backgroundColor: getTaskColor(task.status),
                backgroundSelectedColor: getTaskColorHover(task.status),
                progressColor: getProgressColor(task.status),
                progressSelectedColor: getProgressColorHover(task.status),
                borderRadius: '6px',
              },
              isDisabled: false,
              project: task.assigneeName || 'Unassigned',
            };
          } catch (error) {
            console.error('Error processing task:', task, error);
            return null;
          }
        })
        .filter(
          (task): task is NonNullable<typeof task> => task !== null
        ) as Task[]; // Remove null tasks

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
        return '#10b981'; // Green
      case 'IN_PROGRESS':
        return '#3b82f6'; // Blue
      case 'TODO':
        return '#8b5cf6'; // Purple
      case 'PARKED':
        return '#f59e0b'; // Amber
      default:
        return '#6b7280'; // Gray
    }
  };

  const getTaskColorHover = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return '#059669'; // Darker green
      case 'IN_PROGRESS':
        return '#2563eb'; // Darker blue
      case 'TODO':
        return '#7c3aed'; // Darker purple
      case 'PARKED':
        return '#d97706'; // Darker amber
      default:
        return '#4b5563'; // Darker gray
    }
  };

  const getProgressColor = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return 'rgba(255, 255, 255, 0.4)';
      case 'IN_PROGRESS':
        return 'rgba(255, 255, 255, 0.3)';
      case 'DELAYED':
        return 'rgba(255, 255, 255, 0.3)';
      case 'PLANNED':
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  };

  const getProgressColorHover = (status: string): string => {
    switch (status) {
      case 'COMPLETED':
        return 'rgba(255, 255, 255, 0.5)';
      case 'IN_PROGRESS':
        return 'rgba(255, 255, 255, 0.4)';
      case 'DELAYED':
        return 'rgba(255, 255, 255, 0.4)';
      case 'PLANNED':
      default:
        return 'rgba(255, 255, 255, 0.3)';
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
            <option value={ViewMode.Year}>Quarter Year</option>
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
              style={{ backgroundColor: '#8b5cf6' }}
            ></span>
            <span>To Do</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: '#f59e0b' }}
            ></span>
            <span>Parked</span>
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
          listCellWidth="180px"
          columnWidth={viewMode === ViewMode.Month ? 350 : 85}
          barCornerRadius={6}
          barFill={65}
          barProgressColor="rgba(255, 255, 255, 0.3)"
          barProgressSelectedColor="rgba(255, 255, 255, 0.4)"
          arrowColor="#6366f1"
          arrowIndent={20}
          todayColor="rgba(239, 68, 68, 0.3)"
          TooltipContent={({ task, fontSize, fontFamily }) => (
            <div
              style={{
                fontSize,
                fontFamily,
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                boxShadow:
                  '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minWidth: '200px',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: '#f9fafb',
                }}
              >
                {task.name}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#d1d5db',
                  marginBottom: '4px',
                }}
              >
                <strong>Start:</strong> {task.start.toLocaleDateString()}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#d1d5db',
                  marginBottom: '4px',
                }}
              >
                <strong>End:</strong> {task.end.toLocaleDateString()}
              </div>
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#d1d5db',
                  marginBottom: '4px',
                }}
              >
                <strong>Progress:</strong> {task.progress}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                <strong>Assignee:</strong> {task.project}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
