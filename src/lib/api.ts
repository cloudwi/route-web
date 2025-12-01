import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { DirectionsResponse, DirectionsMode } from "@/types";

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

// Axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 처리
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// API 클라이언트
export const api = {
  // 기존 fetch 스타일 호환을 위한 메서드 (Response 객체 반환)
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

    if (response.status === 401) {
      removeToken();
      window.location.href = "/";
    }

    return response;
  },

  // Axios 기반 메서드들
  async get<T>(endpoint: string): Promise<T> {
    const response = await axiosInstance.get<T>(endpoint);
    return response.data;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axiosInstance.post<T>(endpoint, data);
    return response.data;
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axiosInstance.put<T>(endpoint, data);
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await axiosInstance.delete<T>(endpoint);
    return response.data;
  },
};

// Axios 인스턴스 직접 내보내기 (필요시 사용)
export { axiosInstance };

// Directions API
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
  const queryParams: Record<string, string> = {
    start_lat: params.startLat.toString(),
    start_lng: params.startLng.toString(),
    end_lat: params.endLat.toString(),
    end_lng: params.endLng.toString(),
    mode: params.mode,
  };

  // 대중교통 모드일 때 상세 경로 좌표 요청
  if (params.mode === "transit") {
    queryParams.include_graph_info = "true";
  }

  if (params.pathType !== undefined) {
    queryParams.path_type = params.pathType.toString();
  }
  if (params.routeOption) {
    queryParams.route_option = params.routeOption;
  }
  if (params.carType !== undefined) {
    queryParams.car_type = params.carType.toString();
  }
  if (params.waypoints && params.waypoints.length > 0) {
    queryParams.waypoints = JSON.stringify(params.waypoints);
  }

  const response = await axiosInstance.get<DirectionsResponse>("/api/v1/directions", {
    params: queryParams,
  });

  return response.data;
}
