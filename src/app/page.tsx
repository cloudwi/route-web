"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { PurposeTag, PURPOSE_TAGS } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  User,
  MessageSquare,
  Sparkles,
  Flame,
  Users,
  Globe,
  LogOut,
  Search,
  MapPin,
  Heart,
} from "lucide-react";
import LoginModal from "@/components/features/auth/LoginModal";


// Mock Data
interface MockDiary {
  id: string;
  user: string;
  userId: string;
  friends: number;
  place: string;
  comment: string;
  tag: PurposeTag;
  likes: number;
  comments: number;
  time: string;
  isFriend: boolean;
  image?: string; // 일기 이미지 또는 장소 OG 이미지
}

const MOCK_DIARIES: MockDiary[] = [
  {
    id: '1',
    user: '김민수',
    userId: '1',
    friends: 1234,
    place: '성수동 감성 카페',
    comment: '분위기 너무 좋고 커피도 맛있어요! 사진 찍기 좋은 공간이 많아서 인스타 감성 제대로. 데이트하기 딱 좋은 곳이에요 ✨',
    tag: 'date' as PurposeTag,
    likes: 234,
    comments: 45,
    time: '2시간 전',
    isFriend: false,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // 감성 카페 이미지
  },
  {
    id: '2',
    user: '박지영',
    userId: '2',
    friends: 856,
    place: '강남 고기집',
    comment: '회식 장소로 최고! 고기도 맛있고 룸도 넓어요',
    tag: 'business_meal' as PurposeTag,
    likes: 89,
    comments: 12,
    time: '3시간 전',
    isFriend: true,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', // 고기 이미지
  },
  {
    id: '3',
    user: '이철수',
    userId: '3',
    friends: 2341,
    place: '홍대 칵테일바',
    comment: '친구들과 모임하기 딱. 칵테일 종류 다양해요!',
    tag: 'friends' as PurposeTag,
    likes: 156,
    comments: 23,
    time: '5시간 전',
    isFriend: false,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', // 칵테일 이미지
  },
  {
    id: '4',
    user: '최유리',
    userId: '4',
    friends: 567,
    place: '이태원 맛집',
    comment: '가족들과 함께 가기 좋아요. 음식 맛도 좋고 서비스도 친절해요',
    tag: 'family' as PurposeTag,
    likes: 92,
    comments: 8,
    time: '6시간 전',
    isFriend: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', // 음식 이미지
  },
  {
    id: '5',
    user: '정민지',
    userId: '5',
    friends: 1890,
    place: '북촌 한옥카페',
    comment: '한옥 분위기가 정말 좋아요. 조용해서 혼자 가기도 좋고 데이트하기도 좋아요',
    tag: 'date' as PurposeTag,
    likes: 267,
    comments: 34,
    time: '7시간 전',
    isFriend: false,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80', // 한옥 카페 이미지
  },
  {
    id: '6',
    user: '강태형',
    userId: '6',
    friends: 423,
    place: '강남 회식 장소',
    comment: '팀 회식하기 좋은 곳! 분위기 좋고 가격도 합리적이에요',
    tag: 'business_meal' as PurposeTag,
    likes: 78,
    comments: 15,
    time: '8시간 전',
    isFriend: false,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // 레스토랑 이미지
  },
];

function HomeContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'friends' | 'trending'>('explore');

  // 커플 연결 상태 (Mock - 실제로는 Context나 API에서 가져와야 함)
  const [coupleConnected, setCoupleConnected] = useState(true); // 테스트용 true
  const [partnerName, setPartnerName] = useState<string | undefined>("김지연");

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-2 pb-3 flex items-center justify-between gap-4">
          {/* Logo - Left Side */}
          <button
            onClick={() => router.push("/")}
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/logo.png"
              alt="플레이스 로고"
              className="h-24 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* 폴백 아이콘 (이미지 없을 때) */}
            <div className="hidden rounded-xl shadow-lg" style={{ background: 'var(--gradient-primary)' }}>
              <div className="flex items-center gap-2 px-4 py-2">
                <Sparkles className="w-10 h-10 text-white" />
                <span className="text-3xl font-bold text-white">플레이스</span>
              </div>
            </div>
          </button>

          {/* Header Controls - Right Side */}
          {!isLoading && (
            <div className="backdrop-blur-xl bg-white/5 border border-[var(--primary)]/20 rounded-2xl px-4 py-1.5 shadow-2xl shadow-[var(--primary)]/10">
              <div className="flex items-center gap-3">
                {/* Search Button */}
                <button
                  onClick={() => router.push("/search")}
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all border border-[var(--primary)]/30"
                >
                  <Search className="w-5 h-5" />
                </button>

                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all border border-[var(--primary)]/30"
                    >
                      <User className="w-5 h-5" />
                    </button>

                    {/* User Menu Dropdown */}
                    {isUserMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        {/* Menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-slate-900/95 border border-[var(--primary)]/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
                          <button
                            onClick={() => {
                              router.push("/profile");
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 transition-colors text-left"
                          >
                            <User className="w-5 h-5" />
                            <span className="font-medium">프로필</span>
                          </button>
                          <div className="border-t border-white/20" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--accent)]/20 transition-colors text-left"
                            style={{ color: 'var(--accent)' }}
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">로그아웃</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                    style={{
                      background: 'var(--gradient-primary)',
                      boxShadow: '0 4px 14px 0 rgba(230, 138, 46, 0.25)'
                    }}
                  >
                    <span>로그인</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>


      {/* Diary Feed */}
      <main className="max-w-3xl mx-auto px-4 pt-32 pb-24">
        {/* Couple Not Connected */}
        {isAuthenticated && !coupleConnected && (
          <div className="mb-8 backdrop-blur-xl border rounded-3xl p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              borderColor: 'rgba(236, 72, 153, 0.3)'
            }}
          >
            <div className="mb-6">
              <Heart className="w-16 h-16 mx-auto text-pink-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">아직 연결된 커플이 없어요</h2>
              <p className="text-gray-300">특별한 사람과 장소 일기를 공유해보세요</p>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="px-6 py-3 text-white font-medium rounded-xl transition-all inline-flex items-center gap-2"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Heart className="w-5 h-5" />
              <span>커플 연결하기</span>
            </button>
          </div>
        )}

        {/* Couple Connected - Show Feed */}
        {isAuthenticated && coupleConnected && (
          <>
            {/* Timeline Feed */}
            <div className="space-y-8">
              {MOCK_DIARIES.map((diary, index) => (
            <div
              key={diary.id}
              className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl overflow-hidden hover:border-[var(--primary)]/50 transition-all duration-500 shadow-2xl hover:shadow-[var(--primary)]/20 hover:scale-[1.02] group animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* User Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10 backdrop-blur-sm bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20 group-hover:ring-[var(--primary)]/50 transition-all"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    {diary.user[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{diary.user}</h3>
                    <p className="text-xs text-gray-400">{diary.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Privacy Badge */}
                  <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/30 backdrop-blur-sm font-medium">
                    🔒 Private
                  </span>
                  {!diary.isFriend && (
                    <button
                      onClick={() => console.log('Add friend:', diary.userId)}
                      className="text-xs px-4 py-1.5 rounded-full text-white font-medium transition-all hover:scale-105 shadow-lg"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      친구 추가
                    </button>
                  )}
                </div>
              </div>

              {/* Image */}
              {diary.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/20">
                  <img
                    src={diary.image}
                    alt={diary.place}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Place */}
                <button
                  onClick={() => router.push("/place/1")}
                  className="flex items-center gap-2 text-white hover:gap-3 transition-all group/place"
                >
                  <div className="p-2 rounded-xl bg-white/10 group-hover/place:bg-[var(--primary)]/20 transition-colors">
                    <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="font-bold text-lg group-hover/place:text-[var(--primary)] transition-colors">{diary.place}</span>
                </button>

                {/* Diary Content */}
                <p className="text-gray-200 text-base leading-relaxed">{diary.comment}</p>

                {/* Tag */}
                <div>
                  <span className={`text-xs px-4 py-2 rounded-full ${PURPOSE_TAGS[diary.tag].color} backdrop-blur-sm font-medium inline-flex items-center gap-1.5 shadow-sm`}>
                    <span className="text-base">{PURPOSE_TAGS[diary.tag].emoji}</span>
                    {PURPOSE_TAGS[diary.tag].label}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-8 pt-4 border-t border-white/10">
                  <button
                    onClick={() => console.log('Like:', diary.id)}
                    className="flex items-center gap-2.5 text-gray-300 hover:text-pink-400 transition-all group/like"
                  >
                    <div className="relative">
                      <Heart className="w-6 h-6 group-hover/like:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-pink-400 rounded-full blur-xl opacity-0 group-hover/like:opacity-50 transition-opacity" />
                    </div>
                    <span className="text-sm font-semibold">{diary.likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-gray-300 hover:text-blue-400 transition-all group/comment">
                    <div className="relative">
                      <MessageSquare className="w-6 h-6 group-hover/comment:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-0 group-hover/comment:opacity-50 transition-opacity" />
                    </div>
                    <span className="text-sm font-semibold">{diary.comments}</span>
                  </button>
                </div>
              </div>
            </div>
              ))}
            </div>
          </>
        )}

        {/* Not Authenticated - Show Sample */}
        {!isAuthenticated && (
          <>
            {/* Feed Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">플레이스와 함께</h2>
              <p className="text-gray-400">특별한 사람과 장소 일기를 공유하세요</p>
            </div>

            {/* Sample Feed with Blur */}
            <div className="space-y-6">
              {MOCK_DIARIES.slice(0, 2).map((diary) => (
                <div
                  key={diary.id}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl relative"
                >
                  {/* User Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: 'var(--gradient-primary)' }}
                      >
                        {diary.user[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{diary.user}</h3>
                        <p className="text-xs text-gray-400">{diary.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Image with Blur */}
                  {diary.image && (
                    <div className="relative aspect-[4/3] w-full">
                      <img
                        src={diary.image}
                        alt={diary.place}
                        className="w-full h-full object-cover opacity-40 blur-sm"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="text-center">
                          <Heart className="w-12 h-12 mx-auto text-white mb-3" />
                          <p className="text-white font-bold text-lg">로그인하고 일기를 확인하세요</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blurred Content */}
                  <div className="p-6 opacity-60 blur-sm pointer-events-none">
                    <p className="text-gray-300">일기 내용이 여기에 표시됩니다...</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={openLoginModal}
                className="px-8 py-4 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2 text-lg shadow-2xl"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Heart className="w-6 h-6" />
                <span>시작하기</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Floating Action Button */}
      {!isLoading && isAuthenticated && coupleConnected && (
        <button
          onClick={() => router.push("/write")}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 group"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: '0 8px 32px 0 rgba(230, 138, 46, 0.4)'
          }}
        >
          <svg
            className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-bg)' }}>
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
