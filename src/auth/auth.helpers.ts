import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./auth.constants";

const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

export const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const createJWT = (user: User) => {
  return jwt.sign({ id: user.id, userName: user.userName }, JWT_SECRET, {
    expiresIn: new Date().getTime() + MILLIS_IN_DAY,
  });
};
