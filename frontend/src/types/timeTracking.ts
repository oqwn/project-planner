export interface TimeEntry {
  id: string;
  taskId: string;
  taskName?: string;
  userId: string;
  date: string;
  hours: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeEntryRequest {
  taskId: string;
  date: string;
  hours: number;
  description?: string;
}

export interface UpdateTimeEntryRequest {
  hours: number;
  description?: string;
}

export interface TimeEntryResponse extends TimeEntry {
  taskName: string;
  userName: string;
}