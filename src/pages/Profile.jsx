import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  ClipboardList,
  Heart,
  Bell,
  Star,
  Gift,
  Pencil,
  Check,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useWishlist } from "../context/WishlistContext";
import PageHeader from "../components/ui/PageHeader";
import GoldThread from "../components/ui/GoldThread";
import Button from "../components/ui/Button";

const links = [
  { label: "My Orders", to: "/orders", icon: ClipboardList, desc: "Track and reorder past deliveries" },
  { label: "Wishlist", to: "/wishlist", icon: Heart, desc: "Items you're saving for later" },
  { label: "Notifications", to: "/notifications", icon: Bell, desc: "Order updates and offers" },
  { label: "Reviews & Ratings", to: "/reviews", icon: Star, desc: "What you've shared about your orders" },
  { label: "Offers", to: "/offers", icon: Gift, desc: "Available discounts and privileges" },
];

export default function Profile() {
  const { guest, isAuthenticated, logout, setAuthModalOpen, updateProfile } = useAuth();
  const { orders } = useOrders();
  const { ids } = useWishlist();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: guest.name || "",
    phone: guest.phone || "",
    hotel: guest.hotel || "",
    room: guest.room || "",
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader eyebrow="Guest Account" title="Your Profile" />

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 border border-line rounded-[6px] p-7 md:p-9 mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-7">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gold-deep/10 flex items-center justify-center shrink-0">
                <User size={26} strokeWidth={1.5} className="text-gold-deep" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-ink">{guest.name}</h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase text-gold-deep font-semibold mt-1">
                  <Award size={12} /> {guest.tier || "Gold Guest"} · Member since {guest.memberSince || "2024"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => {
                    setFormData({
                      name: guest.name || "",
                      phone: guest.phone || "",
                      hotel: guest.hotel || "",
                      room: guest.room || "",
                    });
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1.5 border border-line rounded-full px-4 py-2 text-[12px] text-ink-soft hover:border-gold-deep transition-colors"
                >
                  <Pencil size={13} /> Edit Details
                </button>
              ) : null}

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 border border-line rounded-full px-4 py-2 text-[12px] text-ink-soft hover:text-red-700 hover:border-red-300 transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 bg-ink text-ivory rounded-full px-5 py-2 text-[12px] tracking-[0.06em] uppercase hover:bg-gold-deep transition-colors"
                >
                  <LogIn size={13} /> Sign In
                </button>
              )}
            </div>
          </div>

          <GoldThread className="mb-6" />

          {saveSuccess && (
            <p className="text-[12px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded p-2.5 mb-5 flex items-center gap-2">
              <Check size={14} /> Profile details saved successfully.
            </p>
          )}

          {isEditing ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold text-ink-soft">Full Name</span>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white border border-line rounded px-3 py-2 text-[13px] outline-none focus:border-gold-deep"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold text-ink-soft">Phone</span>
                <input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white border border-line rounded px-3 py-2 text-[13px] outline-none focus:border-gold-deep"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold text-ink-soft">Hotel</span>
                <input
                  value={formData.hotel}
                  onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                  className="bg-white border border-line rounded px-3 py-2 text-[13px] outline-none focus:border-gold-deep"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11.5px] font-semibold text-ink-soft">Room</span>
                <input
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="bg-white border border-line rounded px-3 py-2 text-[13px] outline-none focus:border-gold-deep"
                />
              </label>
              <div className="sm:col-span-2 flex gap-3 mt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-ink text-ivory rounded-full px-6 py-2.5 text-[12.5px] tracking-[0.06em] uppercase hover:bg-gold-deep transition-colors"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 text-[12.5px] text-ink-soft/60 hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13.5px]">
              <DetailRow icon={Mail} label="Email" value={guest.email || "camille.fontaine@example.com"} />
              <DetailRow icon={Phone} label="Phone" value={guest.phone || "—"} />
              <DetailRow icon={MapPin} label="Hotel" value={guest.hotel || "—"} />
              <DetailRow icon={MapPin} label="Room" value={guest.room || "—"} />
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Total Orders" value={orders.length} />
          <StatCard label="Wishlist Items" value={ids.length} />
          <StatCard label="Guest Tier" value={guest.tier || "Gold Guest"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((l, i) => (
            <motion.div
              key={l.to}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                to={l.to}
                className="flex items-center gap-4 bg-white/50 border border-line rounded-[4px] p-5 hover:border-gold/60 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-ivory-deep flex items-center justify-center shrink-0 group-hover:bg-gold-deep/10 transition-colors">
                  <l.icon size={18} strokeWidth={1.6} className="text-gold-deep" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-ink">{l.label}</h3>
                  <p className="text-[12.5px] text-ink-soft/60">{l.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} strokeWidth={1.6} className="text-gold-deep shrink-0" />
      <div>
        <p className="text-[11px] text-ink-soft/55 uppercase tracking-[0.06em]">{label}</p>
        <p className="text-ink">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-ink text-ivory rounded-[4px] p-5 text-center">
      <p className="font-display text-3xl text-gold-soft mb-1">{value}</p>
      <p className="text-[11px] tracking-[0.1em] uppercase text-ivory/60">{label}</p>
    </div>
  );
}
