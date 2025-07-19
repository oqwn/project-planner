export interface DashboardStats {
  totalTasks: { value: number; trend: string };
  inProgress: { value: number; trend: string };
  completed: { value: number; trend: string };
  overdue: { value: number; trend: string };
}

export interface RecentActivity {
  id: string;
  type: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  tasksCompleted: number;
  totalTasks: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  email?: string;
}
