import axios from "axios";

export interface CoffeeRecommendation {
  coffee: { name: string; desc: string };
  dessert: { name: string; desc: string };
  shop?: {
    name: string;
    menu: string;
    distance: string;
    address: string;
    mapUrl: string;
    lat: number;
    lng: number;
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
            content: `당신은 실시간 지도 기반 카페 가이드입니다. 
    
    [가장 중요한 규칙: 허위 정보 금지]
    1. 반드시 제공된 주소와 좌표 근처에 '실제로 실존하는' 유명 카페만 추천하세요.
    2. 존재하지 않는 장소나 폐업한 곳을 지어낼 경우 서비스가 중단됩니다. 
    3. 확실하지 않다면 해당 지역의 가장 유명한 프랜차이즈(스타벅스, 투썸플레이스, 이디야 등) 지점이라도 정확히 찾아내세요.
    4. 'shop.name'은 반드시 '브랜드명 + 지점명' 형태여야 합니다. (예: '스타벅스 구미옥계점')
    5. 주소는 반드시 도로명 주소 체계에 맞춰서 실제 존재하는 번지수까지 기입하세요.



    [위치 정보]
    - 입력된 주소: ${userPreferences}
    - 이 지역의 랜드마크나 큰 도로를 기준으로 검색 결과가 확실한 곳만 골라주세요.

    
    JSON 구조:
    {
      "coffee": { "name": "...", "desc": "..." },
      "dessert": { "name": "...", "desc": "..." },
      "shop": { 
        "name": "지점명 포함 정확한 매장명", 
        "menu": "대표 메뉴", 
        "distance": "대략적 거리",
        "address": "해당 지역의 실제 도로명 주소",
        "mapUrl": "...",
        "lat": 위도숫자,
        "lng": 경도숫자
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
  } catch {
    // ✅ (error: unknown) 부분을 지우고 catch만 남김
    console.error("추천 데이터 요청 중 오류 발생");
    return null;
  }
};
