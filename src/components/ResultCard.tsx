import { motion } from "framer-motion";
import {
  Coffee,
  Cake,
  Sparkles,
  AlertCircle,
  MapPin,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { useMemo } from "react";

// 1. 데이터 구조 정의
interface Recommendation {
  coffee: { name: string; desc: string };
  dessert: { name: string; desc: string };
  shop?: {
    name: string;
    address: string;
    distance: string; // AI가 준 대략적 거리
    menu: string;
    mapUrl: string;
    lat: number; // 추가된 위도
    lng: number; // 추가된 경도
  };
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

// 2. Props 타입 정의 (onReset 추가)
interface ResultCardProps {
  data: Recommendation | null;
  userCoords: LocationCoords | null;
  onReset: () => void; // 설문 폼으로 돌아가기 위한 함수
}

// 3. 하버사인(Haversine) 거리 계산 함수
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 단위: km
};

const ResultCard = ({ data, userCoords, onReset }: ResultCardProps) => {
  // ✅ 매장 이미지 URL 생성 (순수 함수 규칙 준수)
  const dynamicImageUrl = useMemo(() => {
    if (!data) return "";
    if (data.shop?.name) {
      const query = encodeURIComponent(`${data.shop.name} cafe`);
      return `https://images.unsplash.com/photo-1501339817302-ee4fba296ce5?auto=format&fit=crop&q=80&w=800&q=${query}`;
    }
    const seed = data.coffee.name.length + data.dessert.name.length;
    return `https://coffee.alexflipnote.dev/random?sig=${seed}`;
  }, [data]);

  // ✅ 실시간 정확한 거리 계산
  const preciseDistance = useMemo(() => {
    if (data?.shop?.lat && data?.shop?.lng && userCoords) {
      const dist = getDistance(
        userCoords.latitude,
        userCoords.longitude,
        data.shop.lat,
        data.shop.lng
      );
      return dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`;
    }
    return data?.shop?.distance || "거리 정보 없음";
  }, [data, userCoords]);

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
        if (Date.now() - start < 1500) window.open(fallback, "_blank");
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
      {/* 상단 이미지 섹션 */}
      <div className="relative w-full aspect-video bg-stone-200">
        <img
          src={dynamicImageUrl}
          className="w-full h-full object-cover transition-opacity duration-500"
          alt={data.shop?.name || "Cafe"}
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
        {/* 음료 설명 */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Coffee className="w-5 h-5 text-amber-900" />
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            {data.coffee.desc}
          </p>
        </div>

        {/* 디저트 설명 */}
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

        {/* 매장 및 위치 정보 */}
        {data.shop && (
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="bg-stone-50 rounded-[2rem] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-700 font-bold text-[10px]">
                  <MapPin className="w-3 h-3" /> 내 위치에서 {preciseDistance}
                </div>
                <ShoppingBag className="w-4 h-4 text-stone-300" />
              </div>

              <h5 className="text-base font-bold text-stone-800">
                {data.shop.name}
              </h5>
              <p className="text-[11px] text-stone-400 -mt-2">
                {data.shop.address}
              </p>

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

              {/* ✅ 변경된 부분: 지도 보기 대신 '설문 폼으로 돌아가기' 버튼 */}
              <button
                onClick={onReset}
                className="flex items-center justify-center gap-2 w-full py-4 mt-2 bg-stone-800 text-white rounded-xl text-[10px] font-bold hover:bg-stone-700 active:scale-95 transition-all shadow-md"
              >
                <RefreshCw className="w-3 h-3" />
                설문 폼으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
