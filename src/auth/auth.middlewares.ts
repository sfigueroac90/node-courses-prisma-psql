import jwt from "jsonwebtoken";
import { Handler } from "express";
import { JWT_SECRET } from "./auth.constants";

export const authProtect: Handler = (req, res, next) => {
  const token = req.headers["authorization"];
  const user = jwt.verify(token, JWT_SECRET);
  if (user) {
    req["user"] = user;
    next();
  } else {
    next(new Error("User could not be verified"));
  }
};
