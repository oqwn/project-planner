export interface GanttTask {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO 8601 string from OffsetDateTime
  endDate: string;   // ISO 8601 string from OffsetDateTime
  progress: number;
  status: string;
  assigneeId?: string;
  assigneeName?: string;
  dependencies?: string[];
  type: 'task' | 'milestone';
  estimatedHours?: number;
  actualHours?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  projectName?: string;
  name: string;
  description?: string;
  targetDate: string; // ISO 8601 string from OffsetDateTime
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  completionPercentage?: number;
  tasksCompleted?: number;
  totalTasks?: number;
}

export interface TaskWorkload {
  taskId: string;
  taskTitle: string;
  estimatedHours: number;
  actualHours: number;
  variance: number;
  status: string;
}

export interface WorkloadComparison {
  userId: string;
  userName: string;
  tasks: TaskWorkload[];
  totalEstimatedHours: number;
  totalActualHours: number;
  variancePercentage: number;
}

export interface TeamAvailability {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  status: 'AVAILABLE' | 'BUSY' | 'OUT_OF_OFFICE' | 'HOLIDAY' | 'SICK_LEAVE';
  notes?: string;
}
