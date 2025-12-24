"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { PurposeTag, PURPOSE_TAGS } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Loader2,
  User,
  MessageSquare,
  Sparkles,
  LogOut,
  Search,
  MapPin,
  Heart,
  Sun,
  Moon,
  List,
  Calendar as CalendarIcon,
} from "lucide-react";
import LoginModal from "@/components/features/auth/LoginModal";
import Calendar from "@/components/features/calendar/Calendar";


// Mock Data - 커플 전용 (나와 파트너의 일기만)
interface MockDiary {
  id: string;
  user: string;
  userId: string;
  place: string;
  comment: string;
  tag: PurposeTag;
  likes: number;
  comments: number;
  time: string;
  isMe: boolean;
  image?: string;
}

const CURRENT_USER_ID = 'currentUser';
const CURRENT_USER_NAME = '김민수';
const PARTNER_USER_ID = 'partner';
const PARTNER_USER_NAME = '김지연';

// Helper function to convert relative time to date
const getDateFromTime = (time: string): string => {
  const now = new Date();
  if (time.includes('시간 전')) {
    const hours = parseInt(time);
    now.setHours(now.getHours() - hours);
  } else if (time.includes('일 전')) {
    const days = parseInt(time);
    now.setDate(now.getDate() - days);
  }
  return now.toISOString().split('T')[0];
};

const MOCK_COUPLE_DIARIES: MockDiary[] = [
  {
    id: '1',
    user: CURRENT_USER_NAME,
    userId: CURRENT_USER_ID,
    place: '성수동 감성 카페',
    comment: '오늘 여기서 데이트했는데 분위기 너무 좋았어 ☕️ 사진도 예쁘게 나와서 기분 좋은 하루였어!',
    tag: 'date' as PurposeTag,
    likes: 1,
    comments: 1,
    time: '2시간 전',
    isMe: true,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
  },
  {
    id: '2',
    user: PARTNER_USER_NAME,
    userId: PARTNER_USER_ID,
    place: '한강공원',
    comment: '오늘 날씨 좋아서 한강 나들이 💙 산책하면서 힐링했어. 다음엔 같이 가자!',
    tag: 'date' as PurposeTag,
    likes: 1,
    comments: 0,
    time: '5시간 전',
    isMe: false,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    id: '3',
    user: CURRENT_USER_NAME,
    userId: CURRENT_USER_ID,
    place: '이태원 맛집',
    comment: '가족 모임 장소로 완벽했어. 다들 음식이 맛있다고 좋아하셨어 🍽️',
    tag: 'family' as PurposeTag,
    likes: 1,
    comments: 2,
    time: '1일 전',
    isMe: true,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  },
  {
    id: '4',
    user: PARTNER_USER_NAME,
    userId: PARTNER_USER_ID,
    place: '북촌 한옥카페',
    comment: '한옥 카페 분위기 너무 좋다 ✨ 조용하고 차 마시기 딱이야. 여기서 책 읽으면서 여유로운 시간 보냈어~',
    tag: 'alone' as PurposeTag,
    likes: 1,
    comments: 1,
    time: '1일 전',
    isMe: false,
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80',
  },
  {
    id: '5',
    user: CURRENT_USER_NAME,
    userId: CURRENT_USER_ID,
    place: '강남 이탈리안 레스토랑',
    comment: '팀 회식 장소로 선택했는데 대박이었어! 다들 만족해서 뿌듯 😊',
    tag: 'business_meal' as PurposeTag,
    likes: 1,
    comments: 0,
    time: '2일 전',
    isMe: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  },
  {
    id: '6',
    user: PARTNER_USER_NAME,
    userId: PARTNER_USER_ID,
    place: '홍대 브런치 카페',
    comment: '친구들이랑 브런치 먹으러 왔어 🥞 메뉴도 다양하고 맛있어서 좋았어!',
    tag: 'friends' as PurposeTag,
    likes: 1,
    comments: 1,
    time: '3일 전',
    isMe: false,
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80',
  },
];

function HomeContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'feed' | 'calendar'>('feed');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [coupleConnected, setCoupleConnected] = useState(true);
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

      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg" style={{ background: 'var(--bg-overlay)' }}>
        <div className="px-6 py-1 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
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
            <div className="hidden items-center gap-2">
              <Sparkles className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>플레이스</span>
            </div>
          </button>

          {/* Actions */}
          {!isLoading && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/search")}
                className="p-2.5 rounded-xl transition-all"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl transition-all"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                aria-label="테마 변경"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2.5 rounded-xl transition-all"
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-card-hover)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div
                        className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden z-50"
                        style={{
                          background: 'var(--bg-overlay)',
                          border: '1px solid var(--border-soft)',
                          boxShadow: 'var(--shadow-lg)'
                        }}
                      >
                        <button
                          onClick={() => {
                            router.push("/profile");
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                          style={{ color: 'var(--text-primary)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">프로필</span>
                        </button>
                        <div style={{ borderTop: '1px solid var(--border-soft)' }} />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                          style={{ color: 'var(--accent)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                  className="px-5 py-2.5 text-white font-medium rounded-xl transition-all"
                  style={{
                    background: 'var(--gradient-primary)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  로그인
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pt-32 pb-24">
        {/* Couple Not Connected */}
        {isAuthenticated && !coupleConnected && (
          <div
            className="mb-8 rounded-3xl p-10 text-center"
            style={{
              background: 'var(--gradient-warm)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Heart className="w-14 h-14 mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              아직 연결된 커플이 없어요
            </h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              특별한 사람과 장소 일기를 공유해보세요
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="px-6 py-3 text-white font-medium rounded-xl transition-all inline-flex items-center gap-2"
              style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-md)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Heart className="w-5 h-5" />
              <span>커플 연결하기</span>
            </button>
          </div>
        )}

        {/* Couple Connected - View Toggle */}
        {isAuthenticated && coupleConnected && (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setViewMode('feed')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all"
              style={viewMode === 'feed' ? {
                background: 'var(--gradient-primary)',
                color: '#ffffff',
                boxShadow: 'var(--shadow-md)'
              } : {
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-soft)'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'feed') {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'feed') {
                  e.currentTarget.style.background = 'var(--bg-card)';
                }
              }}
            >
              <List className="w-4 h-4" />
              <span>피드</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all"
              style={viewMode === 'calendar' ? {
                background: 'var(--gradient-primary)',
                color: '#ffffff',
                boxShadow: 'var(--shadow-md)'
              } : {
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-soft)'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'calendar') {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'calendar') {
                  e.currentTarget.style.background = 'var(--bg-card)';
                }
              }}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>달력</span>
            </button>
          </div>
        )}

        {/* Couple Connected - Feed View */}
        {isAuthenticated && coupleConnected && viewMode === 'feed' && (
          <div className="space-y-6">
            {MOCK_COUPLE_DIARIES.map((diary) => (
              <article
                key={diary.id}
                className="rounded-3xl overflow-hidden transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                  boxShadow: 'var(--shadow-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-soft)';
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      {diary.user[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{diary.user}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{diary.time}</p>
                    </div>
                  </div>
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: 'var(--gradient-warm)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-soft)'
                    }}
                  >
                    🔒 Private
                  </span>
                </div>

                {/* Image */}
                {diary.image && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/10">
                    <img
                      src={diary.image}
                      alt={diary.place}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Place */}
                  <button
                    onClick={() => router.push("/place/1")}
                    className="flex items-center gap-2.5 group"
                  >
                    <div className="p-2 rounded-lg transition-colors" style={{ background: 'var(--bg-card)' }}>
                      <MapPin className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    </div>
                    <span className="font-bold text-lg transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {diary.place}
                    </span>
                  </button>

                  {/* Comment */}
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {diary.comment}
                  </p>

                  {/* Tag */}
                  <div>
                    <span
                      className={`text-xs px-4 py-2 rounded-full ${PURPOSE_TAGS[diary.tag].color} font-medium inline-flex items-center gap-1.5`}
                    >
                      <span>{PURPOSE_TAGS[diary.tag].emoji}</span>
                      {PURPOSE_TAGS[diary.tag].label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-6 pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
                    <button
                      onClick={() => console.log('Like:', diary.id)}
                      className="flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{diary.likes}</span>
                    </button>
                    <button
                      className="flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-sm font-medium">{diary.comments}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Couple Connected - Calendar View */}
        {isAuthenticated && coupleConnected && viewMode === 'calendar' && (
          <div className="space-y-6">
            <Calendar
              diaries={MOCK_COUPLE_DIARIES.map(diary => ({
                id: diary.id,
                date: getDateFromTime(diary.time),
                user: diary.user,
                place: diary.place,
                comment: diary.comment,
                image: diary.image
              }))}
              onDateClick={(date) => {
                setSelectedDate(date);
                setViewMode('feed');
              }}
            />

            {selectedDate && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {selectedDate} 일기
                </h3>
                {MOCK_COUPLE_DIARIES
                  .filter(diary => getDateFromTime(diary.time) === selectedDate)
                  .map((diary) => (
                    <article
                      key={diary.id}
                      className="rounded-3xl overflow-hidden transition-all"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-soft)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div className="p-6">
                        <h4 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                          {diary.place}
                        </h4>
                        <p style={{ color: 'var(--text-secondary)' }}>{diary.comment}</p>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Not Authenticated */}
        {!isAuthenticated && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center py-12">
              <div className="inline-block mb-6 px-4 py-2 rounded-full" style={{ background: 'var(--gradient-warm)', border: '1px solid var(--border-soft)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>💕 커플 전용 프라이빗 일기</span>
              </div>
              <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                우리만의 특별한 순간을
                <br />
                <span style={{
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  장소와 함께 기록하세요
                </span>
              </h1>
              <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                플레이스는 소중한 사람과 함께 방문한 장소의 추억을
                <br />
                아름답게 기록하고 공유하는 커플 전용 일기 서비스입니다
              </p>
              <button
                onClick={openLoginModal}
                className="px-10 py-5 text-white font-bold rounded-2xl transition-all inline-flex items-center gap-3 text-lg"
                style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-lg)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <Heart className="w-6 h-6" />
                <span>무료로 시작하기</span>
              </button>
            </div>

            {/* Features Section */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                플레이스만의 특별함
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div
                  className="rounded-3xl p-8 transition-all"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--gradient-primary)' }}>
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    장소 중심 일기
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    함께 방문한 장소를 중심으로 추억을 기록하세요. 사진과 함께 특별했던 순간들을 생생하게 남길 수 있어요.
                  </p>
                </div>

                {/* Feature 2 */}
                <div
                  className="rounded-3xl p-8 transition-all"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--gradient-warm)' }}>
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    완전한 프라이버시
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    오직 둘만 볼 수 있는 프라이빗 공간. 다른 사람의 눈치 없이 자유롭게 우리만의 이야기를 나눠보세요.
                  </p>
                </div>

                {/* Feature 3 */}
                <div
                  className="rounded-3xl p-8 transition-all"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <CalendarIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    캘린더로 한눈에
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    달력 뷰로 우리의 추억을 한눈에 확인하세요. 날짜별로 정리된 일기를 쉽게 찾아볼 수 있어요.
                  </p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                이렇게 사용해요
              </h2>
              <div className="space-y-6">
                {/* Step 1 */}
                <div
                  className="rounded-3xl p-8 flex items-start gap-6"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)'
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      커플 연결하기
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      회원가입 후 상대방과 연결하면 우리만의 프라이빗 공간이 만들어져요.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className="rounded-3xl p-8 flex items-start gap-6"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)'
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      장소 일기 작성
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      함께 방문한 장소를 선택하고, 사진과 함께 그날의 이야기를 자유롭게 기록해보세요.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  className="rounded-3xl p-8 flex items-start gap-6"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)'
                  }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      추억 공유하기
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      서로의 일기를 보고 댓글과 하트로 소통하며, 달력으로 쌓여가는 추억을 확인하세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Preview */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                이런 모습이에요
              </h2>
              {MOCK_COUPLE_DIARIES.slice(0, 2).map((diary) => (
                <div
                  key={diary.id}
                  className="rounded-3xl overflow-hidden relative"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-soft)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div className="opacity-40 blur-sm pointer-events-none">
                    <div className="flex items-center gap-3 p-5">
                      <div className="w-11 h-11 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
                      <div className="flex-1">
                        <div className="h-4 rounded" style={{ background: 'var(--bg-card)', width: '100px' }} />
                      </div>
                    </div>
                    {diary.image && (
                      <div className="aspect-[16/10] w-full">
                        <img src={diary.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="h-4 rounded mb-2" style={{ background: 'var(--bg-card)' }} />
                      <div className="h-4 rounded" style={{ background: 'var(--bg-card)', width: '60%' }} />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--bg-overlay)' }}>
                    <div className="text-center">
                      <Heart className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--primary)' }} />
                      <p className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        로그인하고 일기를 확인하세요
                      </p>
                      <button
                        onClick={openLoginModal}
                        className="px-6 py-3 text-white font-medium rounded-xl transition-all inline-flex items-center gap-2"
                        style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-md)' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <span>시작하기</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div
              className="rounded-3xl p-12 text-center"
              style={{
                background: 'var(--gradient-warm)',
                border: '1px solid var(--border-medium)'
              }}
            >
              <Heart className="w-16 h-16 mx-auto mb-6" style={{ color: 'var(--accent)' }} />
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                지금 바로 시작하세요
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                특별한 사람과 함께하는 순간들을 플레이스에 기록해보세요.
                <br />
                무료로 시작할 수 있어요!
              </p>
              <button
                onClick={openLoginModal}
                className="px-10 py-5 text-white font-bold rounded-2xl transition-all inline-flex items-center gap-3 text-lg"
                style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-lg)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <Heart className="w-6 h-6" />
                <span>무료로 시작하기</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Write Button */}
      {!isLoading && isAuthenticated && coupleConnected && (
        <button
          onClick={() => router.push("/write")}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all z-50"
          style={{
            background: 'var(--gradient-primary)',
            boxShadow: 'var(--shadow-lg)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg
            className="w-6 h-6 text-white"
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