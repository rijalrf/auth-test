import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client.js';

const SALT_ROUNDS = 12;

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

export const createUserService = (prisma: PrismaClient) => {
  const registerUser = async (input: RegisterInput): Promise<RegisterResult> => {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { code: 'USER_EMAIL_EXISTS', status: 409 });
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

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

  return { registerUser };
};
