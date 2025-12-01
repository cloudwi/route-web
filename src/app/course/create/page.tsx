"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isLoggedIn } from "@/lib/api";
import CourseBuilder from "@/components/CourseBuilder";
import { Loader2 } from "lucide-react";

function CreateCourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
  const hasChecked = useRef(false);

  const initialSearch = searchParams.get("search") || "";

  // 인증 상태 체크 - localStorage 접근은 클라이언트에서만 가능하므로 useEffect 사용
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const loggedIn = isLoggedIn();
    if (!loggedIn) {
      router.replace("/");
      setAuthState("unauthenticated");
    } else {
      setAuthState("authenticated");
    }
  }, [router]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (authState !== "authenticated") {
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
