"use client";

import { useState } from "react";
import { Copy, Check, Heart, UserPlus, X } from "lucide-react";

interface CoupleConnectionProps {
  isConnected: boolean;
  coupleCode?: string;
  partnerName?: string;
  onGenerateCode?: () => void;
  onConnectWithCode?: (code: string) => void;
  onDisconnect?: () => void;
}

export default function CoupleConnection({
  isConnected,
  coupleCode,
  partnerName,
  onGenerateCode,
  onConnectWithCode,
  onDisconnect,
}: CoupleConnectionProps) {
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleCopyCode = () => {
    if (coupleCode) {
      navigator.clipboard.writeText(coupleCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    if (inputCode.trim()) {
      onConnectWithCode?.(inputCode.trim());
      setInputCode("");
      setShowCodeInput(false);
    }
  };

  // 연결된 상태
  if (isConnected && partnerName) {
    return (
      <div className="backdrop-blur-xl border rounded-3xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
          borderColor: 'rgba(236, 72, 153, 0.3)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
            <h3 className="text-lg font-bold text-white">커플 연결됨</h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
            💕 연결 중
          </span>
        </div>

        <p className="text-gray-300 mb-4">
          <span className="font-bold text-white">{partnerName}</span>님과 함께 일기를 공유하고 있어요
        </p>

        <button
          onClick={onDisconnect}
          className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          <span>연결 해제</span>
        </button>
      </div>
    );
  }

  // 코드가 생성된 상태 (대기 중)
  if (coupleCode) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <h3 className="text-lg font-bold text-white">커플 코드 생성됨</h3>
        </div>

        <p className="text-gray-300 mb-4">
          아래 코드를 상대방에게 공유해주세요
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
            <p className="text-center text-2xl font-bold tracking-wider text-white">
              {coupleCode}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          코드는 24시간 동안 유효합니다
        </p>
      </div>
    );
  }

  // 연결 전 상태
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        <h3 className="text-lg font-bold text-white">커플 연결</h3>
      </div>

      <p className="text-gray-300 mb-6">
        특별한 사람과 장소 일기를 공유해보세요
      </p>

      <div className="space-y-3">
        <button
          onClick={onGenerateCode}
          className="w-full px-4 py-3 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <UserPlus className="w-5 h-5" />
          <span>커플 코드 생성하기</span>
        </button>

        {!showCodeInput ? (
          <button
            onClick={() => setShowCodeInput(true)}
            className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all"
          >
            코드로 연결하기
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="코드 입력 (예: ABC123)"
              maxLength={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] transition-all text-center text-lg tracking-wider"
            />
            <div className="flex gap-2">
              <button
                onClick={handleConnect}
                disabled={inputCode.length !== 6}
                className="flex-1 px-4 py-2 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'var(--gradient-primary)' }}
              >
                연결하기
              </button>
              <button
                onClick={() => {
                  setShowCodeInput(false);
                  setInputCode("");
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
