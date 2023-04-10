import { NotFoundError } from "./../../errors/not-found-error";
import { Request, Response } from "express";
import { getJobList, getJobDetails } from "../../services/jobs/jobs.services";
import { redisClient } from "../..";

export const getJobsListHandler = async (req: Request, res: Response) => {
  const { searchQuery, location, resultsCount } = req.body;

  const cachedData = await redisClient.get(
    `${searchQuery.toLowerCase().replace(" ", "")}`
  );

  if (
    cachedData !== null &&
    JSON.parse(cachedData)?.jobList?.length >= resultsCount
  ) {
    const data = JSON.parse(cachedData)?.jobList.slice(0, resultsCount);
    return res.status(200).send({
      success: true,
      count: data.length,
      data,
    });
  }

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

  const cachedData = await redisClient.get(`${id}`);

  if (cachedData !== null) {
    return res
      .status(200)
      .send({ success: true, data: JSON.parse(cachedData) });
  }

  if (!jobDetails) {
    throw new NotFoundError("Job details are not found.");
  }

  return res.status(200).send({ success: true, url, data: jobDetails });
};
