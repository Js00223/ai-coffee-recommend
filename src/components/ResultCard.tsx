import { motion } from "framer-motion";
import {
  Coffee,
  Cake,
  Sparkles,
  AlertCircle,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useMemo } from "react"; // useEffect 대신 useMemo 사용

interface Recommendation {
  coffee: { name: string; desc: string };
  dessert: { name: string; desc: string };
  shop?: {
    name: string;
    address: string;
    distance: string;
    menu: string;
    mapUrl: string;
  };
}

const ResultCard = ({ data }: { data: Recommendation | null }) => {
  // ✅ useEffect와 useState 대신 useMemo를 사용하여 렌더링 중에 URL을 결정합니다.
  // 이 방식은 cascading render 에러를 원천 봉쇄합니다.
  const dynamicImageUrl = useMemo(() => {
    if (!data) return "";

    if (data.shop?.name) {
      const query = encodeURIComponent(`${data.shop.name} cafe interior`);
      return `https://source.unsplash.com/featured/?cafe,interior,${query}`;
    }

    // 매장 정보가 없을 경우 랜덤 커피 이미지
    const seed = data.coffee.name.length + data.dessert.name.length;
    return `https://coffee.alexflipnote.dev/random?sig=${seed}`;
  }, [data]);

  if (!data) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 text-center bg-white rounded-3xl shadow-xl border border-red-100">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-800 font-bold text-lg">
          데이터를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const handleOrder = (platform: "baemin" | "coupang" | "yogiyo") => {
    const menuName = data.shop?.menu || data.coffee.name;
    const encodedMenu = encodeURIComponent(menuName);

    const urls = {
      baemin: `baemin://search?query=${encodedMenu}`,
      coupang: `coupangeats://search?q=${encodedMenu}`,
      yogiyo: `yogiyo://search?keyword=${encodedMenu}`,
    };

    const startApp = (url: string, fallback: string) => {
      const start = Date.now();
      window.location.href = url;
      setTimeout(() => {
        if (Date.now() - start < 1500) {
          window.open(fallback, "_blank");
        }
      }, 1000);
    };

    if (platform === "baemin") startApp(urls.baemin, `https://www.baemin.com/`);
    if (platform === "coupang")
      startApp(urls.coupang, `https://www.coupangeats.com/`);
    if (platform === "yogiyo")
      startApp(urls.yogiyo, `https://www.yogiyo.co.kr/`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-6 overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-amber-50"
    >
      <div className="relative w-full aspect-video bg-stone-200">
        <img
          src={dynamicImageUrl}
          className="w-full h-full object-cover transition-opacity duration-500"
          alt={data.shop?.name || "Recommended Cafe"}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1554118811-1e0d58224f24";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-amber-400 w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
              Today's Best Spot
            </span>
          </div>
          <h3 className="text-2xl font-black drop-shadow-md">
            {data.shop?.name || data.coffee.name}
          </h3>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Coffee className="w-5 h-5 text-amber-900" />
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            {data.coffee.desc}
          </p>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Cake className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-800">
              {data.dessert.name}
            </h4>
            <p className="text-sm text-stone-600 leading-relaxed mt-1">
              {data.dessert.desc}
            </p>
          </div>
        </div>

        {data.shop && (
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="bg-stone-50 rounded-[2rem] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-700 font-bold text-[10px]">
                  <MapPin className="w-3 h-3" /> {data.shop.distance}
                </div>
                <ShoppingBag className="w-4 h-4 text-stone-300" />
              </div>

              <h5 className="text-base font-bold text-stone-800">
                {data.shop.name}
              </h5>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleOrder("baemin")}
                  className="py-3 bg-[#2AC1BC] text-white rounded-xl text-[10px] font-bold active:scale-95 transition-transform"
                >
                  배민
                </button>
                <button
                  onClick={() => handleOrder("coupang")}
                  className="py-3 bg-[#00A9E0] text-white rounded-xl text-[10px] font-bold active:scale-95 transition-transform"
                >
                  쿠팡
                </button>
                <button
                  onClick={() => handleOrder("yogiyo")}
                  className="py-3 bg-[#FA0050] text-white rounded-xl text-[10px] font-bold active:scale-95 transition-transform"
                >
                  요기요
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => window.location.reload()}
        className="w-full py-6 bg-stone-50 text-xs font-bold text-stone-400 hover:text-amber-900 transition-colors"
      >
        다시 추천 받기
      </button>
    </motion.div>
  );
};

export default ResultCard;
