import axios from 'axios';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import type {
  DashboardStats,
  RecentActivity,
  ProjectProgress,
  TeamMember,
} from '../types/dashboard';

// API Response Types
interface ApiTaskResponse {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: string;
  assigneeName?: string;
  createdByName?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  subtasks?: ApiSubtaskResponse[];
  comments?: ApiCommentResponse[];
  attachments?: ApiAttachmentResponse[];
}

interface ApiSubtaskResponse {
  id: string;
  title: string;
  completed: boolean;
}

interface ApiCommentResponse {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface ApiAttachmentResponse {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface ApiRecentTaskResponse {
  id: string;
  title: string;
  assignee: string;
  assigneeId?: string;
  dueDate?: string;
  priority: string;
  status: string;
}

interface ApiRecentActivityResponse {
  type: string;
  user: string;
  description: string;
  targetItem: string;
  timestamp: string;
}

interface ProjectProgressResponse {
  id: string;
  name: string;
  completionPercentage?: number;
  progress?: number;
  dueDate?: string;
  status?: string;
  tasksCompleted?: number;
  totalTasks?: number;
}

const API_BASE_URL = 'http://localhost:20005/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API functions
export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  create: (user: CreateUserRequest) => api.post<User>('/users', user),
  update: (id: string, user: UpdateUserRequest) =>
    api.put<User>(`/users/${id}`, user),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Task API endpoints
export const taskApi = {
  // Get all tasks for a project
  getTasks: async (projectId: string): Promise<Task[]> => {
    const { data } = await api.get(`/tasks/project/${projectId}`);
    return data.map(transformTaskFromApi);
  },

  // Get a single task by ID
  getTask: async (taskId: string): Promise<Task> => {
    const { data } = await api.get(`/tasks/${taskId}`);
    return transformTaskFromApi(data);
  },

  // Create a new task
  createTask: async (
    projectId: string,
    task: CreateTaskInput
  ): Promise<Task> => {
    const { data } = await api.post('/tasks', {
      ...task,
      projectId,
      assigneeId: task.assigneeId || '550e8400-e29b-41d4-a716-446655440014', // Default to John Doe (Project Manager)
      createdBy: '550e8400-e29b-41d4-a716-446655440014', // Current user ID (John Doe)
    });
    return transformTaskFromApi(data);
  },

  // Update an existing task
  updateTask: async (
    taskId: string,
    updates: UpdateTaskInput
  ): Promise<Task> => {
    const { data } = await api.put(`/tasks/${taskId}`, updates);
    return transformTaskFromApi(data);
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },

  // Get team members for assignment
  getTeamMembers: async (projectId: string): Promise<TeamMember[]> => {
    const { data } = await api.get(`/tasks/team-members/${projectId}`);
    return data;
  },

  // Add a comment to a task
  addComment: async (taskId: string, content: string): Promise<void> => {
    await api.post(`/tasks/${taskId}/comments`, {
      content,
      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Current user ID
    });
  },

  // Add a subtask
  addSubtask: async (taskId: string, title: string): Promise<void> => {
    await api.post(`/tasks/${taskId}/subtasks`, {
      title,
      completed: false,
    });
  },

  // Update subtask
  updateSubtask: async (
    taskId: string,
    subtaskId: string,
    completed: boolean
  ): Promise<void> => {
    await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
  },
};

// Time Tracking API endpoints
export const timeTrackingApi = {
  async createTimeEntry(data: {
    taskId: string;
    date: string;
    hours: number;
    description?: string;
  }) {
    const response = await api.post('/time-entries', data);
    return response.data;
  },

  async getProjectTimeEntries(projectId: string) {
    const response = await api.get(`/time-entries/project/${projectId}`);
    return response.data;
  },

  async getMyTimeEntries() {
    const response = await api.get('/time-entries/my-entries');
    return response.data;
  },

  async deleteTimeEntry(entryId: string) {
    await api.delete(`/time-entries/${entryId}`);
  },
};

// Dashboard API endpoints
export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (projectId: string): Promise<DashboardStats> => {
    const { data } = await api.get(`/dashboard/stats/${projectId}`);
    return {
      totalTasks: { value: data.totalTasks, trend: data.totalTasksTrend },
      inProgress: { value: data.inProgressTasks, trend: data.inProgressTrend },
      completed: { value: data.completedTasks, trend: data.completedTrend },
      overdue: { value: data.overdueTasks, trend: data.overdueTrend },
    };
  },

