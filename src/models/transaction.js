const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    date: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "",
    },

    sender: {
      type: String,
      default: "Unknown",
      trim: true,
    },

    receiver: {
      type: String,
      default: "Unknown",
      trim: true,
    },

    category: {
      type: String,
      enum: ["food", "travel", "shopping", "bills", "other"],
      default: "other",
    },

    type: {
      type: String,
      enum: ["slip", "receipt", "invoice", "other"],
      default: "other",
    },

    // 🔥 เก็บ path รูป (optional แต่โคตรดี)
    imagePath: {
      type: String,
    },
  },
  {
    timestamps: true, // 👈 แทน createdAt / updatedAt อัตโนมัติ
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);