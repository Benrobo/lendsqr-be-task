import { Request, Response } from "express";
import { FundWalletType, RESPONSE_CODE, TransactionType } from "../@types";
import BaseController from "./base.controller";
import db from "../config/db";
import bcrypt from "bcryptjs";
import shortUUID from "short-uuid";

export default class WalletController extends BaseController {
  constructor() {
    super();
  }

  async fund(req: Request, res: Response) {
    const userId = (req as any)?.user?.id;
    const { pin, amount } = req.body as FundWalletType;

    // check if pin is valid
    const details = await db("users")
      .where("users.id", userId)
      .join("wallet", "wallet.user_id", "=", "users.id")
      .select("users.transaction_pin", "wallet.balance");

    const { transaction_pin, balance } = details[0];
    if (!bcrypt.compareSync(pin, transaction_pin)) {
      return this.error(
        res,
        RESPONSE_CODE.INVALID_TRANSACTION_PIN,
        "Invalid transaction credentials",
        400
      );
    }

    // fund wallet
    const totalBalance = balance + amount;
    await db("wallet")
      .update({
        balance: totalBalance,
      })
      .where("wallet.user_id", userId);

    // create transaction
    await db("transactions").insert({
      id: shortUUID.generate(),
      receiver_id: userId,
      amount,
      status: TransactionType[TransactionType.success],
      fee: 0,
    });

    this.success(
      res,
      RESPONSE_CODE.WALLET_FUNDED_SUCCESSFULL,
      "wallet funded successfully.",
      201,
      { balance: totalBalance }
    );
  }
}
