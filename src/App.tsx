import { useState } from "react";
import RecommendationForm from "./components/RecommendationForm";
import ResultCard from "./components/ResultCard";
import { getCoffeeRecommendation } from "./api/recommendation";
import { Sparkles } from "lucide-react";
// PWA 자동 업데이트를 위한 훅 임포트
import { useRegisterSW } from "virtual:pwa-register/react";

// 결과 데이터의 타입을 정의합니다.
interface RecommendationResult {
  coffee: { name: string; desc: string };
  dessert: { name: string; desc: string };
}

function App() {
  // PWA 서비스 워커 등록 및 자동 업데이트 설정
  useRegisterSW({
    onRegistered() {
      console.log("PWA Service Worker Registered");
    },
    onRegisterError(error) {
      console.error("PWA Registration Error", error);
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  // 폼 제출 시 호출될 함수
  const handleRecommend = async (preferences: string) => {
    setLoading(true);
    try {
      const data = await getCoffeeRecommendation(preferences);

      if (data) {
        setResult(data);
      } else {
        alert("추천을 가져오는데 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("추천 처리 중 에러 발생:", error.message);
      } else {
        console.error("알 수 없는 에러 발생:", error);
      }
      alert("서비스 연결에 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 다시 시도하기 버튼 (결과 초기화)
  const handleReset = () => {
    setResult(null);
  };

  return (
    /** * [모바일 최적화]
     * min-h-[100dvh]: 모바일 브라우저 주소창 높이를 제외한 실제 꽉 찬 화면
     * py-6 md:py-12: 모바일에서는 여백을 줄임
     */
    <div className="min-h-[100dvh] bg-[#FDFBF7] py-6 md:py-12 px-4 font-sans text-gray-900">
      {/* 상단 헤더 구역 */}
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
        <p className="text-sm md:text-lg text-stone-500 leading-relaxed px-2">
          당신의 기분과 취향을 분석하여 최적의 음료와{" "}
          <br className="hidden md:block" />
          디저트 페어링을 제안해 드립니다.
        </p>
      </header>

      {/* 메인 콘텐츠 구역 */}
      <main className="max-w-4xl mx-auto relative">
        {!result ? (
          <div className="transition-all duration-500 ease-in-out">
            <RecommendationForm
              onSubmit={handleRecommend}
              isLoading={loading}
            />
          </div>
        ) : (
          <div className="transition-all duration-500 ease-in-out">
            <ResultCard data={result} />

            {/* 다시 하기 버튼: 모바일 터치 편의성을 위해 버튼 영역 확보 */}
            <div className="mt-8 text-center pb-10">
              <button
                onClick={handleReset}
                className="text-sm md:text-base text-stone-400 hover:text-amber-700 underline underline-offset-4 transition-colors active:opacity-60"
              >
                취향 다시 선택하기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="mt-10 md:mt-20 pb-6 text-center text-stone-400 text-[10px] md:text-sm">
        <p>© 2026 AI Coffee Butler. Powered by Groq</p>
      </footer>
    </div>
  );
}

export default App;
