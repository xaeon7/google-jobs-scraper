import { NotFoundError } from "./../../errors/not-found-error";
import { Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { getJobList, getJobDetails } from "../../services/jobs/jobs.services";
import { redisClient } from "../..";

export const getJobsListHandler = async (req: Request, res: Response) => {
  const { searchQuery, location, resultsCount } = req.body;

  // TODO: if resultsCount < CachedResults return from cache
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

  const { jobDetails, url } = await getJobDetails(id);

  if (!jobDetails) {
    throw new NotFoundError("Job details are not found.");
  }

  return res.status(200).send({ success: true, url, data: jobDetails });
};
