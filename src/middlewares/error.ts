import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { RESPONSE_CODE } from "@types";

export default function HandleErrors(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err);

  res.status(500).json({
    errorStatus: true,
    statusCode: 500,
    code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    message: "Something went wrong",
    details: {
      stacks: process.env.NODE_ENV !== "production" && err?.stack,
    },
  });
}
