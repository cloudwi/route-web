"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { PurposeTag } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  Search,
  User,
  MessageSquare,
  Sparkles,
  Flame,
  Users,
  Globe,
  LogOut,
} from "lucide-react";
import LoginModal from "@/components/features/auth/LoginModal";
import ReviewFeed from "@/components/features/review/ReviewFeed";


// Mock Data
interface MockReview {
  id: string;
  user: string;
  userId: string;
  followers: number;
  place: string;
  rating: number;
  comment: string;
  tag: PurposeTag;
  likes: number;
  comments: number;
  time: string;
  isFollowing: boolean;
  image?: string; // 리뷰 이미지 또는 장소 OG 이미지
}

const MOCK_REVIEWS: MockReview[] = [
  {
    id: '1',
    user: '김민수',
    userId: '1',
    followers: 1234,
    place: '성수동 감성 카페',
    rating: 5,
    comment: '분위기 너무 좋고 커피도 맛있어요! 사진 찍기 좋은 공간이 많아서 인스타 감성 제대로. 데이트하기 딱 좋은 곳이에요 ✨',
    tag: 'date' as PurposeTag,
    likes: 234,
    comments: 45,
    time: '2시간 전',
    isFollowing: false,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80', // 감성 카페 이미지
  },
  {
    id: '2',
    user: '박지영',
    userId: '2',
    followers: 856,
    place: '강남 고기집',
    rating: 4,
    comment: '회식 장소로 최고! 고기도 맛있고 룸도 넓어요',
    tag: 'business_meal' as PurposeTag,
    likes: 89,
    comments: 12,
    time: '3시간 전',
    isFollowing: true,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', // 고기 이미지
  },
  {
    id: '3',
    user: '이철수',
    userId: '3',
    followers: 2341,
    place: '홍대 칵테일바',
    rating: 5,
    comment: '친구들과 모임하기 딱. 칵테일 종류 다양해요!',
    tag: 'friends' as PurposeTag,
    likes: 156,
    comments: 23,
    time: '5시간 전',
    isFollowing: false,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', // 칵테일 이미지
  },
  {
    id: '4',
    user: '최유리',
    userId: '4',
    followers: 567,
    place: '이태원 맛집',
    rating: 4,
    comment: '가족들과 함께 가기 좋아요. 음식 맛도 좋고 서비스도 친절해요',
    tag: 'family' as PurposeTag,
    likes: 92,
    comments: 8,
    time: '6시간 전',
    isFollowing: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', // 음식 이미지
  },
  {
    id: '5',
    user: '정민지',
    userId: '5',
    followers: 1890,
    place: '북촌 한옥카페',
    rating: 5,
    comment: '한옥 분위기가 정말 좋아요. 조용해서 혼자 가기도 좋고 데이트하기도 좋아요',
    tag: 'date' as PurposeTag,
    likes: 267,
    comments: 34,
    time: '7시간 전',
    isFollowing: false,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80', // 한옥 카페 이미지
  },
  {
    id: '6',
    user: '강태형',
    userId: '6',
    followers: 423,
    place: '강남 회식 장소',
    rating: 4,
    comment: '팀 회식하기 좋은 곳! 분위기 좋고 가격도 합리적이에요',
    tag: 'business_meal' as PurposeTag,
    likes: 78,
    comments: 15,
    time: '8시간 전',
    isFollowing: false,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // 레스토랑 이미지
  },
];

function HomeContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'following' | 'trending'>('explore');

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
              {/* 로고 이미지 - public/logo.png 또는 public/images/logo.png */}
              <img
                src="/images/logo.png"
                alt="플레이스 로고"
                className="w-10 h-10 rounded-xl object-contain"
                onError={(e) => {
                  // 이미지 로드 실패 시 폴백 (기본 아이콘)
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* 폴백 아이콘 (이미지 없을 때) */}
              <div className="hidden w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-lg">
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">플레이스</h1>
                <p className="text-xs text-gray-400">장소 리뷰 공유</p>
              </div>
            </div>

            {!isLoading && (
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl transition-all border border-white/20"
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
                        <div className="absolute right-0 top-full mt-2 w-48 backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden">
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
                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/20 transition-colors text-left"
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
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all"
                  >
                    <span>로그인</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <section className="px-4 pt-32 pb-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-1.5 inline-flex gap-1 shadow-xl">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>둘러보기</span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'following'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>팔로잉</span>
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'trending'
                  ? 'bg-white text-slate-900'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>인기</span>
            </button>
          </div>
        </div>
      </section>

      {/* Review Feed */}
      <main className="max-w-7xl mx-auto px-4 pb-24">
        <ReviewFeed
          reviews={MOCK_REVIEWS}
          onLike={(id) => console.log('Liked review:', id)}
          onFollow={(userId) => console.log('Followed user:', userId)}
          onPlaceClick={(place) => console.log('Clicked place:', place)}
        />
      </main>

      {/* Floating Action Button */}
      {!isLoading && isAuthenticated && (
        <button
          onClick={() => router.push("/search")}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-violet-500/50 hover:scale-110 transition-all z-50"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
