import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import reportService from '../../services/reportService';
import type { WorkloadComparison as WorkloadData } from '../../types/report.types';
import './WorkloadComparison.css';

interface WorkloadComparisonProps {
  projectId: string;
}

export const WorkloadComparison: React.FC<WorkloadComparisonProps> = ({
  projectId,
}) => {
  const [workloadData, setWorkloadData] = useState<WorkloadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    fetchWorkloadData();
  }, [projectId]);

  const fetchWorkloadData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getWorkloadComparison(projectId);
      setWorkloadData(data);
    } catch (error) {
      console.error('Error fetching workload data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVarianceColor = (variance: number): string => {
    if (variance > 20) return 'variance-high';
    if (variance > 10) return 'variance-medium';
    if (variance < -10) return 'variance-negative';
    return 'variance-low';
  };

  const chartData = workloadData.map((user) => ({
    userName: user.userName,
    'Estimated Hours': user.totalEstimatedHours || 0,
    'Actual Hours': user.totalActualHours || 0,
  }));

  if (loading) {
    return <div className="workload-loading">Loading workload data...</div>;
  }

  if (workloadData.length === 0) {
    return (
      <div className="workload-empty">
        No workload data available for this project.
      </div>
    );
  }

  return (
    <div className="workload-comparison">
      <div className="workload-header">
        <h2>Workload Analysis</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'chart' ? 'active' : ''}`}
            onClick={() => setViewMode('chart')}
          >
            Chart View
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="workload-table-container">
          <table className="workload-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Total Estimated</th>
                <th>Total Actual</th>
                <th>Variance</th>
                <th>Tasks</th>
              </tr>
            </thead>
            <tbody>
              {workloadData.map((user) => (
                <React.Fragment key={user.userId}>
                  <tr className="user-row">
                    <td className="user-name">{user.userName}</td>
                    <td>{user.totalEstimatedHours || 0}h</td>
                    <td>{user.totalActualHours || 0}h</td>
                    <td className={getVarianceColor(user.variancePercentage)}>
                      {user.variancePercentage > 0 ? '+' : ''}
                      {user.variancePercentage.toFixed(1)}%
                    </td>
                    <td>{user.tasks.length} tasks</td>
                  </tr>
                  {user.tasks.map((task) => (
                    <tr key={task.taskId} className="task-row">
                      <td className="task-title">{task.taskTitle}</td>
                      <td>{task.estimatedHours || 0}h</td>
                      <td>{task.actualHours || 0}h</td>
                      <td
                        className={getVarianceColor(
                          task.estimatedHours
                            ? ((task.actualHours - task.estimatedHours) /
                                task.estimatedHours) *
                                100
                            : 0
                        )}
                      >
                        {task.variance > 0 ? '+' : ''}
                        {task.variance}h
                      </td>
                      <td>
                        <span
                          className={`task-status status-${task.status.toLowerCase()}`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="workload-chart">
          <ResponsiveBar
            data={chartData}
            keys={['Estimated Hours', 'Actual Hours']}
            indexBy="userName"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'paired' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Team Members',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Hours',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      )}

      <div className="workload-summary">
        <div className="summary-card">
          <h3>Project Summary</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="stat-label">Total Estimated:</span>
              <span className="stat-value">
                {workloadData.reduce(
                  (sum, user) => sum + (user.totalEstimatedHours || 0),
                  0
                )}
                h
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Actual:</span>
              <span className="stat-value">
                {workloadData.reduce(
                  (sum, user) => sum + (user.totalActualHours || 0),
                  0
                )}
                h
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Overall Variance:</span>
              <span
                className={`stat-value ${getVarianceColor(
                  ((workloadData.reduce(
                    (sum, user) => sum + (user.totalActualHours || 0),
                    0
                  ) -
                    workloadData.reduce(
                      (sum, user) => sum + (user.totalEstimatedHours || 0),
                      0
                    )) /
                    workloadData.reduce(
                      (sum, user) => sum + (user.totalEstimatedHours || 0),
                      0
                    )) *
                    100
                )}`}
              >
                {(
                  ((workloadData.reduce(
                    (sum, user) => sum + (user.totalActualHours || 0),
                    0
                  ) -
                    workloadData.reduce(
                      (sum, user) => sum + (user.totalEstimatedHours || 0),
                      0
                    )) /
                    workloadData.reduce(
                      (sum, user) => sum + (user.totalEstimatedHours || 0),
                      0
                    )) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
