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
  Star,
  Users,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag } from "@/types";

// Mock user data
const MOCK_USER = {
  id: "user123",
  name: "김민수",
  email: "minsu@example.com",
  profileImage: "",
  bio: "맛집 탐방을 좋아하는 직장인입니다 🍜",
  followersCount: 1234,
  followingCount: 567,
  reviewCount: 89,
};

// Mock reviews
const MOCK_USER_REVIEWS = [
  {
    id: "1",
    placeName: "성수동 감성 카페",
    rating: 5,
    content: "분위기 너무 좋고 커피도 맛있어요! 사진 찍기 좋은 공간이 많아서 인스타 감성 제대로.",
    purposeTags: ["date" as PurposeTag],
    likesCount: 234,
    commentsCount: 45,
    createdAt: "2024-01-20",
  },
  {
    id: "2",
    placeName: "강남 고기집",
    rating: 4,
    content: "회식 장소로 최고! 고기도 맛있고 룸도 넓어요",
    purposeTags: ["business_meal" as PurposeTag],
    likesCount: 89,
    commentsCount: 12,
    createdAt: "2024-01-18",
  },
  {
    id: "3",
    placeName: "북촌 한옥카페",
    rating: 5,
    content: "한옥 분위기가 정말 좋아요. 조용해서 혼자 가기도 좋고 데이트하기도 좋아요",
    purposeTags: ["date" as PurposeTag, "alone" as PurposeTag],
    likesCount: 267,
    commentsCount: 34,
    createdAt: "2024-01-15",
  },
];

// Mock followers/following
const MOCK_FOLLOWERS = [
  { id: "1", name: "박지영", followers: 856, isFollowing: true },
  { id: "2", name: "이철수", followers: 2341, isFollowing: false },
  { id: "3", name: "최유리", followers: 567, isFollowing: true },
  { id: "4", name: "정민지", followers: 1890, isFollowing: false },
];

const MOCK_FOLLOWING = [
  { id: "5", name: "강태형", followers: 423, isFollowing: true },
  { id: "6", name: "김하늘", followers: 1123, isFollowing: true },
  { id: "7", name: "송미래", followers: 789, isFollowing: true },
];

export default function ProfilePage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "followers" | "following">("reviews");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10">
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
        <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/20 rounded-3xl p-8 mb-6">
          {/* Profile Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {MOCK_USER.name[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{MOCK_USER.name}</h2>
              <p className="text-gray-300 mb-4">{MOCK_USER.bio}</p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="text-xl font-bold text-white">{MOCK_USER.reviewCount}</div>
                  <div className="text-sm text-gray-400">리뷰</div>
                </button>
                <button
                  onClick={() => setActiveTab("followers")}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="text-xl font-bold text-white">{MOCK_USER.followersCount}</div>
                  <div className="text-sm text-gray-400">팔로워</div>
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <div className="text-xl font-bold text-white">{MOCK_USER.followingCount}</div>
                  <div className="text-sm text-gray-400">팔로잉</div>
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium transition-all">
            프로필 수정
          </button>
        </div>

        {/* Tabs */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-1.5 inline-flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "reviews"
                ? "bg-white text-slate-900"
                : "text-white hover:bg-white/10"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>리뷰</span>
          </button>
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "followers"
                ? "bg-white text-slate-900"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>팔로워</span>
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "following"
                ? "bg-white text-slate-900"
                : "text-white hover:bg-white/10"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>팔로잉</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {MOCK_USER_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/20 rounded-3xl p-6 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-400" />
                    <h3 className="font-bold text-white">{review.placeName}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-300 mb-3">{review.content}</p>

                <div className="flex items-center gap-2 mb-4">
                  {review.purposeTags.map((tag) => {
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
                  <button className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{review.likesCount}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{review.commentsCount}</span>
                  </button>
                  <span className="ml-auto text-gray-500">{review.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "followers" && (
          <div className="space-y-3">
            {MOCK_FOLLOWERS.map((user) => (
              <div
                key={user.id}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{user.name}</h4>
                    <p className="text-sm text-gray-400">팔로워 {user.followers.toLocaleString()}명</p>
                  </div>
                </div>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    user.isFollowing
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      : "bg-violet-500 hover:bg-violet-600 text-white"
                  }`}
                >
                  {user.isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      <span>팔로잉</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>팔로우</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "following" && (
          <div className="space-y-3">
            {MOCK_FOLLOWING.map((user) => (
              <div
                key={user.id}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{user.name}</h4>
                    <p className="text-sm text-gray-400">팔로워 {user.followers.toLocaleString()}명</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all">
                  <UserMinus className="w-4 h-4" />
                  <span>팔로잉</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
