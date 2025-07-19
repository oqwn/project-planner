export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'parked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dependsOn?: string[]; // IDs of other subtasks this depends on
}

export interface TaskComment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: string;
  mentions?: string[]; // User IDs mentioned in the comment
}

export interface TaskAttachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface TaskReminder {
  id: string;
  datetime: string;
  message?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  estimatedHours: number;
  actualHours?: number;
  subtasks: Subtask[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  reminders: TaskReminder[];
  tags?: string[];
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  priority: TaskPriority;
  estimatedHours: number;
  subtasks?: Omit<Subtask, 'id'>[];
  tags?: string[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
  status?: TaskStatus;
}

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  limit?: number;
}

export interface TaskFilters {
  search: string;
  assignee: string;
  priority: TaskPriority | 'all';
  status: TaskStatus | 'all';
  dueDate: 'overdue' | 'today' | 'this-week' | 'all';
}