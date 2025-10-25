const keyTokenModel = require("../models/keyToken.model");

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
}

module.exports = KeyTokenService;
