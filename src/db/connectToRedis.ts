import { createClient } from "redis";
import log from "../utils/logger";

export async function connectToRedis() {
  const redisClient = createClient({ url: "redis://localhost:6379" });
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  redisClient.on("connect", () => log.info("Redis connected"));

  return redisClient;
}
