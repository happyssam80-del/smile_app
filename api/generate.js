import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    // 1. HTTP 메서드 검증
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    
    // 2. 환경 변수 검증 (Vercel 설정 확인용)
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY가 환경변수에 설정되지 않았습니다.");
    }

    // 3. Gemini API 초기화 및 모델 설정
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // 4. 프롬프트 구성 및 데이터 요청
    const { prompt } = req.body;
    const finalPrompt = `사용자가 "${prompt}"라고 말했습니다. 이 기분을 풀어줄 수 있는 재미있는 상황이나 캐릭터를 생성하기 위한 짧은 프롬프트 1개와, 3줄 내외의 힘이 나는 격려 문구를 JSON 형식 {"imagePrompt": "...", "message": "..."} 으로만 반환해주세요. 다른 설명은 제외하세요.`;

    const result = await model.generateContent(finalPrompt);
    
    // 5. JSON 파싱 및 응답
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);
    
    res.status(200).json(data);

  } catch (error) {
    // Vercel Function Logs에 기록될 상세 에러
    console.error("서버 내부 오류 상세:", error); 
    res.status(500).json({ error: error.message });
  }
}
