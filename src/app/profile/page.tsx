"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/api";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  Settings,
  MapPin,
  Heart,
  MessageSquare,
  Sun,
  Moon,
} from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag } from "@/types";
import CoupleConnection from "@/components/features/couple/CoupleConnection";

// Mock user data
const MOCK_USER = {
  id: "user123",
  name: "김민수",
  email: "minsu@example.com",
  profileImage: "",
  bio: "장소 기록을 좋아하는 일기 작가입니다 🍜",
  diaryCount: 89,
};

// Mock diaries
const MOCK_USER_DIARIES = [
  {
    id: "1",
    placeName: "성수동 감성 카페",
    content: "분위기 너무 좋고 커피도 맛있어요! 사진 찍기 좋은 공간이 많아서 인스타 감성 제대로.",
    purposeTags: ["date" as PurposeTag],
    likesCount: 234,
    commentsCount: 45,
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    placeName: "강남 고기집",
    content: "회식 장소로 최고! 고기도 맛있고 룸도 넓어요",
    purposeTags: ["business_meal" as PurposeTag],
    likesCount: 89,
    commentsCount: 12,
    createdAt: "2024-01-18",
  },
  {
    id: "3",
    placeName: "북촌 한옥카페",
    content: "한옥 분위기가 정말 좋아요. 조용해서 혼자 가기도 좋고 데이트하기도 좋아요",
    purposeTags: ["date" as PurposeTag, "alone" as PurposeTag],
    likesCount: 267,
    commentsCount: 34,
    createdAt: "2024-01-15",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);

  // 커플 연결 상태 (Mock)
  const [coupleConnected, setCoupleConnected] = useState(false);
  const [coupleCode, setCoupleCode] = useState<string | undefined>(undefined);
  const [partnerName, setPartnerName] = useState<string | undefined>(undefined);

  const handleGenerateCode = async () => {
    try {
      // TODO: 실제 API 호출로 변경
      // const response = await api.post('/api/v1/couple/generate-code');
      // setCoupleCode(response.code);

      // Mock: 6자리 랜덤 코드 생성
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCoupleCode(code);
    } catch (error) {
      console.error("커플 코드 생성 실패:", error);
      alert("커플 코드 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleConnectWithCode = async (code: string) => {
    try {
      // TODO: 실제 API 호출로 변경
      // const response = await api.post('/api/v1/couple/connect', { code });
      // setCoupleConnected(true);
      // setPartnerName(response.partnerName);
      // setCoupleCode(undefined);

      // Mock: 코드로 연결 (실제로는 API 호출)
      if (code === "TEST12" || code.length === 6) {
        setCoupleConnected(true);
        setPartnerName("김지연");
        setCoupleCode(undefined);
        alert("커플 연결이 완료되었습니다!");
      } else {
        alert("유효하지 않은 코드입니다.");
      }
    } catch (error) {
      console.error("커플 연결 실패:", error);
      alert("커플 연결에 실패했습니다. 코드를 확인해주세요.");
    }
  };

  const handleDisconnect = async () => {
    if (confirm("정말 커플 연결을 해제하시겠어요?")) {
      try {
        // TODO: 실제 API 호출로 변경
        // await api.delete('/api/v1/couple/disconnect');

        // Mock: 연결 해제
        setCoupleConnected(false);
        setPartnerName(undefined);
        setCoupleCode(undefined);
      } catch (error) {
        console.error("커플 연결 해제 실패:", error);
        alert("커플 연결 해제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/");
      return;
    }
    setLoggedIn(true);
  }, [router]);

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg" style={{ background: 'var(--bg-overlay)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-4xl mx-auto px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">뒤로</span>
          </button>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>프로필</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              aria-label="테마 변경"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="p-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-24">
        {/* Couple Connection Section */}
        <div className="mb-6">
          <CoupleConnection
            isConnected={coupleConnected}
            coupleCode={coupleCode}
            partnerName={partnerName}
            onGenerateCode={handleGenerateCode}
            onConnectWithCode={handleConnectWithCode}
            onDisconnect={handleDisconnect}
          />
        </div>

        <div className="backdrop-blur-xl rounded-3xl p-8 mb-6"
          style={{
            background: 'var(--gradient-warm)',
            border: '1px solid var(--border-soft)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {/* Profile Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-md)' }}
            >
              {MOCK_USER.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{MOCK_USER.name}</h2>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{MOCK_USER.bio}</p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{MOCK_USER.diaryCount}</div>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>일기</div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full px-4 py-3 backdrop-blur-sm rounded-xl font-medium transition-all"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
          >
            프로필 수정
          </button>
        </div>

        {/* Diaries */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            내 일기
          </h3>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {MOCK_USER_DIARIES.map((diary) => (
              <div
                key={diary.id}
                className="backdrop-blur-xl rounded-3xl p-6 transition-all cursor-pointer"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.borderColor = 'var(--border-soft)';
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{diary.placeName}</h3>
                </div>

                <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>{diary.content}</p>

                <div className="flex items-center gap-2 mb-4">
                  {diary.purposeTags.map((tag) => {
                    const purposeTag = PURPOSE_TAGS[tag];
                    return (
                      <span
                        key={tag}
                        className={`text-xs px-3 py-1 rounded-full ${purposeTag.color}`}
                      >
                        {purposeTag.emoji} {purposeTag.label}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 text-sm pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
                  <button
                    className="flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{diary.likesCount}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{diary.commentsCount}</span>
                  </button>
                  <span className="ml-auto" style={{ color: 'var(--text-tertiary)' }}>{diary.createdAt}</span>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
