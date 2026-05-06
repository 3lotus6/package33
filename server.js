import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 API 키 체크 (안전장치)
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY 없음 (.env 확인)");
}

// 🔥 OpenAI 설정
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =========================
// 🔥 스타일 정의
// =========================

function getStylePrompt(style) {
  switch (style) {
    case "aircap":
      return `
상대방의 부담을 줄이는 부드러운 말투로 표현해라.
`;

    case "bojagi":
      return `
격식 있고 정중한 비즈니스 존댓말로 표현해라.
`;

    case "hologram":
      return `
밝고 에너지 넘치는 긍정적인 말투로 표현해라.
`;

    case "vacuum":
      return `
문장을 최대한 짧고 간결하게 압축해라.
`;

    case "kraft":
      return `
현실적이고 자연스럽지만 은근한 압박이 느껴지게 표현해라.
`;

    case "gold":
      return `
극도로 화려하고 과장된 말투로 표현해라.
`;

    default:
      return `
자연스럽게 문장을 다듬어라.
`;
  }
}

// =========================
// 🔥 API 처리
// =========================

app.post("/convert", async (req, res) => {
  const { text, style } = req.body;

  console.log("📥 요청:", text, style);

  // 🔥 입력값 체크
  if (!text) {
    return res.status(400).json({ result: "문장을 입력해주세요!" });
  }

  if (!style) {
    return res.status(400).json({ result: "포장지를 선택해주세요!" });
  }

  try {
    const prompt = `
아래 문장을 "${style}" 스타일로 변환해라.

${getStylePrompt(style)}

입력:
${text}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
너는 '언어 포장기'다.

규칙:
- 반드시 지정된 스타일로 변환
- 설명 금지
- 한 문장으로 출력
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
    });

    // 🔥 안전 처리 (핵심)
    const result =
      response.choices?.[0]?.message?.content?.trim() || "변환 실패 😢";

    console.log("📤 결과:", result);

    res.json({ result });
  } catch (error) {
    console.error("❌ 서버 에러:", error.message);

    res.status(500).json({
      result: "서버 에러 발생 😢",
    });
  }
});

// =========================
// 🔥 서버 실행
// =========================

app.listen(3000, () => {
  console.log("🚀 서버 실행됨 👉 http://localhost:3000");
});
