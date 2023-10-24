import { Request, Response } from "express";
import { RESPONSE_CODE } from "../@types";
import BaseController from "./base.controller";

export default class WalletController extends BaseController {
  constructor() {
    super();
  }

  async fund(req: Request, res: Response) {}
}
