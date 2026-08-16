import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { guestUser } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(guestUser);
  const [adminSession, setAdminSession] = useState(() => {
    const adminToken = localStorage.getItem("ayla_admin_token");
    const adminEmail = localStorage.getItem("ayla_admin_email");
    return adminToken ? { email: adminEmail || "admin@aylahospitality.com" } : null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Initialize customer authentication session if token exists
  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("ayla_token");
      if (token) {
        try {
          const data = await authService.getProfile();
          if (data.user && data.profile) {
            setCurrentUser(data.user);
            setProfile(data.profile);
          }
        } catch (err) {
          console.warn("Session expired or invalid:", err.message);
          localStorage.removeItem("ayla_token");
        }
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  // Customer Login
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setCurrentUser(res.user);
    setProfile(res.profile);
    setAuthModalOpen(false);
    return res;
  };

  // Customer Register
  const register = async (data) => {
    const res = await authService.register(data);
    setCurrentUser(res.user);
    setProfile(res.profile);
    setAuthModalOpen(false);
    return res;
  };

  // Customer Logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setProfile(guestUser);
  };

  // Update Profile
  const updateProfile = async (updates) => {
    if (currentUser) {
      const res = await authService.updateProfile(updates);
      setProfile(res.profile);
      return res.profile;
    } else {
      setProfile((prev) => ({ ...prev, ...updates }));
      return { ...profile, ...updates };
    }
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    const res = await authService.adminLogin(email, password);
    localStorage.setItem("ayla_admin_email", email);
    setAdminSession({ email, loggedInAt: new Date().toISOString() });
    return res;
  };

  // Admin Logout
  const adminLogout = () => {
    authService.adminLogout();
    localStorage.removeItem("ayla_admin_email");
    setAdminSession(null);
  };

  const value = {
    user: currentUser,
    isAuthenticated: Boolean(currentUser),
    guest: profile, // alias for backwards compatibility
    profile,
    loading,
    login,
    register,
    logout,
    updateProfile,
    adminSession,
    adminLogin,
    adminLogout,
    isAuthModalOpen,
    setAuthModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
