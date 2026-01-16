import { useState } from "react";
import RecommendationForm from "./components/RecommendationForm";
import ResultCard from "./components/ResultCard";
import { getCoffeeRecommendation } from "./api/recommendation";
import { Sparkles } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";

// 1. 결과 데이터 및 위치 데이터 타입 정의
interface RecommendationResult {
  coffee: { name: string; desc: string };
  dessert: { name: string; desc: string };
  shop?: {
    name: string;
    address: string;
    distance: string;
    menu: string;
    mapUrl: string;
    lat: number;
    lng: number;
  };
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

function App() {
  // PWA 서비스 워커 설정
  useRegisterSW({
    onRegistered() {
      console.log("PWA Registered");
    },
    onRegisterError() {
      // ✅ (error) 또는 (_error)를 아예 삭제
      console.error("PWA 등록 중 오류가 발생했습니다.");
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [userCoords, setUserCoords] = useState<LocationCoords | null>(null);

  const coffeeJokes = [
    "☕ 에스프레소처럼 진한 하루 되세요!",
    "🍰 디저트 배는 따로 있다는 게 학계의 정설입니다.",
    "🍯 인생은 쓰지만 커피는 달게 마셔도 괜찮아요.",
    "🧊 얼죽아 회원님이신가요? 환영합니다!",
    "🥐 오늘 탄수화물 수치가 부족해 보여서 불렀어요.",
    "✨ 당신의 오늘을 완벽하게 만들 한 잔을 찾았습니다!",
  ];

  // 좌표를 주소 텍스트로 변환하는 함수 (Reverse Geocoding)
  const getAddressFromCoords = async (
    lat: number,
    lng: number
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ko`
      );
      const data = await response.json();
      return data.display_name || "알 수 없는 지역";
    } catch {
      return "좌표 근처 지역";
    }
  };

  const getCurrentLocation = (): Promise<LocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("위치 정보를 지원하지 않는 브라우저입니다."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  const handleRecommend = async (preferences: string, useLocation: boolean) => {
    setLoading(true);
    let finalPreferences = preferences;

    try {
      if (useLocation) {
        try {
          const coords = await getCurrentLocation();
          setUserCoords(coords);
          const addressName = await getAddressFromCoords(
            coords.latitude,
            coords.longitude
          );

          finalPreferences = `
            [사용자의 실시간 위치 정보]
            - 주소: ${addressName}
            - 좌표: 위도 ${coords.latitude}, 경도 ${coords.longitude}

            위 정보는 사용자의 '현재 실제 위치'야. 
            주소에 적힌 지역을 바탕으로 그 주변 1km 이내의 실존하는 카페를 추천해줘. 
            사용자 취향: ${preferences}`;
        } catch {
          // ✅ (locError) 제거 (사용하지 않으므로)
          alert("위치 권한을 허용해주셔야 근처 카페 추천이 가능합니다.");
        }
      } else {
        setUserCoords(null);
      }

      const data = await getCoffeeRecommendation(finalPreferences);
      if (data) setResult(data);
    } catch {
      alert("서비스 연결에 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 돌아가기 버튼 클릭 시 호출될 로직
  const handleReset = () => {
    const randomJoke =
      coffeeJokes[Math.floor(Math.random() * coffeeJokes.length)];
    alert(randomJoke); // 랜덤 이스터에그 메시지
    setResult(null); // 결과 초기화 -> 폼으로 이동
    setUserCoords(null);
  };

  return (
    <div className="min-h-[100dvh] bg-[#FDFBF7] py-6 md:py-12 px-4 font-sans text-gray-900">
      <header className="max-w-2xl mx-auto text-center mb-10 md:mb-16">
        <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-4">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-700 mr-2" />
          <span className="text-[10px] md:text-sm font-bold text-amber-800 uppercase tracking-widest">
            AI Personal Barista
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-stone-800 mb-4 tracking-tight">
          오늘의 완벽한 <span className="text-amber-700">한 잔</span>
        </h1>
      </header>

      <main className="max-w-4xl mx-auto relative">
        {!result ? (
          <RecommendationForm onSubmit={handleRecommend} isLoading={loading} />
        ) : (
          <div className="transition-all duration-500">
            {/* ✅ onReset 프롭으로 handleReset 함수를 전달합니다. */}
            <ResultCard
              data={result}
              userCoords={userCoords}
              onReset={handleReset}
            />

            {/* 하단에 별도로 있던 다시하기 버튼은 ResultCard 내부로 이동했으므로 필요 시 삭제 가능합니다. */}
          </div>
        )}
      </main>

      <footer className="mt-10 md:mt-20 pb-6 text-center text-stone-400 text-[10px] md:text-sm">
        <p>© 2026 AI Coffee Butler. Powered by Groq</p>
      </footer>
    </div>
  );
}

export default App;
