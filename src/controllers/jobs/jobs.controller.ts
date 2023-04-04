import { NotFoundError } from "./../../errors/not-found-error";
import { Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { getJobDetails, getJobsList } from "../../services/jobs/jobs.services";

export const getJobsListHandler = async (req: Request, res: Response) => {
  const { searchQuery, location, resultsCount } = req.body;

  const { jobList, url } = await getJobsList(
    searchQuery,
    resultsCount,
    location
  );

  if (!jobList) {
    throw new NotFoundError("Job list is not found.");
  }

  return res.status(200).send({ success: true, url, data: jobList });
};

export const getJobsDetailsHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { jobDetails, url } = await getJobDetails(id);

  if (!jobDetails) {
    throw new NotFoundError("Job details are not found.");
  }

  return res.status(200).send({ success: true, url, data: jobDetails });
};
