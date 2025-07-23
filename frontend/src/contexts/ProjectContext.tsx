import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
}

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

// Available projects
const AVAILABLE_PROJECTS: Project[] = [
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Project Alpha' },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Beta Release' },
];

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project>(
    AVAILABLE_PROJECTS[0]
  );

  return (
    <ProjectContext.Provider
      value={{
        projects: AVAILABLE_PROJECTS,
        selectedProject,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
