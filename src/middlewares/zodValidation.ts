import { RESPONSE_CODE } from "../@types";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export default function zodValidation(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body ?? req.params ?? req.query);
    try {
      await schema.parseAsync(req.body ?? req.params ?? req.query);
      return next();
    } catch (error) {
      return res.status(400).json({
        code: RESPONSE_CODE[RESPONSE_CODE.VALIDATION_ERROR],
        error: {
          message: error?.issues[0]?.message,
          error,
        },
      });
    }
  };
}
