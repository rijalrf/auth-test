import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';
import { ApiError } from '../utils/errors.js';
import type { RegisterInput, RegisterResult } from '../types/users.types.js';

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
