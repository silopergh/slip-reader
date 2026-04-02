const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: Number,
  date: String,
  time: String,
  sender: String,
  receiver: String,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);