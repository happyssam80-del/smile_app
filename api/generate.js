import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { prompt } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // JSON 응답을 강제하기 위한 프롬프트 수정
  const finalPrompt = `사용자가 "${prompt}"라고 말했습니다. 이 기분을 풀어줄 수 있는 재미있는 상황이나 캐릭터를 생성하기 위한 짧은 프롬프트 1개와, 3줄 내외의 힘이 나는 격려 문구를 JSON 형식 {"imagePrompt": "...", "message": "..."} 으로만 반환해주세요. 다른 설명은 제외하세요.`;

  try {
    const result = await model.generateContent(finalPrompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "API 호출 실패" });
  }
}
