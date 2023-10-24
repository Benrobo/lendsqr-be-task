import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default class JWT {
  private _secret = process.env.JWT_SECRET;

  async accessToken(data: any) {
    const token = await jwt.sign(data, this._secret, { expiresIn: "1h" });
    return token;
  }

  async refreshToken(data: any) {
    const token = await jwt.sign(data, this._secret, { expiresIn: "365d" });
    return token;
  }

  async verifyToken(token: any) {
    const decoded = await jwt.verify(token, this._secret);
    return decoded;
  }
}
