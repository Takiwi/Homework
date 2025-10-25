const { readFileSync } = require("fs");
const path = require("path");

const keyDir = path.resolve("../keys");

const PRIVATE_KEY = readFileSync(`${keyDir}/private.pem`, "utf-8");
const PUBLIC_KEY = readFileSync(`${keyDir}/public.pem`, "utf-8");

module.exports = {
  PRIVATE_KEY,
  PUBLIC_KEY,
};
