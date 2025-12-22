"use client";

import { useEffect, useState, useCallback } from "react";
import { X, MapPin } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const handleAnimationEnd = useCallback(() => {
    if (isAnimatingOut) {
      setShouldRender(false);
      setIsAnimatingOut(false);
    }
  }, [isAnimatingOut]);

  // 애니메이션 상태 관리를 위한 의도적인 setState - shouldRender는 isOpen prop과 동기화 필요
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimatingOut(false);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else if (shouldRender) {
      setIsAnimatingOut(true);
      document.body.style.overflow = "";
    }
  }, [isOpen, shouldRender]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleKakaoLogin = () => {
    // 카카오 OAuth URL 구성
    const KAKAO_AUTH_URL = `http://localhost:3000/auth/kakao`;
    // 실제 프로덕션에서는:
    // const KAKAO_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao`;

    // 콜백 URL을 쿼리 파라미터로 전달 (백엔드에서 사용)
    const callbackUrl = `${window.location.origin}/auth/callback`;
    window.location.href = `${KAKAO_AUTH_URL}?redirect_uri=${encodeURIComponent(callbackUrl)}`;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isAnimatingOut ? "animate-fade-out" : "animate-fade-in"
      }`}
      onClick={handleBackdropClick}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden ${
          isAnimatingOut ? "animate-scale-out" : "animate-scale-in"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 pt-12 text-center">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto mb-4">
            <img
              src="/images/logo.png"
              alt="플레이스 로고"
              className="w-full h-full object-contain"
              onError={(e) => {
                // 이미지 로드 실패 시 폴백
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            플레이스에 로그인하기
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            다양한 장소를 공유하고<br />
            솔직한 리뷰를 나눠보세요
          </p>

          {/* Kakao Login Button */}
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#FEE500] text-[#000000] font-semibold rounded-xl hover:bg-[#FDD800] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.16.57-.58 2.07-.67 2.39-.11.4.15.39.31.29.13-.08 2.04-1.38 2.87-1.94.89.14 1.82.21 2.78.21 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8z" />
            </svg>
            카카오로 시작하기
          </button>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-400">
            로그인 시{" "}
            <span className="text-gray-500 underline cursor-pointer">이용약관</span>
            {" "}및{" "}
            <span className="text-gray-500 underline cursor-pointer">개인정보처리방침</span>
            에 동의합니다
          </p>
        </div>
      </div>
    </div>
  );
}
