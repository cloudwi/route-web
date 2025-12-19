"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Place, Course } from "@/types";
import { api } from "@/lib/api";
import {
  Search as SearchIcon,
  MapPin,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Clock,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState<"places" | "courses">("places");
  const [places, setPlaces] = useState<Place[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [hasSearchedPlaces, setHasSearchedPlaces] = useState(false);
  const [hasSearchedCourses, setHasSearchedCourses] = useState(false);

  // 장소 검색
  const handleSearchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoadingPlaces(true);
    try {
      const response = await api.fetch(
        `/api/v1/places/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setPlaces(data.places || []);
        setHasSearchedPlaces(true);
      }
    } catch (error) {
      console.error("Failed to search places:", error);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // 코스 검색
  const handleSearchCourses = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoadingCourses(true);
    try {
      const response = await api.fetch(
        `/api/v1/courses/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        setHasSearchedCourses(true);
      }
    } catch (error) {
      console.error("Failed to search courses:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // 검색 실행 (현재 활성 탭에 대해서만)
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);

    if (activeTab === "places") {
      await handleSearchPlaces(searchQuery);
    } else {
      await handleSearchCourses(searchQuery);
    }
  };

  // 탭 전환 시 해당 탭이 아직 검색되지 않았으면 검색 실행
  const handleTabChange = async (tab: "places" | "courses") => {
    setActiveTab(tab);

    if (!query.trim()) return;

    if (tab === "places" && !hasSearchedPlaces) {
      await handleSearchPlaces(query);
    } else if (tab === "courses" && !hasSearchedCourses) {
      await handleSearchCourses(query);
    }
  };

  // URL 파라미터로 초기 검색
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      handleSearchPlaces(q);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(query);
                  }
                }}
                placeholder="장소나 코스를 검색하세요"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={() => handleSearch(query)}
              className="px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              검색
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="fixed top-[80px] left-0 right-0 bg-white z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 flex">
          <button
            onClick={() => handleTabChange("places")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "places"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            장소 {places.length > 0 && `(${places.length})`}
          </button>
          <button
            onClick={() => handleTabChange("courses")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === "courses"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            코스 {courses.length > 0 && `(${courses.length})`}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 pt-32 pb-24">
        {activeTab === "places" ? (
          <section>
            {isLoadingPlaces ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : places.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">
                  {query ? "검색 결과가 없습니다" : "검색어를 입력해주세요"}
                </p>
              </div>
            ) : (
              <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-3 lg:space-y-0">
                {places.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => router.push(`/course/create?placeId=${place.id}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {place.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {place.address}
                        </p>
                        {place.category && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {place.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section>
            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">
                  {query ? "검색 결과가 없습니다" : "검색어를 입력해주세요"}
                </p>
              </div>
            ) : (
              <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-3 lg:space-y-0">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => router.push(`/course/${course.id}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {course.name}
                    </h3>
                    <div className="space-y-1 mb-3">
                      {course.places.slice(0, 3).map((place, index) => (
                        <div key={place.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="truncate">{place.name}</span>
                        </div>
                      ))}
                      {course.places.length > 3 && (
                        <p className="text-xs text-gray-400 pl-7">
                          +{course.places.length - 3}개 더보기
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {course.places.length}개 장소
                      </span>
                      {course.createdAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
