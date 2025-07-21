import React from 'react';
import { useProject } from "../../hooks/useProject";
import { CustomDropdown } from '../common/CustomDropdown';
import './ProjectSwitcher.css';

export const ProjectSwitcher: React.FC = () => {
  const { projects, selectedProject, setSelectedProject } = useProject();

  return (
    <div className="project-switcher">
      <label className="project-label">Current Project:</label>
      <div className="project-select-wrapper">
        <CustomDropdown
          options={projects.map((project) => ({
            value: project.id,
            label: project.name,
            icon: (
              <div className="project-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 5.5L8 2L14 5.5V10.5C14 10.8978 13.842 11.2794 13.5607 11.5607C13.2794 11.842 12.8978 12 12.5 12H3.5C3.10218 12 2.72064 11.842 2.43934 11.5607C2.15804 11.2794 2 10.8978 2 10.5V5.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 12V8H10V12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ),
          }))}
          value={selectedProject?.id || ''}
          onChange={(value) => {
            const project = projects.find((p) => p.id === value);
            if (project) {
              setSelectedProject(project);
            }
          }}
          placeholder="Select project..."
        />
      </div>
    </div>
  );
};
