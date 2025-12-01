"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isLoggedIn } from "@/lib/api";
import CourseBuilder from "@/components/CourseBuilder";
import { Loader2 } from "lucide-react";

function CreateCourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";

  const isAuthenticated = useMemo(() => {
    const loggedIn = isLoggedIn();
    if (!loggedIn) {
      router.replace("/");
    }
    return loggedIn;
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return <CourseBuilder initialSearch={initialSearch} />;
}

export default function CreateCoursePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }
    >
      <CreateCourseContent />
    </Suspense>
  );
}
