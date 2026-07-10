export interface TodoResponse {
  id: string;
  title: string;
  description: string | null;
  deadline: Date | null;
  completed: boolean;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  deadline?: string;
  color?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  deadline?: string;
  completed?: boolean;
  color?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
