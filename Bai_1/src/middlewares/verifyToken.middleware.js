const JWT = require("jsonwebtoken");
const { BadRequestError } = require("../core/error.response");
const fs = require("fs");
const path = require("path");

const HEADER = {
  AUTHORIZATION: "authorization",
};

// read public key
const keyDir = path.resolve(__dirname, ".././keys");
const publicKey = fs.readFileSync(`${keyDir}/public.pem`, "utf-8");

class TokenMiddleware {
  static verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers[HEADER.AUTHORIZATION];

    if (!authHeader) throw new BadRequestError("No token provided!");

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken)
      throw new BadRequestError("Malformed Authorization header");

    try {
      const payload = JWT.verify(accessToken, publicKey, {
        algorithms: ["RS256"],
      });

      req.payload = payload;
      next();
    } catch (error) {
      next(new BadRequestError("Invalid or expired token"));
    }
  };
}

module.exports = TokenMiddleware;
