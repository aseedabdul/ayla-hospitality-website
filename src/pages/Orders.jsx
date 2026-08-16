import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RotateCcw, Eye, FileText, ClipboardList } from "lucide-react";
import { useOrders } from "../context/OrdersContext";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import PageHeader from "../components/ui/PageHeader";
import StatusPill from "../components/ui/StatusPill";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

export default function Orders() {
  const { orders } = useOrders();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) addItem(product, item.qty);
    });
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader eyebrow="Order History" title="My Orders" description="Review your past orders, track current ones, or reorder in a single click." />

      <div className="max-w-[1000px] mx-auto px-5 md:px-10 py-12 md:py-16">
        {orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders yet"
            description="Once you place an order, it will appear here."
            ctaLabel="Browse Amenities"
            ctaTo="/shop"
          />
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-white/60 border border-line rounded-[6px] p-6 md:p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="font-display text-xl text-ink">{order.id}</p>
                    <p className="text-[12px] text-ink-soft/55">
                      {new Date(order.placedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {order.hotel}, Room {order.room}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill status={order.status} />
                    <StatusPill status={order.paymentStatus} />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
                  {order.items.map((item) => (
                    <img
                      key={item.productId}
                      src={item.image}
                      alt={item.name}
                      title={item.name}
                      className="w-14 h-14 rounded object-cover shrink-0"
                    />
                  ))}
                  <span className="text-[12.5px] text-ink-soft/60 ml-1 whitespace-nowrap">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-line">
                  <span className="font-display text-2xl text-ink">${order.total.toFixed(2)}</span>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      onClick={() => handleReorder(order)}
                      variant="outline"
                      icon={RotateCcw}
                      className="!px-4 !py-2.5 text-[11.5px]"
                    >
                      Reorder
                    </Button>
                    <Button
                      as={Link}
                      to={`/order-tracking/${order.id}`}
                      variant="outline"
                      icon={Eye}
                      className="!px-4 !py-2.5 text-[11.5px]"
                    >
                      Track
                    </Button>
                    <Button
                      as={Link}
                      to={`/invoice/${order.id}`}
                      variant="primary"
                      icon={FileText}
                      className="!px-4 !py-2.5 text-[11.5px]"
                    >
                      Invoice
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
