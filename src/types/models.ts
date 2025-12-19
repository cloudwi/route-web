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
}

// Naver Map component props
export interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}
