import { Request, Response, NextFunction } from "express";
import { ZodError, prettifyError } from "zod";
import { AppError } from "../exceptions/AppError";
import { createResponse } from "../utils/createResponse";

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
      .json(createResponse(false, null, prettifyError(error)));
  }

  // Custom errors
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json(createResponse(false, null, error.message));
  }

  // Unknow errors
  return res
    .status(500)
    .json(createResponse(false, null, "Internal Server Error"));
};
