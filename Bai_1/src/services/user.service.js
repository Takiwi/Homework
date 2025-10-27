const userModel = require("../models/user.model");

class UserService {
  static findUserByEmail = async (email) => {
    return await userModel.findOne({ email: email }).lean();
  };
}

module.exports = UserService;
