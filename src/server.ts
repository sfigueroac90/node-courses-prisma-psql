import createAppRouter from "./router";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use("/", createAppRouter());

const port = process.env.PORT || 3000;

export const startServer = () => {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};
