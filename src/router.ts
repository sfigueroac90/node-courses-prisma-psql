import { Author, Course } from "@prisma/client";
import cors from "cors";
import express, { Router } from "express";
import morgan from "morgan";
import { authRouter } from "./auth";
import { createRouter } from "./shared/GenericCrud/GenericRouter";
import { removeNullOnBodyMiddleware } from "./shared/GenericCrud/Middlewares/CleanReqBody";

export default function createAppRouter() {
  const router = Router();
  router.use(morgan("dev"));
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  router.use(cors());
  router.use("/auth", authRouter);
  router.use(
    "/authors",
    createRouter<Author>("author", undefined, ["name"], false)
  );
  router.use(
    "/courses",
    removeNullOnBodyMiddleware,
    createRouter<Course>(
      "course",
      { orderBy: { date: "desc" } },
      ["description", "name"],
      true,
      "authors"
    )
  );

  router.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.json({ error: err.message || "There was an error", code: err.code });
  });
  return router;
}
