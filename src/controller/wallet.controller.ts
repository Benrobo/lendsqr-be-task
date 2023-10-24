import { Request, Response } from "express";
import {
  FundWalletType,
  FundWalletType as FundWithdrawalType,
  RESPONSE_CODE,
  TransactionType,
  TransferFunds,
  UserTransferDetails,
} from "../@types";
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
      type: "funding",
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

  async transfer(req: Request, res: Response) {
    const userId = (req as any)?.user?.id;
    const { pin, amount, recepient_email } = req.body as TransferFunds;

    const users = await db("users")
      .join("wallet", "wallet.user_id", "=", "users.id")
      .join("users as sender", "users.id", "sender.id")
      .join("users as receiver", "users.email", "receiver.email")
      .select(
        "users.email",
        "wallet.balance",
        "users.id",
        "users.transaction_pin"
      )
      .where((builder) => {
        builder
          .where("sender.id", userId)
          .orWhere("receiver.email", recepient_email);
      });

    const [sender, receiver] = users as UserTransferDetails[];

    // check sender credentials
    if (!bcrypt.compareSync(pin, sender.transaction_pin)) {
      return this.error(
        res,
        RESPONSE_CODE.INVALID_TRANSACTION_PIN,
        "Invalid transaction credentials",
        400
      );
    }

    if (typeof receiver === "undefined") {
      return this.error(
        res,
        RESPONSE_CODE.RECEPIENT_NOT_FOUND,
        `Recepient not found`,
        404
      );
    }

    // prevent sending to same account
    if (sender.id === receiver.id) {
      return this.error(
        res,
        RESPONSE_CODE.SELF_TRANSFER_NOT_ALLOWED,
        `You cannot send money to your own account.`,
        403
      );
    }

    // check if sender has sufficient funds
    if (sender.balance < amount) {
      return this.error(
        res,
        RESPONSE_CODE.INSUFFICIENT_FUNDS,
        `Insufficient funds in your account to complete this transaction.`,
        400
      );
    }

    // credit receiver & debit sender
    const debitedBalance = sender.balance - amount;
    const creditedBalance = receiver.balance + amount;

    // credit
    await db("wallet")
      .update({
        balance: creditedBalance,
      })
      .where("wallet.user_id", receiver.id);

    // debit
    await db("wallet")
      .update({
        balance: debitedBalance,
      })
      .where("wallet.user_id", sender.id);

    // create transactions
    await db("transactions").insert({
      id: shortUUID.generate(),
      receiver_id: receiver.id,
      sender_id: sender.id,
      amount,
      status: TransactionType[TransactionType.success],
      type: "transfer",
      fee: 0,
    });

    this.success(
      res,
      RESPONSE_CODE.TRANSFER_SUCCESSFULL,
      "Transfer successfull.",
      201
    );
  }

  async withdrawFunds(req: Request, res: Response) {
    const userId = (req as any)?.user?.id;
    const { pin, amount } = req.body as FundWithdrawalType;

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

    // check if withdrawal amount is valid
    if (balance < amount) {
      return this.error(
        res,
        RESPONSE_CODE.INSUFFICIENT_FUNDS,
        `Insufficient funds in your account to complete this transaction.`,
        400
      );
    }

    // withdraw wallet
    const totalBalance = balance - amount;
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
      type: "withdrawal",
      fee: 0,
    });

    this.success(
      res,
      RESPONSE_CODE.WITHDRAWAL_SUCCESSFULL,
      "withdrawal successfully.",
      201,
      { totalBalance }
    );
  }
}
