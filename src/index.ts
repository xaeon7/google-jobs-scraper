import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import { mainRouter } from "./routes";
import log from "./utils/logger";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({ url: redisUrl });
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => log.info("Redis connected"));

(async () => {
  await redisClient.connect();
})();

const app = express();

const PORT = config.get<number>("port");

app.use(express.json());

//! routes - start
app.use("/api/v1", mainRouter);
//! routes - end

app.listen(PORT, () => {
  log.info(`SERVER UP AND LISTENING ON PORT ${PORT}!`);
  log.info(`Server status : GET http://localhost:${PORT}/api/v1/status`);
});
