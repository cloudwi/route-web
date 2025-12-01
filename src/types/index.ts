// Place types
export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category?: string;
  telephone?: string;
  naverMapUrl?: string;
}

// Course types
export interface Course {
  id: string;
  name: string;
  description?: string;
  places: Place[];
  createdAt: Date;
  userId?: string;
  isPublic?: boolean;
}

// User types
export interface User {
  id: string;
  nickname: string;
  profileImage?: string;
  email?: string;
}

// Popular Place for ranking
export interface PopularPlace {
  id: number;
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
  createdAt: string;
}

// Naver Map types
export interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}
