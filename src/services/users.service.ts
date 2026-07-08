import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';
import type { RegisterInput, RegisterResult } from '../types/users.types.js';

const SALT_ROUNDS = 12;

export const registerUser = async (prisma: PrismaClient, input: RegisterInput): Promise<RegisterResult> => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { code: 'USER_EMAIL_EXISTS', status: 409 });
  }

  let passwordHash: string;
  try {
    passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  } catch {
    throw Object.assign(new Error('Failed to encrypt password'), { code: 'PASSWORD_HASH_ERROR', status: 500 });
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
