"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Place } from "@/types";
import { api } from "@/lib/api";
import PlaceSearch from "./PlaceSearch";
import NaverMap, { RouteInfo, RouteSection } from "./NaverMap";
import Toast, { ToastType } from "./Toast";
import {
  ChevronUp,
  ChevronDown,
  X,
  MapPin,
  Phone,
  ExternalLink,
  Tag,
  List,
  Map,
  Clock,
  Navigation,
} from "lucide-react";

// 거리 포맷팅 (미터 -> km)
const formatDistance = (meters: number): string => {
  if (!meters || isNaN(meters)) return "-";
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// 시간 포맷팅 (밀리초 -> 분/시간)
const formatDuration = (ms: number): string => {
  if (!ms || isNaN(ms)) return "-";
  const minutes = Math.round(ms / 1000 / 60);
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
};

export default function CourseBuilder() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [courseName, setCourseName] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSearchResults = (results: Place[]) => {
    setSearchResults(results);
  };

  const handleAddPlace = (place: Place) => {
    if (places.some((p) => p.id === place.id)) {
      showToast("이미 추가된 장소입니다.", "warning");
      return;
    }
    setPlaces([...places, place]);
    setSelectedPlaceId(place.id);
  };

  const handleRemovePlace = (placeId: string) => {
    setPlaces(places.filter((p) => p.id !== placeId));
    if (selectedPlaceId === placeId) {
      setSelectedPlaceId(undefined);
    }
  };

  const handleSaveCourse = async () => {
    if (!courseName.trim()) {
      showToast("코스 이름을 입력해주세요.", "warning");
      return;
    }

    if (places.length < 1) {
      showToast("최소 1개 이상의 장소를 추가해주세요.", "warning");
      return;
    }

    showToast("코스를 저장하고 있습니다...", "loading");

    try {
      const response = await api.fetch("/api/v1/courses", {
        method: "POST",
        body: JSON.stringify({
          name: courseName,
          places,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || "코스 저장에 실패했습니다.";
        throw new Error(errorMessage);
      }

      showToast("코스가 저장되었습니다!", "success");

      setTimeout(() => {
        router.push("/?tab=my");
      }, 1500);
    } catch (error) {
      console.error("Failed to save course:", error);
      const message = error instanceof Error ? error.message : "코스 저장에 실패했습니다.";
      showToast(message, "error");
    }
  };

  const movePlace = (index: number, direction: "up" | "down") => {
    const newPlaces = [...places];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= places.length) return;

    [newPlaces[index], newPlaces[targetIndex]] = [
      newPlaces[targetIndex],
      newPlaces[index],
    ];

    setPlaces(newPlaces);
  };

  const selectedPlace =
    places.find((p) => p.id === selectedPlaceId) ||
    searchResults.find((p) => p.id === selectedPlaceId);

  // 구간별 이동 정보 컴포넌트
  const SectionInfo = ({ section }: { section: RouteSection }) => (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          <span>{formatDistance(section.distance)}</span>
        </div>
        <div className="w-px h-3 bg-gray-300" />
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatDuration(section.duration)}</span>
        </div>
      </div>
    </div>
  );

  // 장소 목록 컴포넌트 (재사용)
  const PlaceList = () => (
    <div className="space-y-1">
      {places.map((place, index) => (
        <div key={place.id}>
          <div
            className={`bg-white border rounded-xl p-4 transition-all cursor-pointer ${
              selectedPlaceId === place.id
                ? "border-blue-500 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => {
              setSelectedPlaceId(place.id);
              setMobileView("map");
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {place.name}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {place.address}
                </p>
                {place.category && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {place.category}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {index > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      movePlace(index, "up");
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {index < places.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      movePlace(index, "down");
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePlace(place.id);
                  }}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* 구간별 이동 시간 표시 */}
          {index < places.length - 1 && routeInfo && (
            <SectionInfo
              section={
                places.length === 2
                  ? { distance: routeInfo.distance, duration: routeInfo.duration }
                  : routeInfo.sections?.[index] || { distance: 0, duration: 0 }
              }
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RouteK
          </span>
        </div>
        <span className="text-sm text-gray-500">코스 만들기</span>
      </header>

      {/* Main Content - Desktop */}
      <div className="flex-1 overflow-hidden hidden lg:flex">
        {/* Left Panel - Search & List */}
        <div className="w-1/3 flex flex-col border-r border-gray-100">
          <div className="flex-1 p-6 overflow-y-auto pb-24">
            <PlaceSearch
              onPlaceSelect={handleAddPlace}
              onSearchResults={handleSearchResults}
            />

            <div className="mt-6">
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="코스 이름"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  선택된 장소 ({places.length})
                </h3>
              </div>

              {/* 경로 정보 표시 */}
              {routeInfo && places.length >= 2 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl flex items-center justify-around">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Navigation className="w-4 h-4" />
                    <span className="font-semibold">{formatDistance(routeInfo.distance)}</span>
                  </div>
                  <div className="w-px h-6 bg-blue-200" />
                  <div className="flex items-center gap-2 text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{formatDuration(routeInfo.duration)}</span>
                  </div>
                </div>
              )}

              <PlaceList />
            </div>
          </div>

          {/* Desktop Save Button - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 w-1/3 p-4 bg-white border-t border-gray-100">
            <button
              onClick={handleSaveCourse}
              disabled={places.length < 1}
              className={`w-full py-3.5 text-base font-semibold rounded-xl transition-all ${
                places.length >= 1
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              코스 저장하기
            </button>
          </div>
        </div>

        {/* Right Panel - Map & Place Detail */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0">
            <NaverMap
              places={searchResults.length > 0 && places.length === 0 ? searchResults : places}
              selectedPlaceId={selectedPlaceId}
              onPlaceClick={(place) => setSelectedPlaceId(place.id)}
              onRouteCalculated={setRouteInfo}
            />
          </div>

          {/* Place Detail Panel */}
          {selectedPlace && (
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-5 z-10 animate-slide-up">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">
                    {selectedPlace.name}
                  </h3>
                  {selectedPlace.category && (
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{selectedPlace.category}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPlaceId(undefined)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>{selectedPlace.address}</span>
                </div>
                {selectedPlace.telephone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <a
                      href={`tel:${selectedPlace.telephone}`}
                      className="hover:text-blue-600"
                    >
                      {selectedPlace.telephone}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {selectedPlace.naverMapUrl && (
                  <a
                    href={selectedPlace.naverMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    네이버 플레이스
                  </a>
                )}
                {!places.some((p) => p.id === selectedPlace.id) && (
                  <button
                    onClick={() => handleAddPlace(selectedPlace)}
                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    코스에 추가
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Mobile */}
      <div className="flex-1 overflow-hidden lg:hidden relative">
        {/* Map (Always visible, full screen) */}
        <div className="absolute inset-0">
          <NaverMap
            places={searchResults.length > 0 && places.length === 0 ? searchResults : places}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={(place) => setSelectedPlaceId(place.id)}
            onRouteCalculated={setRouteInfo}
          />
        </div>

        {/* Route Info Badge - Mobile */}
        {places.length >= 2 && routeInfo && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="bg-white rounded-xl shadow-lg p-3 flex items-center justify-around">
              <div className="flex items-center gap-2 text-blue-600">
                <Navigation className="w-4 h-4" />
                <span className="font-semibold text-sm">{formatDistance(routeInfo.distance)}</span>
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="w-4 h-4" />
                <span className="font-semibold text-sm">{formatDuration(routeInfo.duration)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Sheet */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-10 transition-all duration-300 ${
            mobileView === "list" ? "h-[70%]" : "h-auto"
          }`}
        >
          {/* Handle bar */}
          <div
            className="flex justify-center py-2 cursor-pointer"
            onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
          >
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {mobileView === "map" ? (
            // Collapsed: Search bar + place count
            <div className="px-4 pb-4">
              <PlaceSearch
                onPlaceSelect={(place) => {
                  handleAddPlace(place);
                  setMobileView("map");
                }}
                onSearchResults={handleSearchResults}
              />

              <div className="mt-3 flex items-center justify-between">
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="코스 이름"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mr-2"
                />
                <button
                  onClick={() => setMobileView("list")}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium"
                >
                  <List className="w-4 h-4" />
                  {places.length}
                </button>
              </div>

              {/* Selected Place Detail */}
              {selectedPlace && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        {selectedPlace.name}
                      </h3>
                      {selectedPlace.category && (
                        <span className="text-xs text-gray-500">{selectedPlace.category}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedPlaceId(undefined)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{selectedPlace.address}</p>

                  <div className="flex gap-2">
                    {selectedPlace.naverMapUrl && (
                      <a
                        href={selectedPlace.naverMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        상세보기
                      </a>
                    )}
                    {!places.some((p) => p.id === selectedPlace.id) && (
                      <button
                        onClick={() => handleAddPlace(selectedPlace)}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
                      >
                        추가
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile Save Button */}
              <button
                onClick={handleSaveCourse}
                disabled={places.length < 1}
                className={`w-full mt-4 py-3 text-base font-semibold rounded-xl transition-all ${
                  places.length >= 1
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                코스 저장하기
              </button>
            </div>
          ) : (
            // Expanded: Full list view
            <div className="px-4 pb-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  선택된 장소 ({places.length})
                </h3>
                <button
                  onClick={() => setMobileView("map")}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600"
                >
                  <Map className="w-4 h-4" />
                  지도 보기
                </button>
              </div>

              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="코스 이름"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />

              <div className="flex-1 overflow-y-auto">
                <PlaceList />

                {places.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>장소를 검색하고 추가해보세요</p>
                  </div>
                )}
              </div>

              {/* Mobile Save Button in List View */}
              <button
                onClick={handleSaveCourse}
                disabled={places.length < 1}
                className={`w-full mt-4 py-3 text-base font-semibold rounded-xl transition-all flex-shrink-0 ${
                  places.length >= 1
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                코스 저장하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
