"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PopularPlace } from "@/types";
import { isLoggedIn, removeToken, api } from "@/lib/api";
import {
  PlusCircle,
  MapPin,
  Heart,
  TrendingUp,
  Star,
  Coffee,
  Loader2,
  UtensilsCrossed,
  Beer,
  Hospital,
  Pill,
  Landmark,
  GraduationCap,
  Dumbbell,
  Scissors,
  ShoppingCart,
  Fuel,
  Theater,
  Search,
  User,
} from "lucide-react";
import LoginModal from "@/components/features/auth/LoginModal";
import PlaceMapModal from "@/components/features/place/PlaceMapModal";


function HomeContent() {
  const router = useRouter();
  const [popularPlaces, setPopularPlaces] = useState<PopularPlace[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingPopularPlaces, setIsLoadingPopularPlaces] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PopularPlace | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // 로그인 상태 확인 및 인기 장소 불러오기
  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setIsCheckingAuth(false);
    fetchPopularPlaces();
  }, []);

  const fetchPopularPlaces = async () => {
    setIsLoadingPopularPlaces(true);
    try {
      const data = await api.get<{ places: PopularPlace[] }>("/api/v1/popular_places");
      setPopularPlaces(data.places || []);
    } catch (error) {
      console.error("Failed to fetch popular places:", error);
    } finally {
      setIsLoadingPopularPlaces(false);
    }
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
  };

  const handleLikePlace = async (placeId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const data = await api.post<{ likesCount?: number }>(`/api/v1/places/${placeId}/likes`);
      // API 응답에서 실제 좋아요 수를 받아와서 업데이트
      if (data.likesCount !== undefined) {
        setPopularPlaces(popularPlaces.map(place =>
          place.id === placeId.toString()
            ? { ...place, likesCount: data.likesCount }
            : place
        ));
      } else {
        // API 응답에 likesCount가 없으면 다시 인기장소 목록 조회
        fetchPopularPlaces();
      }
    } catch (error) {
      console.error("Failed to like place:", error);
    }
  };

  const handlePlaceClick = (place: PopularPlace) => {
    setSelectedPlace(place);
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = () => {
    setIsMapModalOpen(false);
    setTimeout(() => setSelectedPlace(null), 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Place Map Modal */}
      <PlaceMapModal
        isOpen={isMapModalOpen}
        onClose={handleCloseMapModal}
        place={selectedPlace}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Route
            </h1>
          </div>
          {isCheckingAuth ? (
            <div className="w-9 h-9" />
          ) : loggedIn ? (
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="로그아웃"
            >
              <User className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] text-[#000000] text-sm font-medium rounded-lg hover:bg-[#FDD800] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.16.57-.58 2.07-.67 2.39-.11.4.15.39.31.29.13-.08 2.04-1.38 2.87-1.94.89.14 1.82.21 2.78.21 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
              </svg>
              로그인
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 pt-20 pb-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Left Column - Search Bar & Hero Banner */}
            <div className="lg:col-span-2">
              {/* Search Bar */}
              <div
                onClick={() => router.push("/search")}
                className="mb-6 bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 text-gray-400">
                  <Search className="w-5 h-5" />
                  <span className="text-sm">장소나 코스를 검색하세요</span>
                </div>
              </div>

              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 lg:p-8 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">
                특별한 하루를 계획해보세요
              </h2>
              <p className="text-white/80 text-sm mb-4">
                데이트, 친구 모임, 혼자만의 시간까지<br />
                나만의 코스를 만들고 저장하세요
              </p>
              {!isCheckingAuth && (
                loggedIn ? (
                  <Link
                    href="/course/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                    코스 만들기
                  </Link>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FEE500] text-[#000000] font-semibold rounded-xl hover:bg-[#FDD800] transition-colors"
                  >
                    로그인하고 코스 만들기
                  </button>
                )
              )}
            </div>
            </div>

            {/* Popular Places Ranking */}
            <section className="mb-6 lg:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900">인기 장소 TOP 5</h3>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {isLoadingPopularPlaces ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : popularPlaces.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">인기 장소가 없습니다</p>
                  </div>
                ) : (
                  popularPlaces.slice(0, 5).map((place, index) => (
                    <div
                      key={place.id}
                      className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-b-0 hover:bg-blue-50 transition-all cursor-pointer"
                      onClick={() => handlePlaceClick(place)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                            ? "bg-gray-300 text-gray-700"
                            : index === 2
                            ? "bg-orange-300 text-orange-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {place.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{place.address}</p>
                      </div>
                      <button
                        onClick={(e) => handleLikePlace(parseInt(place.id), e)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Heart className="w-4 h-4 text-red-400" />
                        <span>{place.likesCount.toLocaleString()}</span>
                      </button>
                      {place.category && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full truncate max-w-[80px]">
                          {place.category.split(">").pop()?.split(",")[0] || place.category}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Category Quick Links */}
            <section className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">카테고리</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: UtensilsCrossed, label: "음식점", color: "bg-orange-100 text-orange-600" },
                  { icon: Coffee, label: "카페,디저트", color: "bg-amber-100 text-amber-600" },
                  { icon: Beer, label: "술집", color: "bg-yellow-100 text-yellow-600" },
                  { icon: Hospital, label: "병원,의원", color: "bg-red-100 text-red-600" },
                  { icon: Pill, label: "건강,의료", color: "bg-green-100 text-green-600" },
                  { icon: Landmark, label: "금융,보험", color: "bg-blue-100 text-blue-600" },
                  { icon: GraduationCap, label: "교육,학문", color: "bg-indigo-100 text-indigo-600" },
                  { icon: Dumbbell, label: "스포츠시설", color: "bg-purple-100 text-purple-600" },
                  { icon: Scissors, label: "미용", color: "bg-pink-100 text-pink-600" },
                  { icon: ShoppingCart, label: "생활,편의", color: "bg-teal-100 text-teal-600" },
                  { icon: Fuel, label: "주유소", color: "bg-slate-100 text-slate-600" },
                  { icon: Theater, label: "문화,여가", color: "bg-violet-100 text-violet-600" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(item.label)}`);
                    }}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all"
                  >
                    <div className={`p-3 rounded-full ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-gray-700 text-center leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Recent Public Courses */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-gray-900">추천 코스</h3>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "성수동 카페 투어", places: 4, likes: 128 },
                  { name: "홍대 데이트 코스", places: 5, likes: 96 },
                  { name: "을지로 레트로 탐방", places: 3, likes: 84 },
                ].map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{course.name}</h4>
                      <p className="text-sm text-gray-500">{course.places}개 장소</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Heart className="w-4 h-4 text-red-400" />
                      {course.likes}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {!isCheckingAuth && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20">
          <div className="max-w-lg mx-auto px-6 py-3 flex justify-center safe-area-bottom">
            {loggedIn ? (
              <Link
                href="/course/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                코스 만들기
              </Link>
            ) : (
              <button
                onClick={openLoginModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEE500] text-[#000000] font-medium rounded-xl hover:bg-[#FDD800] transition-colors"
              >
                로그인하고 시작하기
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
