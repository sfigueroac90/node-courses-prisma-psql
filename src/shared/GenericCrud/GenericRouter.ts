import { Router } from "express";
import prisma from "../../prisma";
import { BaseCrudService, ConnectedCrudService } from "./GenericCrud.service";
import { GenericHandler } from "./GenericCrud.handler";
import { authProtect } from "../../auth/auth.middlewares";

export const createRouter = <E>(
  key: keyof typeof prisma,
  sorter: any,
  searchFields?: string[],
  owned?: boolean,
  connect?: string
) => {
  const router = Router();
  const service = connect
    ? new ConnectedCrudService<E>(key, sorter, connect, searchFields)
    : new BaseCrudService<E>(key);
  const handlers = new GenericHandler<E>(service, owned);
  router.get("/", handlers.getAll);
  router.get("/:id", handlers.get);
  router.post("/", authProtect, handlers.create);
  router.delete("/:id", authProtect, handlers.remove);
  router.patch("/:id", authProtect, handlers.update);
  return router;
};
