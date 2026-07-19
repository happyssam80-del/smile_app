// api/generate.js 수정 제안
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end();
    
    // 환경 변수 확인 로직 추가
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
    }

    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // ... 기존 로직 ...
    
  } catch (error) {
    console.error("상세 에러 로그:", error); // Vercel 로그에서 확인 가능
    res.status(500).json({ error: error.message });
  }
}
