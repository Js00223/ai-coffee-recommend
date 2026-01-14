import { motion } from "framer-motion";
import { Coffee, Cake, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Recommendation {
  coffee: { name: string; desc: string };
  dessert: { name: string; desc: string };
}

interface Props {
  data: Recommendation | null;
}

const ResultCard = ({ data }: Props) => {
  // ✅ 1. 모든 Hook은 컴포넌트 최상단에 위치해야 합니다. (Early Return보다 먼저!)
  const [coffeeImageUrl] = useState(
    () => `https://coffee.alexflipnote.dev/random?sig=${Math.random()}`
  );

  // ✅ 2. Hook 호출이 끝난 후에 조건부 렌더링(Early Return)을 수행합니다.
  if (!data || !data.coffee || !data.dessert) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 text-center bg-white rounded-3xl shadow-xl border border-red-100">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-800 font-bold text-lg">
          추천 데이터를 읽어오지 못했습니다.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          AI 응답 형식이 올바르지 않습니다.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-stone-800 text-white rounded-xl text-sm"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // ✅ 3. 정상적인 렌더링 로직
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-100"
    >
      <div className="relative w-full aspect-video bg-amber-50">
        <img
          src={coffeeImageUrl}
          alt="Random Coffee"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      </div>

      <div className="bg-amber-900 p-6 text-white text-center relative">
        <Sparkles className="absolute top-4 right-4 text-amber-300 w-5 h-5" />
        <h3 className="text-xl font-bold tracking-tight">
          AI 바리스타의 추천 조합
        </h3>
        <p className="text-amber-200 text-sm mt-1">
          오늘 당신의 기분에 딱 맞는 페어링입니다.
        </p>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Coffee className="text-amber-900 w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              {data.coffee.name}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mt-1">
              {data.coffee.desc}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dashed border-amber-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-amber-500 font-medium">
              + Best Pairing
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
            <Cake className="text-orange-700 w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-800">
              {data.dessert.name}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mt-1">
              {data.dessert.desc}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 text-sm font-semibold text-amber-900 border border-amber-900 rounded-xl hover:bg-amber-50 transition-colors"
        >
          다시 추천받기
        </button>
      </div>
    </motion.div>
  );
};

export default ResultCard;
