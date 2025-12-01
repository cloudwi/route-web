"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Course, PopularPlace } from "@/types";
import { isLoggedIn, removeToken, api } from "@/lib/api";
import {
  Home as HomeIcon,
  PlusCircle,
  User as UserIcon,
  MapPin,
  Heart,
  TrendingUp,
  Star,
  Coffee,
  Utensils,
  Camera,
  Music,
  Trash2,
  Loader2,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";


function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [popularPlaces, setPopularPlaces] = useState<PopularPlace[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "my">("home");
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingPopularPlaces, setIsLoadingPopularPlaces] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // URL 파라미터로 탭 설정
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "my") {
      setActiveTab("my");
    }
  }, [searchParams]);

  // 로그인 상태 확인 및 인기 장소 불러오기
  useEffect(() => {
    setLoggedIn(isLoggedIn());
    fetchPopularPlaces();
  }, []);

  const fetchPopularPlaces = async () => {
    setIsLoadingPopularPlaces(true);
    try {
      const response = await api.fetch("/api/v1/popular_places");
      if (response.ok) {
        const data = await response.json();
        setPopularPlaces(data.places || []);
      }
    } catch (error) {
      console.error("Failed to fetch popular places:", error);
    } finally {
      setIsLoadingPopularPlaces(false);
    }
  };

  // 내 코스 탭이고 로그인 되어있으면 API로 코스 불러오기
  useEffect(() => {
    if (activeTab === "my" && loggedIn) {
      fetchCourses();
    }
  }, [activeTab, loggedIn]);

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const response = await api.fetch("/api/v1/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoadingCourses(false);
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

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await api.fetch(`/api/v1/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCourses(courses.filter((c) => c.id !== courseId));
      } else {
        alert("코스 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("코스 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Route
            </h1>
          </div>
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              로그아웃
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

      {/* Tab Navigation */}
      <div className="fixed top-14 left-0 right-0 bg-white z-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "home"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            홈
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "my"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            내 코스
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-28 pb-24">
        {activeTab === "home" ? (
          <>
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
              <h2 className="text-2xl font-bold mb-2">
                특별한 하루를 계획해보세요
              </h2>
              <p className="text-white/80 text-sm mb-4">
                데이트, 친구 모임, 혼자만의 시간까지<br />
                나만의 코스를 만들고 저장하세요
              </p>
              {loggedIn ? (
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
              )}
            </div>

            {/* Popular Places Ranking */}
            <section className="mb-6">
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
                      className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-b-0 hover:bg-blue-50 hover:scale-[1.01] transition-all cursor-pointer"
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
                        <p className="text-sm text-gray-500">{place.address}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Heart className="w-4 h-4 text-red-400" />
                        {place.likesCount.toLocaleString()}
                      </div>
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
                  { icon: Coffee, label: "카페", color: "bg-amber-100 text-amber-600" },
                  { icon: Utensils, label: "맛집", color: "bg-red-100 text-red-600" },
                  { icon: Camera, label: "핫플", color: "bg-purple-100 text-purple-600" },
                  { icon: Music, label: "문화", color: "bg-blue-100 text-blue-600" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (loggedIn) {
                        router.push(`/course/create?search=${encodeURIComponent(item.label)}`);
                      } else {
                        openLoginModal();
                      }
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all"
                  >
                    <div className={`p-3 rounded-full ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-gray-700">{item.label}</span>
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
          </>
        ) : (
          <>
            {/* My Courses Tab */}
            {!loggedIn ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  로그인이 필요해요
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  내 코스를 저장하고 관리하려면<br />
                  카카오 로그인을 해주세요
                </p>
                <button
                  onClick={openLoginModal}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEE500] text-[#000000] font-medium rounded-xl hover:bg-[#FDD800] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.16.57-.58 2.07-.67 2.39-.11.4.15.39.31.29.13-.08 2.04-1.38 2.87-1.94.89.14 1.82.21 2.78.21 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
                  </svg>
                  로그인하기
                </button>
              </div>
            ) : isLoadingCourses ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">코스를 불러오는 중...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 저장된 코스가 없어요
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  특별한 장소들을 모아<br />
                  나만의 코스를 만들어보세요
                </p>
                <Link
                  href="/course/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  첫 코스 만들기
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    총 {courses.length}개의 코스
                  </span>
                  <Link
                    href="/course/create"
                    className="text-sm text-blue-600 font-medium flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    새 코스
                  </Link>
                </div>
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => router.push(`/course/${course.id}`)}
                    className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {course.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {course.places.slice(0, 3).map((place, index) => (
                        <div key={place.id} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                            {index + 1}
                          </div>
                          <span className="text-gray-600 text-sm truncate">
                            {place.name}
                          </span>
                        </div>
                      ))}
                      {course.places.length > 3 && (
                        <p className="text-sm text-gray-400 pl-9">
                          +{course.places.length - 3}개 더보기
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {course.places.length}개 장소
                      </span>
                      <span className="text-sm text-blue-600 font-medium">
                        지도에서 보기 →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20">
        <div className="max-w-lg mx-auto px-6 py-2 flex justify-around safe-area-bottom">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              activeTab === "home" ? "text-blue-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">홈</span>
          </button>
          {loggedIn ? (
            <Link
              href="/course/create"
              className="flex flex-col items-center py-2 px-4 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <PlusCircle className="w-6 h-6 mb-1" />
              <span className="text-xs">코스만들기</span>
            </Link>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex flex-col items-center py-2 px-4 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <PlusCircle className="w-6 h-6 mb-1" />
              <span className="text-xs">코스만들기</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("my")}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
              activeTab === "my" ? "text-blue-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            <UserIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">내 코스</span>
          </button>
        </div>
      </nav>
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
