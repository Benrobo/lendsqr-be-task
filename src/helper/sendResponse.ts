import { RESPONSE_CODE } from "../@types";
import { Response } from "express";

export default class SendResponse {
  capitalizeWord(word: string) {
    const capWrd = word.split("")[0].toUpperCase() + word.slice(1);
    return capWrd;
  }

  error(
    res: Response,
    code: RESPONSE_CODE,
    message: string,
    statusCode: number,
    data?: any
  ) {
    const response = {
      errorStatus: true,
      code: RESPONSE_CODE[code],
      message: message ?? this.capitalizeWord("error-message"),
      statusCode: statusCode ?? 400,
      data,
    };
    return res.status(statusCode).json(response);
  }

  success(
    res: Response,
    code: RESPONSE_CODE,
    message: string,
    statusCode: number,
    data?: any
  ) {
    const response = {
      errorStatus: false,
      code: RESPONSE_CODE[code],
      message: message ?? this.capitalizeWord("success-message"),
      statusCode: statusCode ?? 200,
      data: data ?? null,
    };
    return res.status(statusCode).json(response);
  }
}
