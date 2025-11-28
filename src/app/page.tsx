"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Course, PopularPlace } from "@/types";
import { isLoggedIn, removeToken } from "@/lib/api";
import {
  Home as HomeIcon,
  PlusCircle,
  User as UserIcon,
  MapPin,
  Heart,
  TrendingUp,
  ChevronRight,
  Star,
  Coffee,
  Utensils,
  Camera,
  Music,
  Trash2,
} from "lucide-react";

// 임시 인기 장소 데이터
const MOCK_POPULAR_PLACES: PopularPlace[] = [
  { id: "1", name: "성수동 카페거리", address: "서울 성동구", category: "카페", count: 2847 },
  { id: "2", name: "을지로 힙지로", address: "서울 중구", category: "핫플", count: 2156 },
  { id: "3", name: "연남동 연트럴파크", address: "서울 마포구", category: "산책", count: 1893 },
  { id: "4", name: "한남동 맛집거리", address: "서울 용산구", category: "맛집", count: 1654 },
  { id: "5", name: "익선동 한옥거리", address: "서울 종로구", category: "데이트", count: 1432 },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "카페":
      return <Coffee className="w-4 h-4" />;
    case "맛집":
      return <Utensils className="w-4 h-4" />;
    case "핫플":
      return <Camera className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "my">("home");

  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    setCourses(savedCourses);
    setLoggedIn(isLoggedIn());
  }, []);

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:3000/auth/kakao";
  };

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const updatedCourses = courses.filter((c) => c.id !== courseId);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              onClick={handleKakaoLogin}
              className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] text-[#000000] text-sm font-medium rounded-lg hover:bg-[#FDD800] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.16.57-.58 2.07-.67 2.39-.11.4.15.39.31.29.13-.08 2.04-1.38 2.87-1.94.89.14 1.82.21 2.78.21 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
              </svg>
              카카오 로그인
            </button>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="fixed top-14 left-0 right-0 bg-white z-10 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "home"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            홈
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "my"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500"
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
                  onClick={handleKakaoLogin}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FEE500] text-[#000000] font-semibold rounded-xl hover:bg-[#FDD800] transition-colors"
                >
                  로그인하고 코스 만들기
                </button>
              )}
            </div>

            {/* Popular Places Ranking */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">인기 장소 TOP 5</h3>
                </div>
                <button className="text-sm text-gray-500 flex items-center gap-1">
                  더보기 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {MOCK_POPULAR_PLACES.map((place, index) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
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
                      {place.count.toLocaleString()}
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                      {place.category}
                    </span>
                  </div>
                ))}
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
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
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
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
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
                  onClick={handleKakaoLogin}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FEE500] text-[#000000] font-medium rounded-xl hover:bg-[#FDD800] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.16.57-.58 2.07-.67 2.39-.11.4.15.39.31.29.13-.08 2.04-1.38 2.87-1.94.89.14 1.82.21 2.78.21 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
                  </svg>
                  카카오로 시작하기
                </button>
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
                    className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {course.name}
                      </h3>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {course.places.slice(0, 3).map((place, index) => (
                        <div key={place.id} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
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
                      <button className="text-sm text-blue-600 font-medium">
                        코스 보기
                      </button>
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
            className={`flex flex-col items-center py-2 px-4 transition-colors ${
              activeTab === "home" ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">홈</span>
          </button>
          {loggedIn ? (
            <Link
              href="/course/create"
              className="flex flex-col items-center py-2 px-4 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <PlusCircle className="w-6 h-6 mb-1" />
              <span className="text-xs">코스만들기</span>
            </Link>
          ) : (
            <button
              onClick={handleKakaoLogin}
              className="flex flex-col items-center py-2 px-4 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <PlusCircle className="w-6 h-6 mb-1" />
              <span className="text-xs">코스만들기</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("my")}
            className={`flex flex-col items-center py-2 px-4 transition-colors ${
              activeTab === "my" ? "text-blue-600" : "text-gray-400"
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
