import { api } from "./api";

export const authService = {
  // Customer Login
  async login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    if (res.token) {
      localStorage.setItem("ayla_token", res.token);
    }
    return res;
  },

  // Customer Signup
  async register(data) {
    const res = await api.post("/auth/register", data);
    if (res.token) {
      localStorage.setItem("ayla_token", res.token);
    }
    return res;
  },

  // Admin Login
  async adminLogin(email, password) {
    const res = await api.post("/auth/admin/login", { email, password });
    if (res.token) {
      localStorage.setItem("ayla_admin_token", res.token);
    }
    return res;
  },

  // Get Profile
  async getProfile() {
    return await api.get("/auth/profile");
  },

  // Update Profile
  async updateProfile(updates) {
    return await api.put("/auth/profile", updates);
  },

  // Logout
  logout() {
    localStorage.removeItem("ayla_token");
  },

  // Admin Logout
  adminLogout() {
    localStorage.removeItem("ayla_admin_token");
  },
};
