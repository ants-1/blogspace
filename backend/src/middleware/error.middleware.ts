import { Request, Response, NextFunction } from "express";
import { ZodError, prettifyError } from "zod";
import { AppError } from "../exceptions/AppError";
import { createReponse } from "../utils/createReponse";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Zod validation errors
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json(createReponse(false, null, prettifyError(error)));
  }

  // Custom errors
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json(createReponse(false, null, error.message));
  }

  // Unknow errors
  return res
    .status(500)
    .json(createReponse(false, null, "Internal Server Error"));
};
