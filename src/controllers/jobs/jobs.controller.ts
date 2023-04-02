import { NotFoundError } from "./../../errors/not-found-error";
import { Request, Response } from "express";
import { BadRequestError } from "../../errors/bad-request-error";
import { getJobList } from "../../services/jobs/jobs.services";

export const getJobsListHandler = async (req: Request, res: Response) => {
  const { searchQuery, location, resultsCount } = req.body;

  const [url, title, page] = await getJobList(
    searchQuery,
    resultsCount,
    location
  );

  // if (!jobList) {
  //   throw new NotFoundError("Job list is not found.");
  // }

  return res.status(200).send({ success: true, url, title, page });
};

export const getJobsDetailsHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return;
  }

  return res.status(200).send(id);
};
