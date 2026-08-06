import { useState } from "react";
import {
  apiRequest,
  clearAuthData,
  saveAuthData,
  USER_STORAGE_KEY,
} from "../services/api";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  async function login(email, password) {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      saveAuthData({
        token: data.token,
        user: data.user,
      });

      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Email o contraseña incorrectos.",
      };
    }
  }

  function logout() {
    setUser(null);
    clearAuthData();
  }

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
