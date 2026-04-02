const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractSlipData(imagePath) {
  try {
    // อ่านรูปเป็น base64
    const imageBase64 = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0, // ลดความมั่ว
      messages: [
        {
          role: "system",
          content: `
You are a system that extracts structured data from Thai bank slips.

Rules:
- Return ONLY raw JSON (no markdown, no explanation)
- Do NOT include \`\`\`json or \`\`\`
- All fields must exist

Format:
{
  "amount": number,
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "sender": "string",
  "receiver": "string"
}
`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract data from this Thai bank slip.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
    });

    let result = response.choices[0].message.content;

    console.log("AI RAW:", result); // debug

    // 🔥 clean markdown เผื่อ AI ยังแอบใส่มา
    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🔥 parse JSON
    let data;
    try {
      data = JSON.parse(result);
    } catch (err) {
      throw new Error("AI returned invalid JSON");
    }

    // 🔥 normalize data (สำคัญมาก)
    return {
      amount: Number(
        String(data.amount).replace(/[^0-9.]/g, "")
      ) || 0,
      date: data.date || "",
      time: data.time || "",
      sender: data.sender || "Unknown",
      receiver: data.receiver || "Unknown",
    };
  } catch (error) {
    console.error("AI SERVICE ERROR:", error.message);
    throw error;
  }
}

module.exports = { extractSlipData };