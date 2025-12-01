"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isLoggedIn } from "@/lib/api";
import CourseBuilder from "@/components/CourseBuilder";
import { Loader2 } from "lucide-react";

function CreateCourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  const initialSearch = searchParams.get("search") || "";

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
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
