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
import { removeField } from "../shared/Utils/RemoveField";
import prisma from "../prisma";

export const newUserHanlder: Handler = async (req, res, next) => {
  const user = req.body;

  const previousUser = await findUserByName(user.userName || user.login);
  console.log({ previousUser });
  if (previousUser) {
    res.status(401);
    res.send("login.already_exists");
    next();
    return;
  }
  const { login, password } = user;
  const userTocreate = {
    name: { first: login, last: login },
    userName: login,
    password,
  };

  try {
    const createUser = await createNewUserService(
      userTocreate as unknown as User
    );
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

    console.log({ user });

    if (user && (await comparePasswords(password, user?.password))) {
      res.status(200);
      res.json({ token: createJWT(user) });
    } else {
      throw Error("User/password incorrect");
    }
  } catch (e) {
    console.log(e);
    res.status(401);
    res.send("Wrong username");
  }
};

export const userInfoHandler: Handler = async (
  req: Request & { user?: User },
  res,
  next
) => {
  const userfromToken = jwt.verify(req.body.token, JWT_SECRET);
  const user = await findUserById(userfromToken["id"]);
  console.log({ ...user, login: user.userName, password: "" });
  res.status(200);
  res.json(removeField(user, "password"));
};
