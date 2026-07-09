import { PrismaClient } from "../generated/prisma/client.js";
import type { UserProfile, UserWithPassword, CreateUserInput, CreatedUser } from "../types/users.types.js";

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
): Promise<UserWithPassword | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

export const createUser = async (
  prisma: PrismaClient,
  data: CreateUserInput,
): Promise<CreatedUser> => {
  const user = await prisma.user.create({ data });
  return user;
};
