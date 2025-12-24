"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Heart,
  Share2,
  MessageSquare,
  Phone,
  ExternalLink,
  Clock,
  Navigation,
} from "lucide-react";
import { PURPOSE_TAGS, type PurposeTag, type Review } from "@/types";
import ReviewWriteModal from "@/components/features/review/ReviewWriteModal";

// Mock place data
const MOCK_PLACE = {
  id: "1",
  name: "성수동 감성 카페",
  category: "카페,디저트",
  address: "서울시 성동구 성수동 123-45",
  roadAddress: "서울시 성동구 아차산로 123",
  telephone: "02-1234-5678",
  lat: 37.5447,
  lng: 127.0557,
  naverMapUrl: "https://map.naver.com/place/123456",
  averageRating: 4.8,
  reviewCount: 234,
  likesCount: 156,
  isLiked: false,
};

// Mock reviews for this place
const MOCK_PLACE_REVIEWS: Review[] = [
  {
    id: "1",
    placeId: "1",
    placeName: "성수동 감성 카페",
    userId: "user1",
    userName: "김민수",
    userProfileImage: "",
    rating: 5,
    content: "분위기 너무 좋고 커피도 맛있어요! 사진 찍기 좋은 공간이 많아서 인스타 감성 제대로. 데이트하기 딱 좋은 곳이에요 ✨",
    photos: [],
    purposeTags: ["date" as PurposeTag],
    visibility: "public",
    visitedWith: "partner",
    visitDate: "2024-01-20",
    likesCount: 234,
    commentsCount: 45,
    isLiked: false,
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    placeId: "1",
    placeName: "성수동 감성 카페",
    userId: "user2",
    userName: "박지영",
    userProfileImage: "",
    rating: 4,
    content: "혼자 가기도 좋은 곳. 조용하고 와이파이도 빨라요. 작업하기 좋아요!",
    photos: [],
    purposeTags: ["alone" as PurposeTag],
    visibility: "public",
    visitedWith: "alone",
    visitDate: "2024-01-18",
    likesCount: 89,
    commentsCount: 12,
    isLiked: false,
    createdAt: "2024-01-18T14:30:00Z",
  },
  {
    id: "3",
    placeId: "1",
    placeName: "성수동 감성 카페",
    userId: "user3",
    userName: "이철수",
    userProfileImage: "",
    rating: 5,
    content: "친구들과 모임하기 좋아요. 공간이 넓어서 단체로 가기에도 부담 없어요!",
    photos: [],
    purposeTags: ["friends" as PurposeTag],
    visibility: "public",
    visitedWith: "friends",
    visitDate: "2024-01-15",
    likesCount: 156,
    commentsCount: 23,
    isLiked: true,
    createdAt: "2024-01-15T16:00:00Z",
  },
];

export default function PlaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [place, setPlace] = useState(MOCK_PLACE);
  const [reviews, setReviews] = useState(MOCK_PLACE_REVIEWS);
  const [isLiked, setIsLiked] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setPlace((prev) => ({
      ...prev,
      likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `${place.name} - ${place.category}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <ReviewWriteModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        placeName={place.name}
        placeId={place.id}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b" style={{ borderColor: 'rgba(230, 138, 46, 0.2)' }}>
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">뒤로</span>
          </button>
          <h1 className="text-lg font-bold text-white truncate max-w-xs">{place.name}</h1>
          <button
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 lg:px-8 pt-24 pb-24">
        {/* Place Info Card */}
        <div className="backdrop-blur-xl border rounded-3xl p-8 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(230, 138, 46, 0.15) 0%, rgba(200, 30, 50, 0.15) 100%)',
            borderColor: 'rgba(230, 138, 46, 0.3)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{place.name}</h2>
              <span className="inline-block px-3 py-1 rounded-full text-sm mb-3"
                style={{
                  backgroundColor: 'rgba(230, 138, 46, 0.2)',
                  borderColor: 'rgba(230, 138, 46, 0.3)',
                  color: 'var(--primary-light)',
                  border: '1px solid'
                }}
              >
                {place.category}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(place.averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-white">{place.averageRating}</span>
            <span className="text-gray-400">({place.reviewCount}개의 리뷰)</span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleLike}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                isLiked
                  ? "text-white"
                  : "bg-white/10 hover:bg-white/20 text-white border"
              }`}
              style={isLiked ? { background: 'var(--accent)' } : { borderColor: 'rgba(230, 138, 46, 0.3)' }}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
              <span>{isLiked ? "좋아요 취소" : "좋아요"} ({place.likesCount})</span>
            </button>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <MessageSquare className="w-5 h-5" />
              <span>일기 작성</span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-white">{place.roadAddress}</p>
                <p className="text-gray-400 text-sm">{place.address}</p>
              </div>
            </div>
            {place.telephone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href={`tel:${place.telephone}`} className="text-white transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  {place.telephone}
                </a>
              </div>
            )}
            {place.naverMapUrl && (
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-gray-400" />
                <a
                  href={place.naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors"
                  style={{ color: 'var(--primary-light)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-light)'}
                >
                  <span>네이버 지도에서 보기</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white">일기 ({reviews.length})</h3>
            <button className="text-sm transition-colors"
              style={{ color: 'var(--primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-light)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary)'}
            >
              최신순
            </button>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-white/20 rounded-3xl p-6 transition-all"
              >
                {/* Reviewer Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      {review.userName?.[0] || "?"}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{review.userName}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
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

                {/* Purpose Tags */}
                <div className="flex items-center gap-2 mb-3">
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

                {/* Review Content */}
                <p className="text-gray-300 mb-4">{review.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    className="flex items-center gap-2 text-gray-400 transition-colors"
                    onMouseEnter={(e) => {
                      if (!review.isLiked) e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      if (!review.isLiked) e.currentTarget.style.color = 'rgb(156, 163, 175)';
                    }}
                  >
                    <Heart className={`w-4 h-4 ${review.isLiked ? "fill-[var(--accent)]" : ""}`}
                      style={review.isLiked ? { color: 'var(--accent)' } : {}}
                    />
                    <span className="text-sm">{review.likesCount}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-gray-400 transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{review.commentsCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Review Button */}
      <button
        onClick={() => setIsReviewModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: '0 8px 32px 0 rgba(230, 138, 46, 0.4)'
        }}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
