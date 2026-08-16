// Centralized API Client for AYLA Hospitality

const API_BASE = "/api";

// Get or create guest session token for persistent guest carts/wishlists
export function getSessionToken() {
  let token = localStorage.getItem("ayla_session_token");
  if (!token) {
    token = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("ayla_session_token", token);
  }
  return token;
}

export function getAuthToken() {
  return localStorage.getItem("ayla_token") || localStorage.getItem("ayla_admin_token") || "";
}

export async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    "x-session-token": getSessionToken(),
    ...options.headers,
  };

  const authToken = getAuthToken();
  if (authToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  // Handle FormData (don't set Content-Type header so browser sets boundary)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { method: "GET", ...options }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),
  delete: (endpoint, options = {}) => request(endpoint, { method: "DELETE", ...options }),
};
