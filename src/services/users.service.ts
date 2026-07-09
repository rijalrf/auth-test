import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';
import * as sessionRepository from '../repository/session.repository.js';
import * as usersRepository from '../repository/users.repository.js';
import type { RegisterInput, RegisterResult, LoginInput, LoginResult, LogoutResult, UserProfile } from '../types/users.types.js';

const SALT_ROUNDS = 12;
const ERROR = {
  EMAIL_EXISTS: 'Email already registered',
  PASSWORD_HASH_FAILED: 'Failed to encrypt password',
} as const;

/**
 * Register a new user with email, password, and optional name.
 * Throws 409 if email already exists.
 */
export const registerUser = async (prisma: PrismaClient, input: RegisterInput): Promise<RegisterResult> => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(ERROR.EMAIL_EXISTS, 'USER_EMAIL_EXISTS', 409);
  }

  let passwordHash: string;
  try {
    passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  } catch {
    throw new ApiError(ERROR.PASSWORD_HASH_FAILED, 'PASSWORD_HASH_ERROR', 500);
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.createdAt,
  };
};

const SESSION_EXPIRY_HOURS = (() => {
  const val = process.env.SESSION_EXPIRY_HOURS;
  if (!val) return 24;
  const n = parseInt(val, 10);
  return isNaN(n) || n < 1 ? 24 : n;
})();

/**
 * Authenticate user with email + password, returns user data + session token.
 * Throws 401 on invalid credentials.
 */
export const loginUser = async (prisma: PrismaClient, input: LoginInput): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new ApiError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new ApiError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
  }

  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 3_600_000);
  const session = await sessionRepository.createUserSession(prisma, user.id, expiresAt);

  return { id: user.id, email: user.email, name: user.name, token: session.token };
};

/**
 * Get current authenticated user's profile.
 */
export const getCurrentUserInfo = async (prisma: PrismaClient, userId: string): Promise<UserProfile> => {
  const user = await usersRepository.getUserById(prisma, userId);
  if (!user) {
    throw new ApiError('User not found', 'USER_NOT_FOUND', 404);
  }
  return user;
};

/**
 * Invalidate all sessions for a user (logout). Idempotent — always returns ok.
 */
export const logoutUser = async (prisma: PrismaClient, userId: string): Promise<LogoutResult> => {
  await sessionRepository.deleteUserSession(prisma, userId);
  return { data: 'ok' };
};
