"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    let isProcessed = false;

    const handleCallback = async () => {
      if (isProcessed) return;
      isProcessed = true;

      try {
        // URL에서 토큰 또는 인증 코드 가져오기
        const token = searchParams.get("token");
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          console.error("Authentication error:", error);
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
          router.push("/");
          return;
        }

        if (token) {
          // 토큰이 직접 전달된 경우
          await login(token);
          console.log("Login successful");

          // 메인 페이지로 리다이렉트
          router.push("/");
        } else if (code) {
          // 인증 코드가 전달된 경우 (OAuth 2.0 방식)
          // TODO: 백엔드 API를 호출해서 code를 token으로 교환
          const response = await fetch("/api/auth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error("Failed to exchange code for token");
          }

          const data = await response.json();
          await login(data.token);

          // 메인 페이지로 리다이렉트
          router.push("/");
        } else {
          // 토큰도 코드도 없는 경우
          console.error("No token or code provided");
          alert("인증 정보가 없습니다.");
          router.push("/");
        }
      } catch (error) {
        console.error("Callback error:", error);
        alert("로그인 처리 중 오류가 발생했습니다.");
        router.push("/");
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-bg)' }}>
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>로그인 처리 중...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>잠시만 기다려주세요</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-bg)' }}>
          <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
