// 도메인 모델 타입들

export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category?: string;
  telephone?: string;
  roadAddress?: string | null;
  naverMapUrl?: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface PopularPlace {
  id: string;
  naverPlaceId: string;
  name: string;
  address: string;
  roadAddress?: string | null;
  lat: number;
  lng: number;
  category?: string;
  telephone?: string;
  naverMapUrl?: string;
  viewsCount: number;
  likesCount: number;
  popularityScore: number;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  places: Place[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  reviewCount?: number;
  isFollowing?: boolean; // 현재 사용자가 이 유저를 팔로우하는지
}

// 팔로우 관계
export interface Follow {
  id: string;
  followerId: string; // 팔로우하는 사람
  followingId: string; // 팔로우되는 사람
  createdAt: string;
}

// 용도 태그 타입
export type PurposeTag = 'date' | 'business_meal' | 'gathering' | 'alone' | 'family' | 'friends';

export const PURPOSE_TAGS: Record<PurposeTag, { label: string; emoji: string; color: string }> = {
  date: { label: '데이트', emoji: '💕', color: 'bg-pink-100 text-pink-600' },
  business_meal: { label: '회식', emoji: '🍻', color: 'bg-amber-100 text-amber-600' },
  gathering: { label: '모임', emoji: '👥', color: 'bg-blue-100 text-blue-600' },
  alone: { label: '혼자', emoji: '😊', color: 'bg-purple-100 text-purple-600' },
  family: { label: '가족', emoji: '👨‍👩‍👧‍👦', color: 'bg-green-100 text-green-600' },
  friends: { label: '친구', emoji: '🎉', color: 'bg-orange-100 text-orange-600' },
};

// 리뷰 공개 범위
export type ReviewVisibility = 'public' | 'followers' | 'private';

// 리뷰 모델
export interface Review {
  id: string;
  placeId: string;
  placeName?: string;
  userId: string;
  userName?: string;
  userProfileImage?: string;
  rating: number; // 1-5
  content: string;
  photos?: string[];
  purposeTags: PurposeTag[];
  visibility: ReviewVisibility; // 공개 범위
  visitedWith?: 'partner' | 'alone' | 'friends' | 'family'; // 누구와 방문했는지
  visitDate?: string; // 방문 날짜
  likesCount: number;
  commentsCount?: number;
  isLiked?: boolean; // 현재 사용자가 좋아요를 눌렀는지
  createdAt: string;
  updatedAt?: string;
}

// 리뷰 통계
export interface ReviewStats {
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  purposeTagDistribution: Partial<Record<PurposeTag, number>>;
}

// Naver Map component props
export interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}
