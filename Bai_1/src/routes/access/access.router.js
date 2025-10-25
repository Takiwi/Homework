const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const TokenMiddleware = require("../../middlewares/verifyToken.middleware");

// register
router.post("/register", accessController.register);

// check JWT
router.use(TokenMiddleware.verifyAccessToken);

// login
router.post("/login", accessController.login);

module.exports = router;
