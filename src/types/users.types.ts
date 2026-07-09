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

export interface LogoutResult {
  data: 'ok';
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
}

export interface UserWithPassword {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash: string;
}

export interface CreatedUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

// Express augmentation for auth middleware
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
