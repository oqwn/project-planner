import React, { useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { TaskModal } from './TaskModal';
import { TaskDetailModal } from './TaskDetailModal';
import type { Task, CreateTaskRequest } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import './Tasks.css';

export const Tasks: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    tasks,
    teamMembers,
    loading,
    error,
    setError,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const handleCreateTask = (taskData: CreateTaskRequest) => {
    createTask(taskData);
    setIsCreateModalOpen(false);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleTaskSave = (taskData: CreateTaskRequest) => {
    if (selectedTask) {
      // Convert CreateTaskRequest to Partial<Task> for update
      const updates: Partial<Task> = {
        title: taskData.title,
        description: taskData.description,
        assigneeId: taskData.assigneeId,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        estimatedHours: taskData.estimatedHours,
        tags: taskData.tags,
        // Convert subtasks to include IDs
        subtasks:
          taskData.subtasks?.map((st, index) => ({
            id: selectedTask.subtasks[index]?.id || `st-${Date.now()}-${index}`,
            ...st,
          })) || [],
      };
      updateTask(selectedTask.id, updates);
    }
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskDelete = (taskId: string) => {
    deleteTask(taskId);
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  };

  if (loading) {
    return <div className="tasks-loading">Loading tasks...</div>;
  }

  return (
    <div className="tasks-page">
      {/* Show error as a non-blocking notification */}
      {error && (
        <div className="error-notification">
          {error}
          <button
            className="error-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <KanbanBoard
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskClick={handleTaskClick}
        onCreateTask={() => setIsCreateModalOpen(true)}
      />

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTask}
        teamMembers={teamMembers}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
        teamMembers={teamMembers}
      />
    </div>
  );
};
