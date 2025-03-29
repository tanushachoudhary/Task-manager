
export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  categoryId: string;
  createdAt: Date;
  dueDate?: Date;
};
