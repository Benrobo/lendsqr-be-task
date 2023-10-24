import { Request, Response } from "express";
import { RESPONSE_CODE } from "../@types";
import BaseController from "./base.controller";
import { TransactionPinSchema } from "../helper/validate";
import bcrypt from "bcryptjs";
import db from "../config/db";

export default class UserController extends BaseController {
  constructor() {
    super();
  }

  async getInfo(req, res) {}

  async updateTransactionPin(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const { pin } = req.body;
    const pinHash = bcrypt.hashSync(pin.toString(), 10);

    // update transaction
    await db("users")
      .update({
        transaction_pin: pinHash,
      })
      .where("id", userId);

    this.success(
      res,
      RESPONSE_CODE.TRANSACTION_PIN_UPDATED_SUCCESSFULL,
      "Transaction pin updated successfully",
      201
    );
  }
}
