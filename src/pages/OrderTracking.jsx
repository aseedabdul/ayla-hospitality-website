import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, MapPin, Clock, ArrowLeft, Building2 } from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import { ORDER_STATUSES } from "../data/orders";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import { PackageX } from "lucide-react";

const stepDescriptions = {
  Received: "Your order has reached our concierge desk.",
  Preparing: "Your items are being carefully prepared.",
  "Out for Delivery": "On its way to your room, right now.",
  Delivered: "Delivered — we hope you enjoy it.",
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-ivory pt-[110px]">
        <EmptyState
          icon={PackageX}
          title="Order not found"
          description="We couldn't locate that order."
          ctaLabel="View My Orders"
          ctaTo="/orders"
        />
      </div>
    );
  }

  const currentIndex = ORDER_STATUSES.indexOf(order.status);
  const progressPct = (currentIndex / (ORDER_STATUSES.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader eyebrow={`Order ${order.id}`} title="Track Your Order" />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 py-14 md:py-20">
        <Link to="/orders" className="inline-flex items-center gap-2 text-[13px] text-ink-soft hover:text-gold-deep mb-10">
          <ArrowLeft size={14} /> Back to My Orders
        </Link>

        <div className="flex items-center gap-2 text-[13px] text-ink-soft/70 mb-14">
          <MapPin size={14} className="text-gold-deep" />
          Delivering to {order.hotel} · Room {order.room}
          <span className="mx-1">·</span>
          <Clock size={14} className="text-gold-deep" />
          {order.requestedTime}
        </div>

        {/* timeline */}
        <div className="relative mb-6">
          {/* track */}
          <div className="absolute top-[19px] left-0 right-0 h-[2px] bg-line" />
          <motion.div
            className="absolute top-[19px] left-0 h-[2px] bg-gold-deep"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          />

          {/* out-for-delivery moving marker */}
          {order.status === "Out for Delivery" && (
            <motion.div
              className="absolute top-[9px] z-10"
              style={{ left: `${(1 / (ORDER_STATUSES.length - 1)) * 100}%` }}
              animate={{
                left: [
                  `${(1 / (ORDER_STATUSES.length - 1)) * 100}%`,
                  `${(2 / (ORDER_STATUSES.length - 1)) * 100}%`,
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <div className="w-5 h-5 -translate-x-1/2 rounded-full bg-ivory border-2 border-gold-deep flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(140,101,40,0.5)]">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-deep" />
              </div>
            </motion.div>
          )}

          <div className="relative grid grid-cols-4">
            {ORDER_STATUSES.map((status, i) => {
              const done = i <= currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <div key={status} className="flex flex-col items-center text-center px-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`relative z-[1] w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                      done
                        ? "bg-gold-deep border-gold-deep text-ivory"
                        : "bg-ivory border-line text-ink-soft/40"
                    }`}
                  >
                    {done && !isCurrent ? (
                      <Check size={16} strokeWidth={2.4} />
                    ) : status === "Delivered" ? (
                      <Building2 size={15} strokeWidth={1.8} />
                    ) : (
                      <span className="text-[12px] font-semibold">{i + 1}</span>
                    )}
                    {isCurrent && status !== "Delivered" && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-gold-deep"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`mt-3 text-[11.5px] md:text-[12.5px] font-semibold tracking-[0.02em] ${
                      done ? "text-ink" : "text-ink-soft/40"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* current status detail */}
        <motion.div
          key={order.status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-white/60 border border-line rounded-[6px] p-7 md:p-9 text-center"
        >
          <span className="text-[11px] tracking-[0.2em] uppercase text-gold-deep font-semibold">
            Current Status
          </span>
          <h2 className="font-display text-3xl text-ink mt-2 mb-3">{order.status}</h2>
          <p className="text-ink-soft/70 max-w-md mx-auto leading-relaxed">
            {stepDescriptions[order.status]}
          </p>
        </motion.div>

        {/* order items recap */}
        <div className="mt-14">
          <h3 className="font-display text-2xl text-ink mb-5">Items in this order</h3>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 bg-white/50 border border-line rounded-[4px] p-3.5">
                <img src={item.image} alt="" className="w-12 h-12 rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] text-ink truncate">{item.name}</p>
                  <p className="text-[11.5px] text-ink-soft/55">Qty {item.qty}</p>
                </div>
                <span className="text-[13.5px] text-ink">
                  {item.currency}
                  {(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
