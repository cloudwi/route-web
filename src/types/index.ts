// Place types
export interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category?: string;
}

// Course types
export interface Course {
  id: string;
  name: string;
  description?: string;
  places: Place[];
  createdAt: Date;
}

// Naver Map types
export interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}
