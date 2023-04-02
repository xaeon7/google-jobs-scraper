import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { BadRequestError } from "../errors/bad-request-error";

const validateResource =
  (schema: AnyZodObject) => (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (e: any) {
      throw new BadRequestError(e.errors[0].message);
    }
  };

export default validateResource;
