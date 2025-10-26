const keyTokenModel = require("../models/keyToken.model");
const { ObjectId, Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({ userId, refreshToken }) => {
    const filter = { user: userId },
      update = { refreshToken, refreshTokenUsed: [] },
      options = { upsert: true, new: true };

    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );

    return tokens ? tokens : null;
  };

  static revokedToken = async (userId, oldRefreshToken, newRefreshToken) => {
    return await keyTokenModel.updateOne({
      user: userId,
      refreshToken: newRefreshToken,
      $push: {
        refreshTokenUsed: oldRefreshToken,
      },
    });
  };

  static findRefreshTokenById = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static deleteRefreshToken = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
