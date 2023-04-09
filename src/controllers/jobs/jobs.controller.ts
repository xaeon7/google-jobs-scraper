import { NotFoundError } from "./../../errors/not-found-error";
import { Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { getJobList } from "../../services/jobs/jobs.services";
import { redisClient } from "../..";

export const getJobsListHandler = async (req: Request, res: Response) => {
  const { searchQuery, location, resultsCount } = req.body;

  const cachedData = await redisClient.get(`${searchQuery}_${resultsCount}`);

  if (cachedData !== null)
    return res
      .status(200)
      .send({ success: true, data: JSON.parse(cachedData) });

  const jobList = await getJobList(searchQuery, resultsCount, location);

  if (!jobList) {
    throw new NotFoundError("Job list is not found.");
  }

  return res
    .status(200)
    .send({ success: true, count: jobList.length, data: jobList });
};

export const getJobsDetailsHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return;
  }

  return res.status(200).send(id);
};
