import express from "express";
import useCatchErrors from "../error/catchErrors";
import WalletController from "../controller/wallet.controller";
import { isAuthenticated } from "../middlewares/auth";
import zodValidation from "../middlewares/zodValidation";
import { WalletFundingSchema } from "../helper/validate";

export default class WalletRoute {
  router = express.Router();
  walletController = new WalletController();
  path = "/wallet";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}`,
      isAuthenticated,
      zodValidation(WalletFundingSchema),
      useCatchErrors(this.walletController.fund.bind(this.walletController))
    );
  }
}
