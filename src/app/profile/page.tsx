"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/api";
import {
  ArrowLeft,
  Settings,
  MapPin,
  Heart,
  MessageSquare,
  Users,
  UserMinus,
  UserPlus,
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
  friendsCount: 1234,
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

// Mock friends
const MOCK_FRIENDS = [
  { id: "1", name: "박지영", friends: 856, isFriend: true },
  { id: "2", name: "이철수", friends: 2341, isFriend: true },
  { id: "3", name: "최유리", friends: 567, isFriend: true },
  { id: "4", name: "정민지", friends: 1890, isFriend: true },
  { id: "5", name: "강태형", friends: 423, isFriend: true },
  { id: "6", name: "김하늘", friends: 1123, isFriend: true },
  { id: "7", name: "송미래", friends: 789, isFriend: true },
];

export default function ProfilePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"diaries" | "friends">("diaries");

  // 커플 연결 상태 (Mock)
  const [coupleConnected, setCoupleConnected] = useState(false);
  const [coupleCode, setCoupleCode] = useState<string | undefined>(undefined);
  const [partnerName, setPartnerName] = useState<string | undefined>(undefined);

  const handleGenerateCode = () => {
    // 6자리 랜덤 코드 생성
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCoupleCode(code);
  };

  const handleConnectWithCode = (code: string) => {
    // Mock: 코드로 연결 (실제로는 API 호출)
    if (code === "TEST12") {
      setCoupleConnected(true);
      setPartnerName("김지연");
      setCoupleCode(undefined);
      alert("커플 연결이 완료되었습니다!");
    } else {
      alert("유효하지 않은 코드입니다.");
    }
  };

  const handleDisconnect = () => {
    if (confirm("정말 커플 연결을 해제하시겠어요?")) {
      setCoupleConnected(false);
      setPartnerName(undefined);
      setCoupleCode(undefined);
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
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b" style={{ borderColor: 'rgba(230, 138, 46, 0.2)' }}>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">뒤로</span>
          </button>
          <h1 className="text-lg font-bold text-white">프로필</h1>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pt-24 pb-24">
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

        <div className="backdrop-blur-xl border rounded-3xl p-8 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(230, 138, 46, 0.15) 0%, rgba(200, 30, 50, 0.15) 100%)',
            borderColor: 'rgba(230, 138, 46, 0.3)'
          }}
        >
          {/* Profile Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {MOCK_USER.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{MOCK_USER.name}</h2>
              <p className="text-gray-300 mb-4">{MOCK_USER.bio}</p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab("diaries")}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="text-xl font-bold text-white">{MOCK_USER.diaryCount}</div>
                  <div className="text-sm text-gray-400">일기</div>
                </button>
                <button
                  onClick={() => setActiveTab("friends")}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="text-xl font-bold text-white">{MOCK_USER.friendsCount}</div>
                  <div className="text-sm text-gray-400">친구</div>
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border rounded-xl text-white font-medium transition-all"
            style={{ borderColor: 'rgba(230, 138, 46, 0.3)' }}
          >
            프로필 수정
          </button>
        </div>

        {/* Tabs */}
        <div className="backdrop-blur-xl bg-white/5 border rounded-xl p-1.5 inline-flex gap-1 mb-6"
          style={{ borderColor: 'rgba(230, 138, 46, 0.2)' }}
        >
          <button
            onClick={() => setActiveTab("diaries")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "diaries"
                ? "text-white"
                : "text-gray-400 hover:bg-white/10"
            }`}
            style={activeTab === "diaries" ? { background: 'var(--gradient-primary)' } : {}}
          >
            <MessageSquare className="w-4 h-4" />
            <span>일기</span>
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "friends"
                ? "text-white"
                : "text-gray-400 hover:bg-white/10"
            }`}
            style={activeTab === "friends" ? { background: 'var(--gradient-primary)' } : {}}
          >
            <Users className="w-4 h-4" />
            <span>친구</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "diaries" && (
          <div className="space-y-4">
            {MOCK_USER_DIARIES.map((diary) => (
              <div
                key={diary.id}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/20 rounded-3xl p-6 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <h3 className="font-bold text-white">{diary.placeName}</h3>
                </div>

                <p className="text-gray-300 mb-3">{diary.content}</p>

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

                <div className="flex items-center gap-4 text-sm pt-4 border-t border-white/10">
                  <button
                    className="flex items-center gap-2 text-gray-400 transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{diary.likesCount}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-gray-400 transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{diary.commentsCount}</span>
                  </button>
                  <span className="ml-auto text-gray-500">{diary.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "friends" && (
          <div className="space-y-3">
            {MOCK_FRIENDS.map((user) => (
              <div
                key={user.id}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{user.name}</h4>
                    <p className="text-sm text-gray-400">친구 {user.friends.toLocaleString()}명</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border rounded-xl text-white font-medium transition-all"
                  style={{ borderColor: 'rgba(230, 138, 46, 0.3)' }}
                >
                  <UserMinus className="w-4 h-4" />
                  <span>친구</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
