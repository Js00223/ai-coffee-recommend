import axios from "axios";

// 1. 응답 데이터의 구조를 명확히 정의합니다.
interface CoffeeRecommendation {
  coffee: {
    name: string;
    desc: string;
  };
  dessert: {
    name: string;
    desc: string;
  };
}

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// 2. 반환 타입을 Promise<CoffeeRecommendation | null>로 지정합니다.
export const getCoffeeRecommendation = async (
  userPreferences: string
): Promise<CoffeeRecommendation | null> => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `당신은 세계적인 바리스타입니다. 
    반드시 다음 JSON 구조를 엄격히 지켜서 한국어로 답변하세요. 
    다른 설명이나 인사말은 절대 포함하지 마세요. 
    
    JSON 구조:
    {
      "coffee": { "name": "이름", "desc": "설명" },
      "dessert": { "name": "이름", "desc": "설명" }
    }`,
          },
          {
            role: "user",
            content: `취향: ${userPreferences}`,
          },
        ],
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content) as CoffeeRecommendation; // 3. 타입을 단언(Assertion)해줍니다.
  } catch (error: unknown) {
    // 4. error는 기본적으로 unknown 타입입니다.
    if (axios.isAxiosError(error)) {
      console.error("API 에러:", error.response?.data || error.message);
    } else {
      console.error("알 수 없는 에러:", error);
    }
    return null;
  }
};
