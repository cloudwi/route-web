"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Course } from "@/types";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = () => {
      const savedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      setCourses(savedCourses);
    };
    loadCourses();
  }, []);

  const handleDeleteCourse = (courseId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const updatedCourses = courses.filter((c) => c.id !== courseId);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Route</h1>
          <Link
            href="/course/create"
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            코스 만들기
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 pt-20 pb-24">
        {courses.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">아직 생성된 코스가 없습니다</p>
            <Link
              href="/course/create"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              첫 코스 만들기
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {course.name}
                  </h3>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-1">
                  {course.places.map((place, index) => (
                    <div key={place.id} className="flex items-center gap-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{place.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  총 {course.places.length}개 장소
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto px-6 py-3 flex justify-around">
          {[
            { icon: "🏠", label: "홈", href: "/" },
            { icon: "➕", label: "코스만들기", href: "/course/create" },
            { icon: "👤", label: "프로필", href: "/profile" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex flex-col items-center py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
