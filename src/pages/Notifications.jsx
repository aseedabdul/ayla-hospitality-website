import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Package, Gift, Check } from "lucide-react";
import { notifications as seedNotifications } from "../data/notifications";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

export default function Notifications() {
  const [items, setItems] = useState(seedNotifications);

  const markRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader eyebrow="Stay Informed" title="Notifications" description="Order updates and guest privileges, all in one place." />

      <div className="max-w-[800px] mx-auto px-5 md:px-10 py-12 md:py-16">
        {items.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <span className="text-[13px] text-ink-soft/60">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[13px] text-gold-deep hover:underline">
                Mark all as read
              </button>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((n, i) => (
              <motion.button
                key={n.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-4 text-left p-5 rounded-[4px] border transition-colors ${
                  n.read ? "bg-white/40 border-line" : "bg-gold-deep/5 border-gold/30"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-ivory-deep flex items-center justify-center shrink-0">
                  {n.type === "order" ? (
                    <Package size={16} strokeWidth={1.6} className="text-gold-deep" />
                  ) : (
                    <Gift size={16} strokeWidth={1.6} className="text-gold-deep" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-ink">{n.title}</h3>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-gold-deep" />}
                  </div>
                  <p className="text-[13px] text-ink-soft/70 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-ink-soft/45 mt-2 block">{n.time}</span>
                </div>
                {n.read && <Check size={14} className="text-ink-soft/30 mt-1" />}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
