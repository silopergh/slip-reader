const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractSlipData(imagePath) {
  try {
    const imageBase64 = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are an AI that extracts expense data from ANY document:
(bank slip, receipt, invoice, bill).

Rules:
- Return ONLY raw JSON (no markdown, no explanation)
- Do NOT include \`\`\`
- Always return all fields

Fields:
{
  "amount": number,
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "sender": "string",
  "receiver": "string",
  "category": "food | travel | shopping | bills | other",
  "type": "slip | receipt | invoice | other"
}
`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract expense data from this document.",
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

    console.log("AI RAW:", result);

    // 🔥 clean markdown
    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let data;

    try {
      data = JSON.parse(result);
    } catch (err) {
      console.error("PARSE ERROR:", result);
      throw new Error("AI returned invalid JSON");
    }

    // 🔥 normalize amount
    const cleanAmount =
      Number(String(data.amount).replace(/[^0-9.]/g, "")) || 0;

    // 🔥 VALID CATEGORY (กัน AI มั่ว)
    const validCategories = [
      "food",
      "travel",
      "shopping",
      "bills",
      "other",
    ];

    let category = data.category;

    if (!validCategories.includes(category)) {
      console.warn("INVALID CATEGORY FROM AI:", category);
      category = "other";
    }

    // 🔥 VALID TYPE
    const validTypes = ["slip", "receipt", "invoice", "other"];

    let type = data.type;

    if (!validTypes.includes(type)) {
      console.warn("INVALID TYPE FROM AI:", type);
      type = "other";
    }

    return {
      amount: cleanAmount,
      date: data.date || "",
      time: data.time || "",
      sender: data.sender || "Unknown",
      receiver: data.receiver || "Unknown",
      category,
      type,
    };
  } catch (error) {
    console.error("AI SERVICE ERROR:", error.message);
    throw error;
  }
}

module.exports = { extractSlipData };