import { useState } from "react";
import { users } from "../data/users";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("booknest_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  function login(email, password) {
    const foundUser = users.find(
      (item) => item.email === email && item.password === password,
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Email o contraseña incorrectos.",
      };
    }

    const userToSave = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };

    setUser(userToSave);
    localStorage.setItem("booknest_user", JSON.stringify(userToSave));

    return {
      success: true,
      user: userToSave,
    };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("booknest_user");
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