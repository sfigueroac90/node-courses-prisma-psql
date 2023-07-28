import jwt from "jsonwebtoken";
import { Handler, Request } from "express";
import {
  createNewUserService,
  findUserById,
  findUserByName,
} from "./auth.service";
import { comparePasswords, createJWT, hashPassword } from "./auth.helpers";
import { User } from "@prisma/client";
import { JWT_SECRET } from "./auth.constants";

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
  const { login, userName, password } = req.body;
  try {
    const user = await findUserByName(userName || login);

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
  const userfromToken = jwt.verify(req.body.token, JWT_SECRET);
  const user = await findUserById(userfromToken["id"]);
  console.log({ ...user, login: user.userName });
  res.status(200);
  res.json({
    id: user.id,
    userName: user.userName,
    name: user.name,
    login: user.userName,
  });
};
