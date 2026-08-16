import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useOrders } from "../../context/OrdersContext";
import { ORDER_STATUSES } from "../../data/orders";


const paymentStatuses = ["Pending", "Paid", "Failed"];

export default function AdminOrders() {
  const { orders, setStatus, setPaymentStatus } = useOrders();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchesQuery =
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.hotel.toLowerCase().includes(query.toLowerCase()) ||
      o.room.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-ink">Orders</h1>
        <p className="text-[13px] text-ink-soft/60">{orders.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID, hotel, room…"
            className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-2.5 text-[13px] outline-none focus:border-gold-deep transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-line rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-gold-deep transition-colors"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-line rounded-[6px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[820px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.06em] text-ink-soft/50 border-b border-line bg-ivory-deep/30">
                <th className="py-3 px-4 font-medium">Order ID</th>
                <th className="py-3 px-4 font-medium">Hotel / Room</th>
                <th className="py-3 px-4 font-medium">Items</th>
                <th className="py-3 px-4 font-medium">Total</th>
                <th className="py-3 px-4 font-medium">Payment</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <Fragment key={o.id}>
                  <tr className="border-b border-line/60 hover:bg-ivory-deep/20">
                    <td className="py-3 px-4 text-[13px] text-ink font-medium">{o.id}</td>
                    <td className="py-3 px-4 text-[12.5px] text-ink-soft/70">
                      {o.hotel}<br />Room {o.room}
                    </td>
                    <td className="py-3 px-4 text-[12.5px] text-ink-soft/70">{o.items.length} items</td>
                    <td className="py-3 px-4 text-[13px] text-ink">${o.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={o.paymentStatus}
                        onChange={(e) => setPaymentStatus(o.id, e.target.value)}
                        className="text-[12px] border border-line rounded-full px-2.5 py-1 outline-none bg-white"
                      >
                        {paymentStatuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => setStatus(o.id, e.target.value)}
                        className="text-[12px] border border-line rounded-full px-2.5 py-1 outline-none bg-white"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-[11.5px] text-ink-soft/55">
                      {new Date(o.placedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-ivory-deep transition-colors"
                      >
                        {expanded === o.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expanded === o.id && (
                      <tr>
                        <td colSpan={8} className="bg-ivory-deep/20 px-6 py-4">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col gap-2"
                          >
                            {o.items.map((item) => (
                              <div key={item.productId} className="flex items-center gap-3 text-[12.5px]">
                                <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />
                                <span className="text-ink">{item.name}</span>
                                <span className="text-ink-soft/50">x{item.qty}</span>
                                <span className="text-ink-soft/50 ml-auto">
                                  {item.currency}
                                  {(item.price * item.qty).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            {o.instructions && (
                              <p className="text-[12px] text-ink-soft/60 mt-2 italic">"{o.instructions}"</p>
                            )}
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-[13px] text-ink-soft/50 py-10">No orders match your filters.</p>
        )}
      </div>
    </div>
  );
}
