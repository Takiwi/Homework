const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { getInfoData } = require("../utils/index");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { createTokenPair } = require("../auth/authUtils");

// service
const KeyTokenService = require("../services/keyToken.service");

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    // check email??
    const foundUser = await userModel.findOne({ email }).lean();

    if (!foundUser) throw new BadRequestError("Email not registered!");

    // check password
    const match = bcrypt.compare(password, foundUser.password);

    if (!match) throw new AuthFailureError("Authentication error!");

    // revoked token
    const foundRefreshToken = await KeyTokenService.findRefreshTokenById(
      foundUser._id
    );

    if (!foundRefreshToken) throw new AuthFailureError("Authentication error!");

    // create new refresh token and access token
    const tokens = await createTokenPair({
      userId: foundUser._id,
      email,
    });

    // update and save refresh token
    const newKey = await KeyTokenService.revokedToken(
      foundUser._id,
      foundRefreshToken.refreshToken,
      tokens.refreshToken
    );

    return {
      user: getInfoData({
        fields: ["_id", "username", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static register = async ({ name, email, password }) => {
    // Check email is exist???
    const isEmailExist = await userModel.findOne({ email }).lean();

    if (isEmailExist) {
      throw new BadRequestError("Email is registered!");
    }

    // password hash
    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await userModel.create({
      username: name,
      email: email,
      password: passwordHash,
      role: ["ADMIN"],
    });

    // Check has a new user
    if (newUser) {
      // create access token and refresh token
      const tokens = await createTokenPair({
        userId: newUser._id,
        email,
      });

      // save refresh token
      const newKey = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        refreshToken: tokens.refreshToken,
      });

      return {
        message: "Create user successfully",
        metadata: {
          user: getInfoData({
            fields: ["_id", "username", "email"],
            object: newUser,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
