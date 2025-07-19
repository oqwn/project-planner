import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskRequest } from '../types/task';
import type { TeamMember } from '../types/dashboard';
import { taskApi } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Using a default project ID for now
  const projectId = '1a2b3c4d-5e6f-7890-abcd-ef1234567890';

  // Load tasks and team members on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, teamData] = await Promise.all([
        taskApi.getTasks(projectId),
        taskApi.getTeamMembers(projectId),
      ]);
      setTasks(tasksData);
      setTeamMembers(teamData);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTask = useCallback(
    async (taskData: CreateTaskRequest) => {
      try {
        const newTask = await taskApi.createTask(projectId, taskData);
        setTasks((prev) => [...prev, newTask]);
      } catch (err) {
        console.error('Failed to create task:', err);
        setError('Failed to create task. Please try again.');
      }
    },
    [projectId]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      try {
        const updatedTask = await taskApi.updateTask(taskId, updates);
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
      } catch (err) {
        console.error('Failed to update task:', err);
        setError('Failed to update task. Please try again.');
      }
    },
    []
  );

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    }
  }, []);

  const addComment = useCallback(async (taskId: string, content: string) => {
    try {
      await taskApi.addComment(taskId, content);
      // Reload the task to get the updated comments
      const updatedTask = await taskApi.getTask(taskId);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  }, []);

  const addAttachment = useCallback(async (_taskId: string, _file: File) => {
    // TODO: Implement file upload API
    console.warn('File upload not implemented yet');
  }, []);

  return {
    tasks,
    teamMembers,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    addAttachment,
    refetch: loadData,
  };
};
