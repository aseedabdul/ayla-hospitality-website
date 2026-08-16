import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Clock, CreditCard, ArrowRight, FileText } from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import StatusPill from "../components/ui/StatusPill";
import Button from "../components/ui/Button";
import GoldThread from "../components/ui/GoldThread";
import EmptyState from "../components/ui/EmptyState";
import { PackageX } from "lucide-react";

export default function OrderConfirmation() {
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
          ctaLabel="Back to Shop"
          ctaTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory pt-[110px] md:pt-[130px] pb-20">
      <div className="max-w-[720px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-16 rounded-full bg-gold-deep/10 flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={30} strokeWidth={1.5} className="text-gold-deep" />
          </motion.div>
          <span className="text-[11px] tracking-[0.28em] uppercase text-gold-deep font-semibold mb-3">
            Order Confirmed
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-ink mb-3">Thank you</h1>
          <GoldThread className="mb-4" />
          <p className="text-ink-soft/75 max-w-sm leading-relaxed">
            Your order has been received and is being prepared with care.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-white/60 border border-line rounded-[6px] p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <span className="text-[11px] text-ink-soft/60 uppercase tracking-[0.1em]">Order ID</span>
              <p className="font-display text-2xl text-ink">{order.id}</p>
            </div>
            <StatusPill status={order.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-6 border-b border-line">
            <InfoBlock icon={MapPin} label="Deliver To" value={`${order.hotel} · Room ${order.room}`} />
            <InfoBlock icon={Clock} label="Requested Time" value={order.requestedTime} />
            <InfoBlock icon={CreditCard} label="Payment" value={`${order.paymentMethod} · ${order.paymentStatus}`} />
          </div>

          <div className="flex flex-col gap-4 py-6 border-b border-line">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <img src={item.image} alt="" className="w-14 h-14 rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] text-ink truncate">{item.name}</p>
                  <p className="text-[11.5px] text-ink-soft/55">
                    {item.brand} · Qty {item.qty}
                  </p>
                </div>
                <span className="text-[13.5px] text-ink">
                  {item.currency}
                  {(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-6">
            <span className="font-display text-xl text-ink">Total</span>
            <span className="font-display text-3xl text-gold-deep">${order.total.toFixed(2)}</span>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button as={Link} to={`/order-tracking/${order.id}`} variant="primary" icon={ArrowRight} className="flex-1 justify-center">
            Track Order
          </Button>
          <Button as={Link} to={`/invoice/${order.id}`} variant="outline" icon={FileText} className="flex-1 justify-center">
            View Invoice
          </Button>
        </div>
        <Link to="/shop" className="block text-center text-[13px] text-ink-soft hover:text-gold-deep mt-6">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] text-ink-soft/60 uppercase tracking-[0.08em] mb-1.5">
        <Icon size={12} />
        {label}
      </div>
      <p className="text-[13.5px] text-ink">{value}</p>
    </div>
  );
}
