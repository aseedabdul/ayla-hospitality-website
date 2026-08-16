import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useOrders } from "../../context/OrdersContext";
import { useAdminCatalog } from "../../context/AdminCatalogContext";
import StatusPill from "../../components/ui/StatusPill";

export default function AdminDashboard() {
  const { orders } = useOrders();
  const { products } = useAdminCatalog();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 5);

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: ClipboardList },
    { label: "Pending Orders", value: pendingOrders, icon: Clock },
    { label: "Completed Orders", value: completedOrders, icon: CheckCircle2 },
    { label: "Revenue", value: `$${revenue.toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Dashboard</h1>
          <p className="text-[13px] text-ink-soft/60">Overview of AYLA Hospitality operations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="bg-white border border-line rounded-[6px] p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-full bg-gold-deep/10 flex items-center justify-center">
                <s.icon size={16} strokeWidth={1.6} className="text-gold-deep" />
              </div>
            </div>
            <p className="font-display text-3xl text-ink">{s.value}</p>
            <p className="text-[12px] text-ink-soft/55 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* recent orders */}
        <div className="bg-white border border-line rounded-[6px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl text-ink">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[12px] text-gold-deep hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-[13px] py-2 border-b border-line/60 last:border-0">
                <div>
                  <p className="text-ink font-medium">{o.id}</p>
                  <p className="text-ink-soft/50 text-[11.5px]">{o.hotel} · Room {o.room}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink">${o.total.toFixed(2)}</span>
                  <StatusPill status={o.status} />
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-[13px] text-ink-soft/50">No orders yet.</p>}
          </div>
        </div>

        {/* low stock */}
        <div className="bg-white border border-line rounded-[6px] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl text-ink flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-700" />
              Low Stock
            </h3>
            <Link to="/admin/products" className="text-[12px] text-gold-deep hover:underline flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {lowStock.length === 0 && (
              <p className="text-[13px] text-ink-soft/50">All products are well-stocked.</p>
            )}
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2 border-b border-line/60 last:border-0">
                <img src={p.image} alt="" className="w-9 h-9 rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-ink truncate">{p.name}</p>
                  <p className="text-[11.5px] text-ink-soft/50">{p.brand}</p>
                </div>
                <StatusPill status="Low Stock" />
                <span className="text-[12px] text-ink-soft/60 w-10 text-right">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
