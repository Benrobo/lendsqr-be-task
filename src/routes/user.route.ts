import express from "express";
import useCatchErrors from "../error/catchErrors";
import UserController from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/auth";
import zodValidation from "../middlewares/zodValidation";
import { TransactionPinSchema } from "../helper/validate";

export default class UserRoute {
  router = express.Router();
  userController = new UserController();
  path = "/user";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.patch(
      `${this.path}/transactionPin`,
      isAuthenticated,
      zodValidation(TransactionPinSchema),
      useCatchErrors(
        this.userController.updateTransactionPin.bind(this.userController)
      )
    );

    this.router.get(
      `${this.path}/transactions`,
      isAuthenticated,
      useCatchErrors(
        this.userController.fetchTransactions.bind(this.userController)
      )
    );
  }
}
