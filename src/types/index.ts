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

// Directions API types
export type DirectionsMode = "transit" | "driving";

export interface TransitPath {
  path_type: number;
  total_time: number;
  total_distance: number;
  total_walk: number;
  transfer_count: number;
  payment: number;
}

export interface DrivingSummary {
  distance: number;
  duration: number;
  duration_minutes: number;
  toll_fare: number;
  taxi_fare: number;
  fuel_price: number;
}

export interface DirectionsResult {
  search_type?: number;
  count?: number;
  paths?: TransitPath[];
  summary?: DrivingSummary;
}

export interface DirectionsResponse {
  mode: string;
  start: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  result: DirectionsResult;
}

export interface DirectionsRequest {
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  mode: DirectionsMode;
  path_type?: number;
  route_option?: string;
  car_type?: number;
  waypoints?: { lat: number; lng: number }[];
}

// Route info for display
export interface RouteSection {
  from: Place;
  to: Place;
  transit?: TransitPath;
  driving?: DrivingSummary;
}

export interface RouteInfo {
  sections: RouteSection[];
  totalTime: number;
  totalDistance: number;
  mode: DirectionsMode;
}
