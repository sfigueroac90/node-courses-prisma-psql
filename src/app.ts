import express from "express";
import morgan from "morgan";
import { authRouter } from "./auth";
import cors from "cors";
import { Author, Course } from "@prisma/client";
import { BaseCrudService } from "./shared/GenericCrud/GenericCrud.service";
import { GenericHandler } from "./shared/GenericCrud/GenericCrud.handler";
import { createRouter } from "./shared/GenericCrud/GenericRouter";
import { removeNullOnBodyMiddleware } from "./shared/GenericCrud/Middlewares/CleanReqBody";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/auth", authRouter);
app.use("/authors", createRouter<Author>("author", undefined, ["name"], false));
app.use(
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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.json({ error: err.message || "There was an error", code: err.code });
});

export default app;
