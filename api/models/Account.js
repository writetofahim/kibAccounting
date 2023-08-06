const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountName: { type: String, required: true },
    accountTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountType",
      required: true,
    },
    accountSubTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountSubType",
      required: true,
    },
    accountCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountCategory",
      required: true,
    },
    openingBalance: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    description: { type: String },
    // Add other relevant fields here
  },
  { timestamps: true } // Add this option to enable timestamps
);

module.exports = mongoose.model("Account", accountSchema);
