import logger from "../config/logger";
import { NextFunction, Request, Response } from "express";
import db from "../config/db";
import { RESPONSE_CODE, decodedJWT } from "../@types";
import JWT from "../helper/jwt";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      code: RESPONSE_CODE[RESPONSE_CODE.UNAUTHORIZED],
      message: "Unauthorized",
    });
  }
  try {
    // verify token
    const jwt = new JWT();
    const decoded: decodedJWT = await jwt.verifyToken(token);

    // check if user exists or not
    const users = await db("users").where("id", decoded.userId);
    const user = users[0];
    if (!user || typeof user === "undefined") {
      return res.status(404).json({
        code: RESPONSE_CODE[RESPONSE_CODE.USER_NOT_FOUND],
        message: `account not found`,
      });
    }
    req["user"] = { id: decoded.userId };
    next();
  } catch (err: any) {
    // console.log(err);
    logger.error(`Forbidden: ${err.message}`);
    return res
      .status(403)
      .json({
        code: RESPONSE_CODE[RESPONSE_CODE.FORBIDDEN],
        message: "Invalid authorization token",
      });
  }
}
