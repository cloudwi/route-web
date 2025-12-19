import { useState, useEffect } from "react";
import { isLoggedIn, removeToken } from "@/lib/api";

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const logout = () => {
    removeToken();
    setLoggedIn(false);
  };

  const refreshAuthState = () => {
    setLoggedIn(isLoggedIn());
  };

  return {
    loggedIn,
    logout,
    refreshAuthState,
  };
}
