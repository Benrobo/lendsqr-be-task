import { Request, Response } from "express";
import BaseController from "./base.controller";
import { LoginSchema, SignupSchema } from "../helper/validate";
import { RESPONSE_CODE } from "../@types/index";
import db from "../config/db";
import bcrypt from "bcryptjs";
import shortUUID from "short-uuid";
import JWT from "../helper/jwt";

export default class AuthController extends BaseController {
  constructor() {
    super();
  }

  async signup(req: Request, res: Response) {
    const payload = req.body;
    const validate = SignupSchema.safeParse(payload);
    if (!validate.success) {
      return this.error(
        res,
        RESPONSE_CODE.INVALID_FIELDS,
        "One or more of the input is invalid.",
        400
      );
    }
    const { email, username, password } = validate.data;

    // check if user exists
    const users = await db("users").where("email", email);
    if (users.length > 0) {
      return this.error(
        res,
        RESPONSE_CODE.USER_ALREADY_EXIST,
        "user with this email already exists",
        400
      );
    }

    // generate password hash
    const hashPwd = bcrypt.hashSync(password, 10);

    // save user record
    const userId = shortUUID.generate();
    await db("users").insert({
      id: userId,
      email,
      password_hash: hashPwd,
      username,
      transaction_pin: 0,
    });

    // create wallet
    await db("wallet").insert({
      id: shortUUID.generate(),
      user_id: userId,
      currency: "NGN",
    });

    return this.success(
      res,
      RESPONSE_CODE.SIGNUP_SUCCESSFULL,
      "signup successful",
      201
    );
  }

  async login(req: Request, res: Response) {
    const payload = req.body;
    const validate = LoginSchema.safeParse(payload);
    if (!validate.success) {
      return this.error(
        res,
        RESPONSE_CODE.INVALID_FIELDS,
        "One or more of the input is invalid.",
        400
      );
    }
    const { email, password } = validate.data;

    // check if user exists
    const users = await db("users").where("email", email);
    const user = users[0];
    if (!user) {
      return this.error(
        res,
        RESPONSE_CODE.USER_NOT_FOUND,
        "account notfound",
        404
      );
    }

    // check password match
    const pwdHash = user.password_hash;
    const userId = user.id;

    // compare password
    if (!bcrypt.compareSync(password, pwdHash)) {
      return this.error(
        res,
        RESPONSE_CODE.INVALID_LOGIN_CREDENTIALS,
        "Invalid login credentials",
        400
      );
    }

    // generate access and refresh token token
    const jwt = new JWT();
    const refreshToken = await jwt.refreshToken(userId);
    const accessToken = await jwt.refreshToken(userId);

    await db("users")
      .update({
        refresh_token: refreshToken,
      })
      .where("email", email);

    this.success(
      res,
      RESPONSE_CODE.LOGIN_SUCCESSFULL,
      "user logged in successfully",
      201,
      {
        accessToken,
        userId,
      }
    );
  }
}
