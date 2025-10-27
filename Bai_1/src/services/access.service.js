const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { getInfoData } = require("../utils/index");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { createTokenPair } = require("../auth/authUtils");
const { verifyToken } = require("../auth/authUtils");

// service
const KeyTokenService = require("../services/keyToken.service");
const UserService = require("../services/user.service");

class AccessService {
  // handler refresh token
  static handlerRefreshToken = async (refreshToken) => {
    // Check refresh token is used???
    const foundToken = await KeyTokenService.findRefreshTokenUsed(refreshToken);

    // If the 'refresh token' is used again, then delete 'refresh token' in database and re-login
    if (foundToken) {
      await KeyTokenService.deleteKeyById(foundToken._id);
      throw new ForbiddenError("Something wrong happened!! please re-login");
    }

    // check refresh token
    const holderToken = await KeyTokenService.findRefreshToken(refreshToken);

    if (!holderToken) throw new AuthFailureError("User not registered! 1");

    // verify token
    const { userId, email } = await verifyToken(refreshToken);

    // check user
    const foundUser = await UserService.findUserByEmail(email);
    if (!foundUser) throw new AuthFailureError("User not registered! 2");

    // create new tokens
    const tokens = await createTokenPair({
      userId: foundUser._id,
      email,
    });

    // update tokens
    await KeyTokenService.revokedToken(
      foundUser._id,
      holderToken.refreshToken,
      tokens.refreshToken
    );

    return {
      user: { userId, email },
      tokens,
    };
  };

  // logout
  static logout = async (payload) => {
    // take refresh token
    const foundRefreshToken = await KeyTokenService.findRefreshTokenById(
      payload.userId
    );

    // update and save refresh token
    await KeyTokenService.revokedToken(
      payload.userId,
      foundRefreshToken.refreshToken
    );
  };

  // login
  static login = async ({ email, password }) => {
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

  // register
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
