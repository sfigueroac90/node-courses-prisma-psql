import { Router } from "express";
import { loginHandler, newUserHanlder, userInfoHandler } from "./auth.handler";
import { authProtect } from "./auth.middlewares";

const authRouter = Router();
authRouter.post("/signin", newUserHanlder);
authRouter.post("/login", loginHandler);
authRouter.post("/userinfo", userInfoHandler);

export { authRouter };
