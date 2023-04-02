import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import { mainRouter } from "./routes";
import log from "./utils/logger";

const app = express();

const port = config.get("port");

app.use(express.json());

//! routes - start
app.use("/api/v1", mainRouter);
//! routes - end

app.listen(port, () => {
  log.info(`SERVER UP AND LISTENING ON PORT ${port}!`);
  log.info(`Server status : GET http://localhost:${port}/api/v1/status`);
});
