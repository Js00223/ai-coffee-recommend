import React, { useState } from "react";

interface FormProps {
  onSubmit: (preferences: string) => void;
  isLoading: boolean;
}

const RecommendationForm: React.FC<FormProps> = ({ onSubmit, isLoading }) => {
  const [mood, setMood] = useState("");
  const [taste, setTaste] = useState("");
  const [caffeine, setCaffeine] = useState("카페인 상관없음");

  // 이스터에그: 계좌번호 복사 및 안내
  const handleEasterEgg = () => {
    const account = " 카카오 뱅크 3333-19-9763247 (허준서)"; // 본인 계좌로 변경하세요
    navigator.clipboard.writeText(account).then(() => {
      alert(
        "☕ 개발자에게 따뜻한 커피 한 잔을 선물해주셔서 감사합니다!\n계좌번호가 복사되었습니다: " +
          account
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preferenceString = `현재 기분: ${mood}, 선호하는 맛: ${taste}, 카페인 여부: ${caffeine}`;
    onSubmit(preferenceString);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6 border border-amber-100"
    >
      <h2 className="text-2xl font-bold text-stone-800 text-center">
        {/* cursor-default: 마우스를 올려도 손가락 모양으로 변하지 않음
          select-none: 드래그 선택 방지
          active:scale-100: 클릭 시 눌리는 시각적 효과도 차단하여 완벽히 숨김
        */}
        <span
          onClick={handleEasterEgg}
          className="cursor-default select-none inline-block mr-1 transition-none"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          ☕
        </span>
        오늘의 음료 찾기
      </h2>

      {/* 기분 입력 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          지금 기분이 어떠신가요?
        </label>
        <input
          type="text"
          placeholder="예: 피곤해요, 상쾌해요, 우울해요"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          required
        />
      </div>

      {/* 맛 선호도 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          어떤 맛을 원하시나요?
        </label>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          value={taste}
          onChange={(e) => setTaste(e.target.value)}
          required
        >
          <option value="">맛을 선택해주세요</option>
          <option value="달콤한 맛">달콤한 맛 🍯</option>
          <option value="쌉싸름한 맛">쌉싸름한 맛 ☕</option>
          <option value="상큼한 맛">상큼한 맛 🍋</option>
          <option value="고소한 맛">고소한 맛 🥜</option>
        </select>
      </div>

      {/* 카페인 여부 */}
      <div className="flex gap-4">
        {["카페인 상관없음", "디카페인"].map((option) => (
          <label
            key={option}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="radio"
              name="caffeine"
              value={option}
              checked={caffeine === option}
              onChange={(e) => setCaffeine(e.target.value)}
              className="accent-amber-900"
            />
            <span className="text-sm text-gray-600">{option}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-bold border-2 transition-all active:scale-[0.98] ${
          isLoading
            ? "border-gray-200 text-gray-400"
            : "border-amber-900 text-amber-900 hover:bg-amber-50"
        }`}
      >
        {isLoading ? "AI가 메뉴를 고르는 중..." : "추천 받기"}
      </button>
    </form>
  );
};

export default RecommendationForm;
