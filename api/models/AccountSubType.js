const mongoose = require("mongoose");

const accountSubTypeSchema = new mongoose.Schema(
  {
    subTypeName: { type: String, required: true },
    accountTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountType",
      required: true,
    },
    description: { type: String },
    // Add other relevant fields here
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountSubType", accountSubTypeSchema);
