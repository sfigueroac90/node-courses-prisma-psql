import { Router } from "express";
import prisma from "../../prisma";
import { BaseCrudService } from "./GenericCrud.service";
import { GenericHandler } from "./GenericCrud.handler";
import { authProtect } from "../../auth/auth.middlewares";

export const createRouter = <E>(
  key: keyof typeof prisma,
  owned?: boolean,
  connect?: string[]
) => {
  const router = Router();
  const service = new BaseCrudService<E>(key);
  const handlers = new GenericHandler<E>(service, owned, connect);
  router.get("/", handlers.getAll);
  router.get("/:id", handlers.get);
  router.post("/", authProtect, handlers.create);
  router.delete(`/:id`, handlers.remove);
  router.patch("/:id"), handlers.update;
  return router;
};
