import React from 'react';
import { useProject } from '../../contexts/ProjectContext';
import './ProjectSwitcher.css';

export const ProjectSwitcher: React.FC = () => {
  const { projects, selectedProject, setSelectedProject } = useProject();

  return (
    <div className="project-switcher">
      <label htmlFor="project-select" className="project-label">
        Current Project:
      </label>
      <select
        id="project-select"
        className="project-select"
        value={selectedProject?.id}
        onChange={(e) => {
          const project = projects.find(p => p.id === e.target.value);
          if (project) {
            setSelectedProject(project);
          }
        }}
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};