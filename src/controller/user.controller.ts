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

  async fetchTransactions(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const allTransactions = await db("transactions")
      .where((builder) => {
        builder
          .orWhere("transactions.receiver_id", userId)
          .orWhere("transactions.sender_id", userId);
      })
      .leftJoin("users as sender", "sender.id", "transactions.sender_id")
      .leftJoin("users as receiver", "receiver.id", "transactions.receiver_id")
      .select(
        // "transactions.sender_id",
        // "transactions.receiver_id",
        "transactions.amount",
        "transactions.status",
        "transactions.fee",
        "transactions.type",
        "transactions.created_at",
        "transactions.updated_at",
        "sender.email as sender_email",
        "receiver.email as receiver_email",
        "sender.username as sender_username",
        "receiver.username as receiver_username"
      );

    const transactions = allTransactions.map((transaction) => {
      const resp = {
        ...transaction,
        sender: transaction.sender_email
          ? {
              email: transaction.sender_email,
              username: transaction.sender_username,
            }
          : null,
        receiver: transaction.receiver_email
          ? {
              email: transaction.receiver_email,
              username: transaction.receiver_username,
            }
          : null,
      };

      delete resp["sender_email"];
      delete resp["receiver_email"];
      delete resp["sender_username"];
      delete resp["receiver_username"];
      return resp;
    });

    this.success(
      res,
      RESPONSE_CODE.TRANSACTIONS_FETCHED_SUCCESSFULL,
      "All transactions fetched successfully",
      201,
      transactions
    );
  }
}
