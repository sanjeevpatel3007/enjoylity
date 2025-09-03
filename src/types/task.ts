export interface Task {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: Date;
}

export type TaskStatus = 'all' | 'active' | 'completed';

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  done?: boolean;
}
