const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    gender: { type: String },
    // Add other relevant fields here
  },
  { timestamps: true } // Add this option to enable timestamps
);

module.exports = mongoose.model("User", userSchema);
