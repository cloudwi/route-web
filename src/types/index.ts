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

// 대중교통 sub_path의 lane 정보
export interface TransitLane {
  name?: string;
  subway_code?: number;
  bus_no?: string;
  type?: number;
  bus_id?: number;
}

// 경유 역/정류장 정보
export interface TransitStation {
  index: number;
  station_name: string;
  x: number;
  y: number;
  is_non_stop?: string | null;
}

// 대중교통 sub_path (구간 정보)
export interface TransitSubPath {
  traffic_type: number; // 1: 지하철, 2: 버스, 3: 도보
  distance: number;
  section_time: number;
  station_count?: number;
  lane?: TransitLane[];
  start_id?: number;
  end_id?: number;
  start_name?: string;
  start_x?: number;
  start_y?: number;
  end_name?: string;
  end_x?: number;
  end_y?: number;
  way?: string;
  way_code?: number;
  // 경유 역/정류장 목록
  pass_stop_list?: TransitStation[];
  // 상세 경로 좌표 (include_graph_info=true 시 제공) [lng, lat][]
  graph_pos?: [number, number][];
}

export interface TransitPath {
  path_type: number;
  total_time: number;
  total_distance: number;
  total_walk: number;
  total_walk_time?: number;
  transfer_count: number;
  bus_transit_count?: number;
  subway_transit_count?: number;
  payment: number;
  first_start_station?: string;
  last_end_station?: string;
  sub_paths?: TransitSubPath[];
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
  // 자동차 경로 좌표 배열 [lng, lat][]
  path?: [number, number][];
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
  // 자동차 경로 좌표 배열 [lng, lat][]
  drivingPath?: [number, number][];
}

export interface RouteInfo {
  sections: RouteSection[];
  totalTime: number;
  totalDistance: number;
  mode: DirectionsMode;
}
