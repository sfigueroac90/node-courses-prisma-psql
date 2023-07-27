import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

export const startServer = () => {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};
