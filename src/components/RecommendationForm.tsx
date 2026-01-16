import React, { useState } from "react";
import { MapPin } from "lucide-react";

interface FormProps {
  onSubmit: (preferences: string, useLocation: boolean) => void;
  isLoading: boolean;
}

const RecommendationForm: React.FC<FormProps> = ({ onSubmit, isLoading }) => {
  const [mood, setMood] = useState("");
  const [taste, setTaste] = useState("");
  const [drinkType, setDrinkType] = useState("모든 음료"); // 커피/논커피 선택
  const [useLocation, setUseLocation] = useState(false);

  const handleEasterEgg = () => {
    const account = "카카오뱅크 3333-19-9763247 (허준서)";
    navigator.clipboard.writeText(account).then(() => {
      alert(
        "☕ 개발자에게 따뜻한 커피 한 잔을 선물해주셔서 감사합니다!\n계좌번호가 복사되었습니다: " +
          account
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preferenceString = `현재 기분: ${mood}, 선호하는 맛: ${taste}, 음료 타입: ${drinkType}`;
    onSubmit(preferenceString, useLocation);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-[2.5rem] shadow-xl space-y-6 border border-amber-100"
    >
      <h2 className="text-2xl font-bold text-stone-800 text-center">
        <span
          onClick={handleEasterEgg}
          className="cursor-default select-none inline-block mr-1"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          ☕
        </span>
        오늘의 음료 찾기
      </h2>

      {/* 기분 & 맛 입력은 유지 */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="지금 기분이 어떠신가요?"
          className="w-full p-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-200 outline-none text-sm"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          required
        />

        <select
          className="w-full p-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-200 outline-none text-sm appearance-none"
          value={taste}
          onChange={(e) => setTaste(e.target.value)}
          required
        >
          <option value="">원하는 맛을 선택하세요</option>
          <option value="달콤한 맛">달콤한 맛 🍯</option>
          <option value="쌉싸름한 맛">쌉싸름한 맛 ☕</option>
          <option value="상큼한 맛">상큼한 맛 🍋</option>
          <option value="고소한 맛">고소한 맛 🥜</option>
        </select>
      </div>

      {/* 피드백 반영 1: 음료 옵션 확장 */}
      <div className="grid grid-cols-2 gap-2">
        {["모든 음료", "커피 제외", "디카페인"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setDrinkType(type)}
            className={`py-3 rounded-xl text-xs font-medium transition-all ${
              drinkType === type
                ? "bg-amber-900 text-white"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 피드백 반영 2: 위치 기반 옵션 */}
      <div
        onClick={() => setUseLocation(!useLocation)}
        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
          useLocation
            ? "bg-amber-50 border border-amber-200"
            : "bg-stone-50 border border-transparent"
        }`}
      >
        <div className="flex items-center gap-3">
          <MapPin
            className={`w-5 h-5 ${
              useLocation ? "text-amber-700" : "text-stone-400"
            }`}
          />
          <span className="text-sm font-medium text-stone-700">
            내 주변 카페 추천받기
          </span>
        </div>
        <div
          className={`w-10 h-6 rounded-full relative transition-all ${
            useLocation ? "bg-amber-600" : "bg-stone-300"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              useLocation ? "left-5" : "left-1"
            }`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-2xl font-bold border-2 transition-all active:scale-[0.98] ${
          isLoading
            ? "border-gray-200 text-gray-400"
            : "border-amber-900 text-amber-900 hover:bg-amber-50"
        }`}
      >
        {isLoading ? "AI 바리스타가 분석 중..." : "맞춤 추천 받기"}
      </button>
    </form>
  );
};

export default RecommendationForm;
