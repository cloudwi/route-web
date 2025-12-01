const API_BASE_URL = "http://localhost:3000";

// 토큰 관리
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
};

export const isLoggedIn = (): boolean => {
  return !!getToken();
};

// API 클라이언트
export const api = {
  async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 401 에러시 토큰 제거 및 로그인 페이지로
    if (response.status === 401) {
      removeToken();
      window.location.href = "/";
    }

    return response;
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.fetch(endpoint);
    return response.json();
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.fetch(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.fetch(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.fetch(endpoint, {
      method: "DELETE",
    });
    return response.json();
  },
};

// Directions API
import type { DirectionsResponse, DirectionsMode } from "@/types";

export interface GetDirectionsParams {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  mode: DirectionsMode;
  pathType?: number;
  routeOption?: string;
  carType?: number;
  waypoints?: { lat: number; lng: number }[];
}

export async function getDirections(params: GetDirectionsParams): Promise<DirectionsResponse> {
  const searchParams = new URLSearchParams({
    start_lat: params.startLat.toString(),
    start_lng: params.startLng.toString(),
    end_lat: params.endLat.toString(),
    end_lng: params.endLng.toString(),
    mode: params.mode,
  });

  if (params.pathType !== undefined) {
    searchParams.append("path_type", params.pathType.toString());
  }
  if (params.routeOption) {
    searchParams.append("route_option", params.routeOption);
  }
  if (params.carType !== undefined) {
    searchParams.append("car_type", params.carType.toString());
  }
  if (params.waypoints && params.waypoints.length > 0) {
    searchParams.append("waypoints", JSON.stringify(params.waypoints));
  }

  const response = await api.fetch(`/api/v1/directions?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch directions");
  }
  return response.json();
}