const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

class GenerateKey {
  static generateKeyPair() {
    const keyDir = path.resolve(__dirname, "../keys");

    // Check file is exist???
    if (
      !fs.existsSync(`${keyDir}/private.pem`) ||
      !fs.existsSync(`${keyDir}/public.pem`)
    ) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      // save key
      fs.writeFileSync(`${keyDir}/private.pem`, privateKey);
      fs.writeFileSync(`${keyDir}/public.pem`, publicKey);
    }
  }
}

module.exports = GenerateKey;