  // Get recent tasks for dashboard
  getRecentTasks: async (
    projectId: string,
    limit?: number
  ): Promise<Task[]> => {
    const url = limit
      ? `/dashboard/recent-tasks/${projectId}?limit=${limit}`
      : `/dashboard/recent-tasks/${projectId}`;
    const { data } = await api.get(url);
    return data.map((task: ApiRecentTaskResponse) => ({
      id: task.id,
      title: task.title,
      description: '',
      assignee: task.assignee,
      assigneeId: task.assigneeId || '',
      createdBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      subtasks: [],
      comments: [],
      attachments: [],
      tags: [],
    }));
  },

  // Get recent activities
  getRecentActivities: async (
    projectId: string,
    limit = 10
  ): Promise<RecentActivity[]> => {
    const { data } = await api.get(
      `/dashboard/recent-activities/${projectId}?limit=${limit}`
    );
    return data.map((activity: ApiRecentActivityResponse) => ({
      id: crypto.randomUUID(), // Generate ID on frontend
      type: activity.type,
      user: activity.user,
      action: activity.description,
      target: activity.targetItem,
      timestamp: activity.timestamp,
    }));
  },

  // Get project progress
  getProjectProgress: async (projectId: string): Promise<ProjectProgress[]> => {
    const { data } = await api.get(`/dashboard/project-progress/${projectId}`);
    return data.map((project: ProjectProgressResponse) => ({
      id: project.id,
      name: project.name,
      progress: project.completionPercentage || project.progress || 0,
      dueDate: project.dueDate || new Date().toISOString(),
      status: (project.status || 'on-track') as
        | 'on-track'
        | 'at-risk'
        | 'delayed',
      tasksCompleted: project.tasksCompleted || 0,
      totalTasks: project.totalTasks || 0,
    }));
  },
};

// Add request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Helper function to transform API task response to frontend Task type
function transformTaskFromApi(apiTask: ApiTaskResponse): Task {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description || '',
    status: apiTask.status as Task['status'],
    priority: apiTask.priority as Task['priority'],
    assignee: apiTask.assigneeName,
    assigneeId: apiTask.assigneeId || '',
    assigneeName: apiTask.assigneeName,
    createdBy: apiTask.createdByName || 'Unknown',
    dueDate: apiTask.dueDate || new Date().toISOString(),
    createdAt: apiTask.createdAt,
    updatedAt: apiTask.updatedAt,
    tags: apiTask.tags || [],
    subtasks:
      apiTask.subtasks?.map((st: ApiSubtaskResponse) => ({
        id: st.id,
        title: st.title,
        completed: st.completed,
      })) || [],
    comments:
      apiTask.comments?.map((c: ApiCommentResponse) => ({
        id: c.id,
        author: c.userName,
        user: c.userName,
        content: c.content,
        timestamp: c.createdAt,
        authorId: c.userId,
      })) || [],
    attachments:
      apiTask.attachments?.map((a: ApiAttachmentResponse) => ({
        id: a.id,
        filename: a.fileName,
        name: a.fileName,
        fileSize: a.fileSize,
        size: a.fileSize,
        fileType: a.fileType,
        type: a.fileType,
        url: a.fileUrl,
        uploadedBy: a.uploadedBy,
        uploadedAt: a.uploadedAt,
      })) || [],
    reminders: [],
  };
}
