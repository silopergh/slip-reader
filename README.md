# 🤖 Slip Reader via AI - Backend

Backend service สำหรับระบบวิเคราะห์สลิปโอนเงินด้วย AI
รองรับการอัปโหลดรูปภาพ → ประมวลผลด้วย AI → บันทึกข้อมูลลงฐานข้อมูล → ส่ง API ให้ frontend

---

## 🚀 Features

* 📤 Upload slip image (multer)
* 🤖 AI extract transaction data (OpenAI Vision)
* 🧠 Clean & normalize data (amount, date, etc.)
* 💾 Store data in MongoDB
* 📊 REST API สำหรับ dashboard
* ⚡ รองรับ real-time usage (upload → save → fetch)

---

## 🧱 Tech Stack

* Node.js + Express
* MongoDB + Mongoose
* OpenAI API (Vision)
* Multer (file upload)
* dotenv (env management)

---

## 📂 Project Structure

```
backend/
 ├── src/
 │    ├── routes/        # API routes
 │    ├── services/      # AI logic
 │    ├── models/        # MongoDB schema
 │    ├── config/        # database connection
 │    └── app.js         # main server
 ├── uploads/            # uploaded images
 ├── .env
 └── package.json
```

---

## ⚙️ Installation

```bash
git clone <your-backend-repo>
cd backend
npm install
```

---

## 🔑 Environment Variables

สร้างไฟล์ `.env`

```env
OPENAI_API_KEY=your_openai_key
MONGO_URI=your_mongodb_uri
PORT=5000
```

---

## ▶️ Run Server

```bash
npm run dev
```

หรือ

```bash
node src/app.js
```

---

## 📡 API Endpoints

### 📤 Upload Slip

```
POST /api/slip/upload
```

**Body:**

* form-data
* key: `slip` (file)

---

### 📥 Get Transactions

```
GET /api/slip
```

---

## 🤖 AI Processing Flow

1. รับไฟล์ภาพจาก user
2. แปลงเป็น base64
3. ส่งไป OpenAI Vision
4. extract:

   * amount
   * date
   * time
   * sender
   * receiver
5. clean data
6. save ลง MongoDB

---

## 📊 Example Response

```json
{
  "amount": 500,
  "date": "2026-04-02",
  "time": "14:32",
  "sender": "สมชาย",
  "receiver": "ร้านค้า"
}
```

---

## 🧪 Development Notes

* ใช้ `multer` สำหรับ upload file
* มีการ clean JSON จาก AI response
* ป้องกัน invalid JSON จาก AI
* normalize amount ให้เป็น number

---

## 🔒 Security Notes

* ไม่ commit `.env`
* ไม่เก็บ API key ใน code
* จำกัด file type (image only)

---

## 🚀 Future Improvements

* 🧠 Auto category ด้วย AI
* 🔍 Detect fake slip
* 📊 Advanced analytics
* 🔐 Authentication (JWT)

---

## 👨‍💻 Author

Developed by [Your Name]

---

## ⭐ Why this project?

โปรเจคนี้แสดงความสามารถในการ:

* ใช้ AI กับระบบจริง
* ออกแบบ API + database
* ทำ full-stack integration
* จัดการ real-world data (messy input)

---
