import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';
import * as userRepository from '../repository/users.repository.js';
import type { RegisterInput, RegisterResult, LoginInput, LoginResult, LogoutResult } from '../types/users.types.js';

const SALT_ROUNDS = 12;
const ERROR = {
  EMAIL_EXISTS: 'Email already registered',
  PASSWORD_HASH_FAILED: 'Failed to encrypt password',
} as const;

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
  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt },
  });

  return { id: user.id, email: user.email, name: user.name, token: session.token };
};

export const logoutUser = async (prisma: PrismaClient, userId: string): Promise<LogoutResult> => {
  // Idempotent by design: if session already deleted (already logged out),
  // we still return success — client doesn't need to know DB state.
  // The auth middleware already validated the token before reaching here.
  await userRepository.deleteUserSession(prisma, userId);
  return { data: 'ok' };
};
