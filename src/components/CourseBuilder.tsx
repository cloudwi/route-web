"use client";

import { useState } from "react";
import { Place, Course } from "@/types";
import PlaceSearch from "./PlaceSearch";
import NaverMap from "./NaverMap";

export default function CourseBuilder() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [courseName, setCourseName] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();

  const handleSearchResults = (results: Place[]) => {
    setSearchResults(results);
  };

  const handleAddPlace = (place: Place) => {
    if (places.some((p) => p.id === place.id)) {
      alert("이미 추가된 장소입니다.");
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

  const handleSaveCourse = () => {
    if (!courseName.trim()) {
      alert("코스 이름을 입력해주세요.");
      return;
    }

    if (places.length < 2) {
      alert("최소 2개 이상의 장소를 추가해주세요.");
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      name: courseName,
      places,
      createdAt: new Date(),
    };

    // 로컬 스토리지에 저장
    const savedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    localStorage.setItem("courses", JSON.stringify([...savedCourses, course]));

    alert("코스가 저장되었습니다!");
    setCourseName("");
    setPlaces([]);
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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-xl font-bold">코스 만들기</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Panel - Search & List */}
        <div className="lg:w-1/3 p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-100">
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
              {places.length >= 2 && (
                <button
                  onClick={handleSaveCourse}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  코스 저장
                </button>
              )}
            </div>

            <div className="space-y-2">
              {places.map((place, index) => (
                <div
                  key={place.id}
                  className={`bg-white border rounded-xl p-4 transition-all ${
                    selectedPlaceId === place.id
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedPlaceId(place.id)}
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
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
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
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePlace(place.id);
                        }}
                        className="p-1 hover:bg-red-100 text-red-500 rounded"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 bg-gray-100">
          <NaverMap
            places={searchResults.length > 0 && places.length === 0 ? searchResults : places}
            selectedPlaceId={selectedPlaceId}
            onPlaceClick={(place) => setSelectedPlaceId(place.id)}
          />
        </div>
      </div>
    </div>
  );
}
