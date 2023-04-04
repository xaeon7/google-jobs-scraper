import { NextFunction, Request, Response } from "express";

export function cache(req: Request, res: Response, next: NextFunction) {
  const period = 60 * 5; // Cache for 5 mins

  if (req.method === "GET") {
    res.set("Cache-control", `public, max-age=${period}`);
  } else {
    res.set("Cache-control", `no-store`);
  }

  next();
}
