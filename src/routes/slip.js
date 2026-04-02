const express = require("express");
const router = express.Router();
const multer = require("multer");
const Transaction = require("../models/transaction");
const { extractSlipData } = require("../services/aiService");

// ตั้งค่าที่เก็บไฟล์
const upload = multer({ dest: "uploads/" });

// POST /api/slip/upload
router.post("/upload", upload.single("slip"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ ได้ object ตรง ๆ แล้ว
    const data = await extractSlipData(file.path);

    const transaction = new Transaction({
      amount: data.amount,
      date: data.date,
      time: data.time,
      sender: data.sender,
      receiver: data.receiver,
      category: "unknown",
    });

    await transaction.save();

    res.json({
      message: "Saved to database",
      transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// GET /api/slip
router.get("/", async (req, res) => {
  try {
    const data = await Transaction.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;