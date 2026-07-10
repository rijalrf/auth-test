export interface TTodoResponse {
  id: string;
  title: string;
  description: string | null;
  deadline: Date | null;
  completed: boolean;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateTodoInput {
  title: string;
  description?: string;
  deadline?: string;
  color?: string;
}

export interface TUpdateTodoInput {
  title?: string;
  description?: string;
  deadline?: string;
  completed?: boolean;
  color?: string;
}

export interface TPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
