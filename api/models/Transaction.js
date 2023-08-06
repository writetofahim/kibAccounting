const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    debitAccounts: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        amount: { type: Number, required: true },
      },
    ],
    creditAccounts: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        amount: { type: Number, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    isPosted: { type: Boolean, default: false },
    notes: { type: String },
    transactionType: {
      type: String,
      enum: ["Transfer", "Debit", "Credit"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["Cash", "Bank"],
      required: true,
    },
  },
  { timestamps: true }
);

// transactionSchema.set("toObject", { virtuals: true });
// transactionSchema.set("toJSON", { virtuals: true });

// transactionSchema.virtual("transactionId").get(function () {
//   return this._id.toHexString();
// });

module.exports = mongoose.model("Transaction", transactionSchema);
