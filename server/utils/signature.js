const crypto = require("crypto");
const fs = require("fs");

const privateKey = fs.readFileSync("./private.pem");

function generateSignature(path, bodyString, timestamp) {
  let digest = "";

  if (bodyString) {
    digest = crypto
      .createHash("sha512")
      .update(bodyString, "utf8")
      .digest("hex");
  }

  const text = path + digest + timestamp;

  const sign = crypto.createSign("RSA-SHA512");
  sign.update(text);

  return sign.sign(privateKey, "base64");
}

module.exports = { generateSignature };
