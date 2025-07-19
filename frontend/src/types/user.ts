export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_LEAD' | 'MEMBER' | 'VIEWER';
  interests?: string[];
  associations?: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreateUserRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserRequest = Partial<User>;
