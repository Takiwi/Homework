const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";

const keyTokenModel = new Schema(
  {
    user: {
      type: Schema.ObjectId,
      required: true,
      ref: "user",
    },
    refreshToken: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
    },
  },
  {
    timeseries: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenModel);
