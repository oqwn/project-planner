import { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskRequest } from '../types/task';
import type { TeamMember } from '../types/dashboard';
import { taskApi } from '../services/api';
import { useProject } from "./useProject";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedProject } = useProject();

  // Project IDs from test data
  const projectIds = [
    '550e8400-e29b-41d4-a716-446655440001', // Project Alpha
    '550e8400-e29b-41d4-a716-446655440002', // Beta Release
  ];

  // Load tasks and team members on mount and when project changes
  useEffect(() => {
    loadData();
  }, [selectedProject]);

  const loadData = async () => {
    try {
      setLoading(true);

      // If a specific project is selected, fetch only that project's tasks
      // Otherwise, fetch from all projects
      const projectsToFetch = selectedProject
        ? [selectedProject.id]
        : projectIds;

      // Fetch tasks from selected project(s)
      const taskPromises = projectsToFetch.map((id) => taskApi.getTasks(id));
      const teamPromises = projectsToFetch.map((id) =>
        taskApi.getTeamMembers(id)
      );

      const [taskResults, teamResults] = await Promise.all([
        Promise.all(taskPromises),
        Promise.all(teamPromises),
      ]);

      // Combine tasks from all projects
      const allTasks = taskResults.flat();
      setTasks(allTasks);

      // Combine and deduplicate team members
      const allTeamMembers = teamResults.flat();
      const uniqueTeamMembers = Array.from(
        new Map(allTeamMembers.map((member) => [member.id, member])).values()
      );
      setTeamMembers(uniqueTeamMembers);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createTask = useCallback(
    async (taskData: CreateTaskRequest, projectId?: string) => {
      // Use first project as default if no projectId specified
      const targetProjectId = projectId || projectIds[0];

      // Create a temporary task with optimistic ID
      const tempId = `temp-${Date.now()}`;
      const tempTask: Task = {
        id: tempId,
        title: taskData.title,
        description: taskData.description,
        status: 'todo', // Default status
        priority: taskData.priority,
        assigneeId: taskData.assigneeId || '',
        assignee: taskData.assigneeId || '',
        assigneeName:
          teamMembers.find((m) => m.id === taskData.assigneeId)?.name || '',
        dueDate: taskData.dueDate,
        estimatedHours: taskData.estimatedHours || 0,
        actualHours: 0,
        tags: taskData.tags || [],
        subtasks:
          taskData.subtasks?.map((st, index) => ({
            id: `temp-st-${Date.now()}-${index}`,
            ...st,
          })) || [],
        comments: [],
        attachments: [],
        createdBy: '', // Will be set by backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistic update: Add to UI immediately
      setTasks((prev) => [...prev, tempTask]);

      try {
        // Make API call in background
        const newTask = await taskApi.createTask(targetProjectId, taskData);

        // Replace temporary task with real task from server
        setTasks((prev) =>
          prev.map((task) => (task.id === tempId ? newTask : task))
        );
      } catch (err) {
        console.error('Failed to create task:', err);

        // Remove temporary task on failure
        setTasks((prev) => prev.filter((task) => task.id !== tempId));
        setError('Failed to create task. Please try again.');

        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    },
    [teamMembers]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      // Store the previous state for potential rollback
      const previousTasks = tasks;

      // Optimistic update: Update UI immediately
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );

      try {
        // Make API call in background
        const updatedTask = await taskApi.updateTask(taskId, updates);

        // Update with server response (in case server made changes)
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
      } catch (err) {
        console.error('Failed to update task:', err);

        // Rollback to previous state on failure
        setTasks(previousTasks);
        setError('Failed to update task. Changes have been reverted.');

        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      // Store the previous state for potential rollback
      const previousTasks = tasks;

      // Optimistic update: Remove from UI immediately
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      try {
        // Make API call in background
        await taskApi.deleteTask(taskId);
      } catch (err) {
        console.error('Failed to delete task:', err);

        // Rollback to previous state on failure
        setTasks(previousTasks);
        setError('Failed to delete task. Task has been restored.');

        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    },
    [tasks]
  );

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

  const addAttachment = useCallback(async (taskId: string, file: File) => {
    // TODO: Implement file upload API
    console.warn('File upload not implemented yet', {
      taskId,
      fileName: file.name,
    });
  }, []);

  return {
    tasks,
    teamMembers,
    loading,
    error,
    setError,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    addAttachment,
    refetch: loadData,
  };
};
