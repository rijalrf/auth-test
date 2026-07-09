import { PrismaClient } from "../generated/prisma/client.js";
import type { UserProfile } from "../types/users.types.js";

export const getUserById = async (
  prisma: PrismaClient,
  userId: string,
): Promise<UserProfile | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });
  return user;
};

export const findUserByEmail = async (
  prisma: PrismaClient,
  email: string,
): Promise<{
  id: string;
  email: string;
  name: string | null;
  passwordHash: string;
} | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

export const createUser = async (
  prisma: PrismaClient,
  data: {
    email: string;
    name: string;
    passwordHash: string;
  },
): Promise<{
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}> => {
  const user = await prisma.user.create({ data });
  return user;
};
