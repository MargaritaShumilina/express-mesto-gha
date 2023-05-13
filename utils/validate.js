const validator = require("validator");

function validateUrl(value) {
  if (!validator.isUrl(value, { require_protocol: true })) {
    throw new Error("is not a link");
  }
  return value;
}

module.exports = validateUrl;
