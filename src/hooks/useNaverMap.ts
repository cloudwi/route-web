"use client";

import { useEffect, useState } from "react";

export const useNaverMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드되어 있는지 체크
    const checkNaverMaps = () => {
      if (window.naver && window.naver.maps) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // 즉시 체크
    if (checkNaverMaps()) return;

    // 폴링으로 로드 체크 (Script 컴포넌트가 로드할 때까지)
    const interval = setInterval(() => {
      if (checkNaverMaps()) {
        clearInterval(interval);
      }
    }, 100);

    // 타임아웃 설정 (10초)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!window.naver || !window.naver.maps) {
        console.error("❌ 네이버 지도 API 로드 실패");
        console.error("스크립트가 제대로 로드되었는지 Network 탭에서 확인해주세요.");
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return {
    isLoaded,
    naver: isLoaded ? window.naver : (null as typeof window.naver | null)
  };
};
