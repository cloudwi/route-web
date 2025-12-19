import { useState, useCallback } from "react";
import { Course } from "@/types/models";
import { api } from "@/lib/api";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.fetch("/api/v1/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError("코스를 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("코스를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (courseId: string) => {
    try {
      const response = await api.fetch(`/api/v1/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
        return true;
      } else {
        setError("코스 삭제에 실패했습니다.");
        return false;
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
      setError("코스 삭제에 실패했습니다.");
      return false;
    }
  }, []);

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    deleteCourse,
  };
}
