"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { api, isLoggedIn } from "@/lib/api";
import { Course } from "@/types";
import NaverMap from "@/components/NaverMap";
import {
  ArrowLeft,
  Trash2,
  Loader2,
} from "lucide-react";

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

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/");
      return;
    }
    fetchCourse();
  }, [id, router]);

  const fetchCourse = async () => {
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
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          />
        </div>

        {/* Place List - Desktop */}
        <div className="hidden lg:block w-80 border-l border-gray-100 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">
              장소 목록 ({course.places.length})
            </h2>
            <div className="space-y-3">
              {course.places.map((place, index) => (
                <div
                  key={place.id}
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
