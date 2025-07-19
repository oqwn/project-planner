import { useState } from 'react';
import type { Task, CreateTaskRequest } from '../types/task';

// Mock data for development
const mockTeamMembers = [
  { id: '1', name: 'Sarah Chen', avatar: undefined },
  { id: '2', name: 'Mike Johnson', avatar: undefined },
  { id: '3', name: 'Emily Davis', avatar: undefined },
  { id: '4', name: 'John Doe', avatar: undefined },
  { id: '5', name: 'Lisa Wang', avatar: undefined },
  { id: '6', name: 'Tom Wilson', avatar: undefined },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design system implementation',
    description: 'Create a comprehensive design system with reusable components, color palette, and typography guidelines.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '1',
    assigneeName: 'Sarah Chen',
    createdBy: 'John Doe',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-19T14:30:00Z',
    dueDate: '2025-01-25',
    estimatedHours: 16,
    actualHours: 8,
    subtasks: [
      { id: 'st1', title: 'Create color palette', completed: true },
      { id: 'st2', title: 'Design typography system', completed: true },
      { id: 'st3', title: 'Build component library', completed: false },
      { id: 'st4', title: 'Document usage guidelines', completed: false }
    ],
    comments: [
      {
        id: 'c1',
        content: 'Great progress on the color palette! The accessibility ratios look good.',
        author: 'Mike Johnson',
        authorId: '2',
        timestamp: '2025-01-18T16:20:00Z'
      }
    ],
    attachments: [
      {
        id: 'a1',
        filename: 'design-system-mockups.fig',
        fileType: 'figma',
        fileSize: 2048000,
        uploadedBy: 'Sarah Chen',
        uploadedAt: '2025-01-17T09:15:00Z',
        url: '#'
      }
    ],
    reminders: [],
    tags: ['design', 'frontend', 'ui']
  },
  {
    id: '2',
    title: 'API integration testing',
    description: 'Comprehensive testing of all API endpoints with error handling and edge cases.',
    status: 'todo',
    priority: 'medium',
    assigneeId: '2',
    assigneeName: 'Mike Johnson',
    createdBy: 'Emily Davis',
    createdAt: '2025-01-16T11:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z',
    dueDate: '2025-01-23',
    estimatedHours: 12,
    subtasks: [
      { id: 'st5', title: 'Test user authentication endpoints', completed: false },
      { id: 'st6', title: 'Test task management APIs', completed: false },
      { id: 'st7', title: 'Test error handling', completed: false }
    ],
    comments: [],
    attachments: [],
    reminders: [],
    tags: ['backend', 'testing', 'api']
  },
  {
    id: '3',
    title: 'User authentication flow',
    description: 'Implement secure user login, registration, and password reset functionality.',
    status: 'completed',
    priority: 'high',
    assigneeId: '3',
    assigneeName: 'Emily Davis',
    createdBy: 'John Doe',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-18T17:45:00Z',
    dueDate: '2025-01-20',
    estimatedHours: 20,
    actualHours: 18,
    subtasks: [
      { id: 'st8', title: 'Design login page', completed: true },
      { id: 'st9', title: 'Implement JWT authentication', completed: true },
      { id: 'st10', title: 'Add password reset', completed: true },
      { id: 'st11', title: 'Add form validation', completed: true }
    ],
    comments: [
      {
        id: 'c2',
        content: 'Authentication is working perfectly! Great job on the security implementation.',
        author: 'John Doe',
        authorId: '4',
        timestamp: '2025-01-18T18:00:00Z'
      }
    ],
    attachments: [],
    reminders: [],
    tags: ['security', 'frontend', 'backend']
  },
  {
    id: '4',
    title: 'Database optimization',
    description: 'Optimize database queries and add proper indexing for better performance.',
    status: 'parked',
    priority: 'low',
    assigneeId: '4',
    assigneeName: 'John Doe',
    createdBy: 'Mike Johnson',
    createdAt: '2025-01-12T14:00:00Z',
    updatedAt: '2025-01-17T10:30:00Z',
    dueDate: '2025-01-28',
    estimatedHours: 8,
    subtasks: [
      { id: 'st12', title: 'Analyze slow queries', completed: true },
      { id: 'st13', title: 'Add database indexes', completed: false },
      { id: 'st14', title: 'Optimize data models', completed: false }
    ],
    comments: [],
    attachments: [],
    reminders: [],
    tags: ['database', 'performance', 'backend']
  },
  {
    id: '5',
    title: 'Mobile responsiveness',
    description: 'Ensure the application works perfectly on mobile devices and tablets.',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: '5',
    assigneeName: 'Lisa Wang',
    createdBy: 'Sarah Chen',
    createdAt: '2025-01-14T13:00:00Z',
    updatedAt: '2025-01-19T11:20:00Z',
    dueDate: '2025-01-26',
    estimatedHours: 14,
    actualHours: 6,
    subtasks: [
      { id: 'st15', title: 'Responsive dashboard layout', completed: true },
      { id: 'st16', title: 'Mobile navigation menu', completed: false },
      { id: 'st17', title: 'Touch-friendly interactions', completed: false }
    ],
    comments: [],
    attachments: [],
    reminders: [],
    tags: ['frontend', 'mobile', 'responsive']
  },
  {
    id: '6',
    title: 'Performance monitoring setup',
    description: 'Set up monitoring and alerting for application performance metrics.',
    status: 'todo',
    priority: 'high',
    assigneeId: '6',
    assigneeName: 'Tom Wilson',
    createdBy: 'John Doe',
    createdAt: '2025-01-17T16:00:00Z',
    updatedAt: '2025-01-17T16:00:00Z',
    dueDate: '2025-01-22',
    estimatedHours: 10,
    subtasks: [
      { id: 'st18', title: 'Set up monitoring dashboard', completed: false },
      { id: 'st19', title: 'Configure alerts', completed: false },
      { id: 'st20', title: 'Document procedures', completed: false }
    ],
    comments: [],
    attachments: [],
    reminders: [],
    tags: ['monitoring', 'devops', 'performance']
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [teamMembers] = useState(mockTeamMembers);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const createTask = (taskData: CreateTaskRequest) => {
    const assignee = teamMembers.find(member => member.id === taskData.assigneeId);
    
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      status: 'todo',
      assigneeName: assignee?.name || 'Unknown',
      assigneeAvatar: assignee?.avatar,
      createdBy: 'Current User', // In real app, get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: taskData.subtasks?.map(st => ({
        id: generateId(),
        ...st
      })) || [],
      comments: [],
      attachments: [],
      reminders: []
    };

    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            ...updates, 
            updatedAt: new Date().toISOString(),
            // If assigneeId is updated, update assigneeName as well
            ...(updates.assigneeId && {
              assigneeName: teamMembers.find(m => m.id === updates.assigneeId)?.name || task.assigneeName,
              assigneeAvatar: teamMembers.find(m => m.id === updates.assigneeId)?.avatar || task.assigneeAvatar
            })
          }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addComment = (taskId: string, content: string) => {
    const comment = {
      id: generateId(),
      content,
      author: 'Current User', // In real app, get from auth context
      authorId: 'current-user-id',
      timestamp: new Date().toISOString()
    };

    updateTask(taskId, {
      comments: [...(tasks.find(t => t.id === taskId)?.comments || []), comment]
    });
  };

  const addAttachment = (taskId: string, file: File) => {
    const attachment = {
      id: generateId(),
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file) // In real app, upload to server
    };

    updateTask(taskId, {
      attachments: [...(tasks.find(t => t.id === taskId)?.attachments || []), attachment]
    });
  };

  return {
    tasks,
    teamMembers,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    addAttachment
  };
};