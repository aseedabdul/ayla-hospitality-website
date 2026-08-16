const styles = {
  Received: "bg-ink/8 text-ink-soft border-ink/15",
  Preparing: "bg-gold/12 text-gold-deep border-gold/30",
  "Out for Delivery": "bg-gold-deep/15 text-gold-deep border-gold-deep/30",
  Delivered: "bg-emerald-800/10 text-emerald-800 border-emerald-800/25",
  Paid: "bg-emerald-800/10 text-emerald-800 border-emerald-800/25",
  Pending: "bg-gold/12 text-gold-deep border-gold/30",
  Failed: "bg-red-800/10 text-red-800 border-red-800/25",
  "Low Stock": "bg-red-800/10 text-red-800 border-red-800/25",
  "In Stock": "bg-emerald-800/10 text-emerald-800 border-emerald-800/25",
};

export default function StatusPill({ status, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase font-semibold px-2.5 py-1 rounded-full border ${
        styles[status] || "bg-ink/8 text-ink-soft border-ink/15"
      } ${className}`}
    >
      {status}
    </span>
  );
}
