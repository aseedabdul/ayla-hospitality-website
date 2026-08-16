import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import logo from "../../assets/images/ayla-logo.jpeg";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { adminSession, adminLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (adminSession) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await adminLogin(email.trim(), password.trim());
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@aylahospitality.com");
    setPassword("adminpassword123");
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="flex flex-col items-center mb-9">
          <img src={logo} alt="AYLA Hospitality" className="h-16 w-auto object-contain bg-ivory rounded-sm p-1.5 mb-5" />
          <span className="text-[11px] tracking-[0.28em] uppercase text-gold-soft font-semibold">
            Admin Console
          </span>
        </div>

        <form onSubmit={handleSubmit} className="bg-ivory rounded-[6px] p-7 md:p-9">
          <h1 className="font-display text-2xl text-ink mb-1">Staff Sign In</h1>
          <p className="text-[13px] text-ink-soft/60 mb-7">Access the AYLA management console.</p>

          <label className="flex flex-col gap-2 mb-5">
            <span className="text-[12px] font-semibold text-ink-soft">Email</span>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aylahospitality.com"
                className="w-full bg-white border border-line rounded-[4px] pl-10 pr-3 py-3 text-[13.5px] text-ink outline-none focus:border-gold-deep transition-colors"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2 mb-2">
            <span className="text-[12px] font-semibold text-ink-soft">Password</span>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-line rounded-[4px] pl-10 pr-3 py-3 text-[13.5px] text-ink outline-none focus:border-gold-deep transition-colors"
              />
            </div>
          </label>

          {error && <p className="text-[12.5px] text-red-700 bg-red-50 border border-red-200 rounded p-2.5 my-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-ink text-ivory rounded-full py-3.5 text-[13px] tracking-[0.1em] uppercase hover:bg-gold-deep transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? "Authenticating…" : "Sign In"}
          </button>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-line text-[11.5px] text-ink-soft/60">
            <button
              type="button"
              onClick={handleQuickFill}
              className="inline-flex items-center gap-1 text-gold-deep hover:underline"
            >
              <Sparkles size={12} /> Fill Admin Demo
            </button>
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-700" />
              JWT Protected
            </span>
          </div>
        </form>

        <Link to="/" className="block text-center text-[12.5px] text-ivory/40 hover:text-gold-soft mt-6">
          ← Back to AYLA Hospitality
        </Link>
      </motion.div>
    </div>
  );
}
