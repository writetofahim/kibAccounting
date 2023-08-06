const mongoose = require("mongoose");

const accountCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },
});

module.exports = mongoose.model("AccountCategory", accountCategorySchema);
