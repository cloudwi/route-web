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