import { Handler, Request } from "express";
import {
  createNewUserService,
  findUserById,
  findUserByName,
} from "./auth.service";
import { comparePasswords, createJWT, hashPassword } from "./auth.helpers";
import { User } from "@prisma/client";

export const newUserHanlder: Handler = async (req, res, next) => {
  const user = req.body;
  try {
    const createUser = await createNewUserService(user);
    res.status(200);
    res.json({ data: { id: createUser.id, userName: createUser.userName } });
  } catch (e) {
    console.log({ e, code: e.code });
    next(e);
  }
};

export const loginHandler: Handler = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const user = await findUserByName(userName);

    if (comparePasswords(password, user.password)) {
      res.status(200);
      res.json({ token: createJWT(user) });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: "User not found" });
  }
};

export const userInfoHandler: Handler = async (
  req: Request & { user?: User },
  res,
  next
) => {
  const id = req.user!.id;
  const user = await findUserById(id);
  console.log({ user });
  res.status(200);
  res.json({ id: user.id, userName: "sf00", name: user.name });
};
