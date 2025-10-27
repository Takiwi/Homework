const { SuccessfulResponse, CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessfulResponse({
      message: "Get tokens success!",
      metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessfulResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.payload),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessfulResponse({
      message: "Login success!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  register = async (req, res, next) => {
    new CREATED({
      message: "Register success!",
      metadata: await AccessService.register(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
