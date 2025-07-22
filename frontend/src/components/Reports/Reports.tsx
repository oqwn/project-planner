import React, { useState, useContext } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { GanttChart } from './GanttChart';
import { MilestoneManager } from './MilestoneManager';
import { WorkloadComparison } from './WorkloadComparison';
import { TeamAvailability } from './TeamAvailability';
import './Reports.css';

export const Reports: React.FC = () => {
  const projectContext = useContext(ProjectContext);
  const [activeTab, setActiveTab] = useState<
    'gantt' | 'milestones' | 'workload' | 'availability'
  >('gantt');

  if (!projectContext?.selectedProject) {
    return (
      <div className="reports-container">
        <div className="no-project-selected">
          <h2>No Project Selected</h2>
          <p>Please select a project to view reports</p>
        </div>
      </div>
    );
  }

  const { selectedProject } = projectContext;

  const tabs = [
    { 
      id: 'gantt', 
      label: 'Gantt Chart', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <path d="M8 14h2v4H8v-4z"/>
          <path d="M14 12h4v6h-4v-6z"/>
        </svg>
      )
    },
    { 
      id: 'milestones', 
      label: 'Milestones', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="14,6 10,14 21,14"/>
          <line x1="3" y1="14" x2="10" y2="14"/>
        </svg>
      )
    },
    { 
      id: 'workload', 
      label: 'Workload Analysis', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10"/>
          <line x1="18" y1="20" x2="18" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="16"/>
        </svg>
      )
    },
    { 
      id: 'availability', 
      label: 'Team Availability', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    },
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Project Reports</h1>
        <p className="project-name">{selectedProject.name}</p>
      </div>

      <div className="reports-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() =>
              setActiveTab(
                tab.id as 'gantt' | 'milestones' | 'workload' | 'availability'
              )
            }
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="reports-content">
        {activeTab === 'gantt' && <GanttChart projectId={selectedProject.id} />}
        {activeTab === 'milestones' && (
          <MilestoneManager projectId={selectedProject.id} />
        )}
        {activeTab === 'workload' && (
          <WorkloadComparison projectId={selectedProject.id} />
        )}
        {activeTab === 'availability' && (
          <TeamAvailability projectId={selectedProject.id} />
        )}
      </div>
    </div>
  );
};
