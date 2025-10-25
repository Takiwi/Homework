const JWT = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const keyDir = path.resolve(__dirname, "../keys");
const privateKey = fs.readFileSync(`${keyDir}/private.pem`, "utf-8");

const createTokenPair = async (payload) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "15m",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

module.exports = { createTokenPair };
