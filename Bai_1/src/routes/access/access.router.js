const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const TokenMiddleware = require("../../middlewares/verifyToken.middleware");

// register
router.post("/register", accessController.register);

// login
router.post("/login", accessController.login);

// check JWT
router.use(TokenMiddleware.verifyAccessToken);

// logout
router.post("/logout", accessController.logout);

// refresh token
router.post("/handlerRefreshToken", accessController.handlerRefreshToken);

module.exports = router;
