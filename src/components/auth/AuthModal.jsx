import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Phone, MapPin, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
const logo = "/images/ayla-hospitality-logo.png";

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, register, isAuthenticated, logout, profile } =
    useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hotel, setHotel] = useState("The Meridian Hotel");
  const [room, setRoom] = useState("412");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ email, password, name, phone, hotel, room });
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("camille.fontaine@example.com");
    setPassword("guestpassword123");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setAuthModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-ivory rounded-[6px] w-full max-w-md p-7 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={() => setAuthModalOpen(false)}
            aria-label="Close"
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-ink-soft/60 hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={logo}
              alt="AYLA Hospitality"
              className="h-12 w-auto object-contain bg-ivory rounded-sm p-1 mb-3"
            />
            <span className="text-[10px] tracking-[0.24em] uppercase text-gold-deep font-semibold">
              Guest Portal
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-ink mt-1">
              {isAuthenticated
                ? "Your Guest Account"
                : mode === "login"
                ? "Welcome Back"
                : "Join AYLA Hospitality"}
            </h2>
            <p className="text-[12.5px] text-ink-soft/65 mt-1">
              {isAuthenticated
                ? `Signed in as ${profile.name || profile.email}`
                : mode === "login"
                ? "Sign in to access your curated orders, saved items, and personalized amenities."
                : "Create an account for expedited room deliveries and guest privileges."}
            </p>
          </div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div className="bg-white/70 border border-line rounded-[4px] p-4 text-[13px] flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-ink-soft/60">Name:</span>
                  <span className="font-medium text-ink">{profile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft/60">Email:</span>
                  <span className="font-medium text-ink">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft/60">Hotel / Room:</span>
                  <span className="font-medium text-ink">
                    {profile.hotel}, Room {profile.room}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft/60">Tier:</span>
                  <span className="font-semibold text-gold-deep">{profile.tier}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setAuthModalOpen(false);
                }}
                className="w-full bg-ink text-ivory rounded-full py-3 text-[12.5px] tracking-[0.08em] uppercase hover:bg-gold-deep transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <label className="flex flex-col gap-1">
                  <span className="text-[11.5px] font-semibold text-ink-soft">Full Name</span>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Camille Fontaine"
                      className="modal-input"
                    />
                  </div>
                </label>
              )}

              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold text-ink-soft">Email Address</span>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@aylahospitality.com"
                    className="modal-input"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold text-ink-soft">Password</span>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="modal-input"
                  />
                </div>
              </label>

              {mode === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-[11.5px] font-semibold text-ink-soft">Hotel</span>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/40" />
                        <input
                          value={hotel}
                          onChange={(e) => setHotel(e.target.value)}
                          className="modal-input !pl-8 text-[12.5px]"
                        />
                      </div>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[11.5px] font-semibold text-ink-soft">Room</span>
                      <input
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        className="modal-input !pl-3 text-[12.5px]"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11.5px] font-semibold text-ink-soft">Phone Number (optional)</span>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (415) 555-0148"
                        className="modal-input"
                      />
                    </div>
                  </label>
                </>
              )}

              {error && (
                <p className="text-[12px] text-red-700 bg-red-50 border border-red-200 rounded p-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 bg-ink text-ivory rounded-full py-3 text-[12.5px] tracking-[0.08em] uppercase hover:bg-gold-deep transition-colors disabled:opacity-50 font-medium"
              >
                {submitting
                  ? "Processing…"
                  : mode === "login"
                  ? "Sign In"
                  : "Create Guest Account"}
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-line text-[12.5px]">
                {mode === "login" ? (
                  <>
                    <button
                      type="button"
                      onClick={handleDemoFill}
                      className="inline-flex items-center gap-1 text-gold-deep hover:underline text-[12px]"
                    >
                      <Sparkles size={13} /> Quick Fill Demo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setError("");
                      }}
                      className="text-ink-soft/75 hover:text-ink underline"
                    >
                      New guest? Create account
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="text-ink-soft/75 hover:text-ink underline mx-auto"
                  >
                    Already have an account? Sign In
                  </button>
                )}
              </div>
            </form>
          )}

          <style>{`
            .modal-input {
              width: 100%;
              background: white;
              border: 1px solid var(--color-line);
              border-radius: 4px;
              padding: 0.6rem 0.8rem 0.6rem 2.4rem;
              font-size: 13px;
              color: var(--color-ink);
              outline: none;
              transition: border-color 0.2s;
            }
            .modal-input:focus {
              border-color: var(--color-gold-deep);
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
