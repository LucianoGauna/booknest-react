const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const TOKEN_STORAGE_KEY = "booknest_token";
export const USER_STORAGE_KEY = "booknest_user";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function saveAuthData({ token, user }) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export async function apiRequest(endpoint, options = {}) {
  const { method = "GET", body, auth = false } = options;

  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Error en la petición");
  }

  return data;
}