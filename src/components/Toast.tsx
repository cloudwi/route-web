"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X, Loader2 } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "loading";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000,
}: ToastProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const handleAnimationEnd = useCallback(() => {
    if (isAnimatingOut) {
      setShouldRender(false);
      setIsAnimatingOut(false);
    }
  }, [isAnimatingOut]);

  // 애니메이션 상태 관리를 위한 의도적인 setState - shouldRender는 isVisible prop과 동기화 필요
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setIsAnimatingOut(false);
    } else if (shouldRender) {
      setIsAnimatingOut(true);
    }
  }, [isVisible, shouldRender]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (isVisible && type !== "loading" && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, type]);

  if (!shouldRender) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    loading: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
  };

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
    loading: "bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isAnimatingOut ? "animate-slide-up-out" : "animate-slide-down"
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColors[type]}`}
      >
        {icons[type]}
        <span className="text-gray-800 font-medium">{message}</span>
        {type !== "loading" && (
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
