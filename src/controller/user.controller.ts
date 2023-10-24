import { RESPONSE_CODE } from "../@types";
import BaseController from "./base.controller";

export default class UserController extends BaseController {
  constructor() {
    super();
  }

  async getUser(req, res) {
    const userdata = [
      {
        name: "john doe",
        email: "john@mail.com",
      },
      {
        name: "brain tracy",
        email: "brian@mail.com",
      },
    ];
    this.success(
      res,
      RESPONSE_CODE.SUCCESS,
      "user data fetched successfully",
      200,
      userdata
    );
  }
}
