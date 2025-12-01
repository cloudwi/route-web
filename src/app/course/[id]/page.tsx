"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { api, isLoggedIn, getDirections } from "@/lib/api";
import { Course, DirectionsMode, RouteSection } from "@/types";
import NaverMap from "@/components/NaverMap";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  Car,
  Train,
  Clock,
  Navigation,
} from "lucide-react";

// 시간 포맷팅 함수
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
};

// 거리 포맷팅 함수
const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${meters}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();

  // 경로 관련 상태 - localStorage에서 이전 모드 불러오기
  const [transportMode, setTransportMode] = useState<DirectionsMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("transportMode");
      return (saved as DirectionsMode) || "transit";
    }
    return "transit";
  });
  const [routeSections, setRouteSections] = useState<RouteSection[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [totalRouteTime, setTotalRouteTime] = useState(0);
  const [totalRouteDistance, setTotalRouteDistance] = useState(0);

  // transportMode 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("transportMode", transportMode);
    }
  }, [transportMode]);

  // 경로 조회 함수
  const fetchRoutes = useCallback(async () => {
    if (!course || course.places.length < 2) {
      setRouteSections([]);
      setTotalRouteTime(0);
      setTotalRouteDistance(0);
      return;
    }

    setIsLoadingRoute(true);
    const sections: RouteSection[] = [];
    let totalTime = 0;
    let totalDistance = 0;

    try {
      for (let i = 0; i < course.places.length - 1; i++) {
        const from = course.places[i];
        const to = course.places[i + 1];

        try {
          const response = await getDirections({
            startLat: from.lat,
            startLng: from.lng,
            endLat: to.lat,
            endLng: to.lng,
            mode: transportMode,
          });

          const section: RouteSection = { from, to };

          if (transportMode === "transit" && response.result.paths && response.result.paths.length > 0) {
            const bestPath = response.result.paths[0];
            section.transit = bestPath;
            totalTime += bestPath.total_time;
            totalDistance += bestPath.total_distance;
          } else if (transportMode === "driving" && response.result.summary) {
            section.driving = response.result.summary;
            section.drivingPath = response.result.path;
            totalTime += response.result.summary.duration_minutes;
            totalDistance += response.result.summary.distance;
          }

          sections.push(section);
        } catch (error) {
          console.error(`Failed to fetch route from ${from.name} to ${to.name}:`, error);
          sections.push({ from, to });
        }
      }

      setRouteSections(sections);
      setTotalRouteTime(totalTime);
      setTotalRouteDistance(totalDistance);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    } finally {
      setIsLoadingRoute(false);
    }
  }, [course, transportMode]);

  // course나 transportMode 변경 시 경로 조회
  useEffect(() => {
    if (course) {
      fetchRoutes();
    }
  }, [course, fetchRoutes]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/");
      return;
    }

    const loadCourse = async () => {
      setIsLoading(true);
      try {
        const response = await api.fetch(`/api/v1/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        } else {
          router.push("/?tab=my");
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        router.push("/?tab=my");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await api.fetch(`/api/v1/courses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/?tab=my");
      } else {
        alert("코스 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("코스 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate max-w-[200px]">
            {course.name}
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <NaverMap
            places={course.places}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={(place) => setSelectedPlaceId(place.id)}
            routeSections={routeSections}
          />
        </div>

        {/* Place List - Desktop */}
        <div className="hidden lg:block w-80 border-l border-gray-100 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">
              장소 목록 ({course.places.length})
            </h2>

            {/* 이동 수단 선택 */}
            {course.places.length >= 2 && (
              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setTransportMode("transit")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      transportMode === "transit"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Train className="w-4 h-4" />
                    대중교통
                  </button>
                  <button
                    onClick={() => setTransportMode("driving")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      transportMode === "driving"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    자동차
                  </button>
                </div>

                {/* 총 경로 정보 */}
                {(totalRouteTime > 0 || isLoadingRoute) && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl mb-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-700">총 이동</span>
                    </div>
                    {isLoadingRoute ? (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-3 text-sm text-blue-700">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(totalRouteTime)}
                        </span>
                        <span>{formatDistance(totalRouteDistance)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              {course.places.map((place, index) => (
                <div key={place.id}>
                  <div
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedPlaceId === place.id
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {place.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {place.address}
                        </p>
                        {place.category && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                            {place.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* 구간 경로 정보 */}
                  {index < course.places.length - 1 && routeSections[index] && (
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600">
                        {isLoadingRoute ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            {transportMode === "transit" ? (
                              <Train className="w-3.5 h-3.5" />
                            ) : (
                              <Car className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {routeSections[index].transit
                                ? `${formatDuration(routeSections[index].transit!.total_time)} · ${formatDistance(routeSections[index].transit!.total_distance)}`
                                : routeSections[index].driving
                                ? `${formatDuration(routeSections[index].driving!.duration_minutes)} · ${formatDistance(routeSections[index].driving!.distance)}`
                                : "경로 없음"}
                            </span>
                            {transportMode === "transit" && routeSections[index].transit && routeSections[index].transit!.transfer_count > 0 && (
                              <span className="text-xs text-gray-400">
                                (환승 {routeSections[index].transit!.transfer_count}회)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Place List - Mobile Bottom Sheet */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-10 max-h-[40%] overflow-hidden">
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="px-4 pb-4 overflow-y-auto max-h-[calc(40vh-40px)]">
            <h2 className="font-semibold text-gray-900 mb-3 sticky top-0 bg-white py-2">
              장소 목록 ({course.places.length})
            </h2>
            <div className="space-y-2">
              {course.places.map((place, index) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedPlaceId === place.id
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-gray-50 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {place.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {place.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
