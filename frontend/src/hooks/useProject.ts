import { useContext } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
