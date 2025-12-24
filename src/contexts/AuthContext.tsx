"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isLoggedIn, getToken, removeToken, setToken as saveToken } from "@/lib/api";

interface User {
  id: string;
  name?: string;
  email?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 토큰에서 유저 정보를 가져오는 함수
  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      // TODO: 실제 API 호출로 교체
      // const response = await fetch('/api/auth/me', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const userData = await response.json();
      // return userData;

      // 임시로 JWT 디코딩 (실제로는 백엔드에서 검증된 정보를 받아야 함)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub || payload.userId || "user123",
        name: payload.name || "사용자",
        email: payload.email,
        profileImage: payload.picture || payload.profileImage,
      };
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;
    }
  };

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token && isLoggedIn()) {
        const userInfo = await fetchUserInfo(token);
        if (userInfo) {
          setUser(userInfo);
          setIsAuthenticated(true);
        } else {
          // 토큰이 유효하지 않으면 삭제
          removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 로그인
  const login = async (token: string) => {
    saveToken(token);
    const userInfo = await fetchUserInfo(token);
    if (userInfo) {
      setUser(userInfo);
      setIsAuthenticated(true);
    }
  };

  // 로그아웃
  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  // 유저 정보 갱신
  const refreshUser = async () => {
    const token = getToken();
    if (token) {
      const userInfo = await fetchUserInfo(token);
      if (userInfo) {
        setUser(userInfo);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
