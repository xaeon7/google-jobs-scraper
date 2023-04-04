import express from "express";
import {
  getJobsDetailsHandler,
  getJobsListHandler,
} from "../../controllers/jobs/jobs.controller";
import validateResource from "../../middleware/validateResource";
import { jobsListRequestSchema } from "../../schema/jobs/jobs.schema";
import { cache } from "../../middleware/cache";

const router = express.Router();

//? GET
router.get(
  "/list",
  cache,
  validateResource(jobsListRequestSchema),
  getJobsListHandler
);
router.get("/:id", cache, getJobsDetailsHandler);

export { router as jobsRouter };
