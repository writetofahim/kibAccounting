const mongoose = require("mongoose");

const accountTypeSchema = new mongoose.Schema(
  {
    typeName: { type: String, required: true },
    description: { type: String },
    // Add other relevant fields here
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountType", accountTypeSchema);
