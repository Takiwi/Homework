const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

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

  static revokedToken = async (
    userId,
    oldRefreshToken,
    newRefreshToken = null
  ) => {
    const updateData = {
      refreshTokenUsed: oldRefreshToken,
    };

    if (newRefreshToken) {
      updateData.$push = { refreshTokenUsed: oldRefreshToken };
    }
    return await keyTokenModel.updateOne({
      user: userId,
      refreshToken: newRefreshToken,
      updateData,
    });
  };

  static findRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findRefreshTokenById = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static findRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken: refreshToken }).lean();
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
