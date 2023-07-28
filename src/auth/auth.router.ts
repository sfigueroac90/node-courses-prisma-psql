import { Router } from "express";
import { loginHandler, newUserHanlder, userInfoHandler } from "./auth.handler";

const authRouter = Router();
authRouter.post("/signup", newUserHanlder);
authRouter.post("/login", loginHandler);
authRouter.post("/userinfo", userInfoHandler);

export { authRouter };
