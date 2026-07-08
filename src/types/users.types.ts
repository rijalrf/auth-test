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

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  id: string;
  email: string;
  name: string | null;
  token: string;
}
