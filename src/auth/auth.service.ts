import { User } from "@prisma/client";
import prisma from "../prisma";
import { hashPassword } from "./auth.helpers";

export const createNewUserService = async (user: User) => {
  const hashedPassword = await hashPassword(user.password);
  const userToAdd = { ...user, password: hashedPassword };
  const result = await prisma.user.create({ data: userToAdd });
  return result;
};

export const findUserByName = async (userName: string) => {
  return await prisma.user.findUnique({ where: { userName } });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};
