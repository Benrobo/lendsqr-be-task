import express from "express";
import useCatchErrors from "../error/catchErrors";
import AuthController from "../controller/auth.controller";
import zodValidation from "../middlewares/zodValidation";

export default class AuthRoute {
  router = express.Router();
  authController = new AuthController();
  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      zodValidation,
      useCatchErrors(this.authController.signup.bind(this.authController))
    );

    this.router.post(
      `${this.path}/login`,
      zodValidation,
      useCatchErrors(this.authController.login.bind(this.authController))
    );
  }
}
