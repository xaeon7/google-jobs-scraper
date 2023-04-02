import express from "express";
import { jobsRouter } from "./jobs";

const router = express.Router();

//? GET
router.get("/status", async (_, res) => {
  res.send("Server up and running 👌");
});

router.use("/jobs", jobsRouter);

export { router as mainRouter };
