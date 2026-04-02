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

    console.log("FILE:", file); // 🔥 debug

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ เรียก AI
    const data = await extractSlipData(file.path);

    console.log("AI DATA:", data); // 🔥 debug

    // ✅ save DB (ใช้ค่าจาก AI แล้ว)
    const transaction = new Transaction({
      amount: data.amount,
      date: data.date,
      time: data.time,
      sender: data.sender,
      receiver: data.receiver,
      category: data.category, // 🔥 FIX ตรงนี้
      type: data.type,         // 🔥 เพิ่มใหม่
      imagePath: file.path,    // 🔥 เก็บ path รูป
    });

    await transaction.save();

    res.json({
      message: "Saved to database",
      transaction,
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      error: err.message || "Server error",
    });
  }
});

// GET /api/slip
router.get("/", async (req, res) => {
  try {
    const data = await Transaction.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);

    res.status(500).json({
      error: err.message || "Server error",
    });
  }
});

module.exports = router;