export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResult {
  id: string;
  email: string;
  name: string | null;
  created_at: Date;
}
