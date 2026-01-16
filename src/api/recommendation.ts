import axios from "axios";

// 1. 응답 데이터 구조 정의
interface CoffeeRecommendation {
  coffee: {
    name: string;
    desc: string;
  };
  dessert: {
    name: string;
    desc: string;
  };
  // 위치 기반 추천 매장 정보
  shop?: {
    name: string;
    menu: string;
    distance: string;
    address: string;
    mapUrl: string;
  };
}

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

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
            content: `당신은 세계적인 바리스타이자 지역 카페 가이드입니다. 
    반드시 다음 JSON 구조를 엄격히 지켜서 한국어로 답변하세요. 
    다른 설명이나 인사말은 절대 포함하지 마세요. 
    
    [중요 지침]
    1. 사용자가 좌표(위도, 경도) 정보를 제공하면, 해당 위치 주변의 '실제 존재하는 유명 카페' 한 곳을 선정하세요.
    2. 'shop.name' 필드에는 반드시 사진 검색 및 지도 찾기가 가능하도록 '지점명'이 포함된 정확한 상호명을 작성하세요. (예: '스타벅스' X -> '스타벅스 강남대로점' O)
    3. 추천하는 매장은 가급적 인테리어가 훌륭하거나 분위기가 독특하여 사진 검색 시 시각적 효과가 좋은 곳이어야 합니다.
    4. 'shop' 필드에는 카페 이름, 해당 카페의 시그니처 메뉴, 예상 거리, 대략적인 주소를 포함하세요.
    5. 'mapUrl'에는 카카오맵(https://map.kakao.com)에서 해당 매장을 바로 검색할 수 있는 링크를 생성하여 넣으세요.
    
    JSON 구조:
    {
      "coffee": { "name": "추천 음료 이름", "desc": "추천 이유" },
      "dessert": { "name": "추천 디저트 이름", "desc": "페어링 설명" },
      "shop": { 
        "name": "정확한 매장명 (지점명 포함)", 
        "menu": "추천 메뉴", 
        "distance": "현재 위치에서의 거리 (예: 300m)",
        "address": "매장 실제 주소",
        "mapUrl": "카카오맵 검색 링크" 
      }
    }`,
          },
          {
            role: "user",
            content: `취향 및 위치 정보: ${userPreferences}`,
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
    return JSON.parse(content) as CoffeeRecommendation;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API 에러:", error.response?.data || error.message);
    } else {
      console.error("알 수 없는 에러:", error);
    }
    return null;
  }
};
