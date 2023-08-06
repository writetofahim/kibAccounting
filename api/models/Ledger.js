const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    balance: { type: Number, default: 0 },
    lastUpdated: { type: Date },
    // Add other relevant fields here
  },
  { timestamps: true } // Add this option to enable timestamps
);

module.exports = mongoose.model("Ledger", ledgerSchema);
