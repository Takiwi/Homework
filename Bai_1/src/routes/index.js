const express = require("express");
const router = express.Router();

// Check api key
// router.use(apiKey);

// Check permission
// router.use(permission());

router.use("/v1/api", require("./access/access.router"));

module.exports = router;
