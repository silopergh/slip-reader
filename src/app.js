const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

// 👇 import route
const slipRoutes = require("./routes/slip");

// 👇 ใช้งาน route
app.use("/api/slip", slipRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

connectDB();