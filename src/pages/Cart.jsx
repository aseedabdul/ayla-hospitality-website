import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import QuantityStepper from "../components/ui/QuantityStepper";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

export default function Cart() {
  const {
    items,
    increment,
    decrement,
    removeItem,
    subtotal,
    discountAmount,
    discountCode,
    deliveryFee,
    total,
    applyDiscount,
  } = useCart();
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState(null);
  const navigate = useNavigate();

  const handlePromo = (e) => {
    e.preventDefault();
    if (!promo.trim()) return;
    const res = applyDiscount(promo);
    setPromoMsg(res.ok ? "success" : "error");
    setTimeout(() => setPromoMsg(null), 2500);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader
        eyebrow="Your Selection"
        title="Shopping Cart"
        description="Review your amenities before checkout — quantities and discounts update in real time."
      />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16">
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Explore our curated amenities and add what your stay needs."
            ctaLabel="Browse Amenities"
            ctaTo="/shop"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            {/* items */}
            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {items.map(({ product, qty }) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
                    className="flex gap-4 md:gap-5 bg-white/60 border border-line rounded-[4px] p-4 md:p-5"
                  >
                    <Link to={`/product/${product.id}`} className="shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 md:w-28 md:h-28 rounded-[3px] object-cover"
                      />
                    </Link>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[10px] tracking-[0.14em] uppercase text-gold-deep font-semibold">
                            {product.brand}
                          </span>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-display text-lg md:text-xl text-ink truncate hover:text-gold-deep transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <span className="text-[12px] text-ink-soft/60">{product.size}</span>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label="Remove item"
                          className="shrink-0 w-8 h-8 flex items-center justify-center text-ink-soft/50 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} strokeWidth={1.6} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-auto pt-3">
                        <QuantityStepper
                          qty={qty}
                          onIncrement={() => increment(product.id)}
                          onDecrement={() => decrement(product.id)}
                          size="sm"
                        />
                        <span className="font-display text-xl text-ink">
                          {product.currency}
                          {(product.price * qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[13px] text-ink-soft hover:text-gold-deep transition-colors mt-2 w-fit"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-fit bg-ink text-ivory rounded-[6px] p-7 md:p-8"
            >
              <h3 className="font-display text-2xl mb-6">Order Summary</h3>

              <form onSubmit={handlePromo} className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                  <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/40" />
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code"
                    className="w-full bg-ivory/8 border border-ivory/15 rounded-full pl-9 pr-3 py-2.5 text-[13px] text-ivory placeholder:text-ivory/40 outline-none focus:border-gold-soft transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-full bg-gold-deep text-ivory text-[12px] tracking-[0.08em] uppercase hover:bg-gold transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoMsg === "success" && (
                <p className="text-[12px] text-gold-soft -mt-4 mb-4">Promo code applied.</p>
              )}
              {promoMsg === "error" && (
                <p className="text-[12px] text-red-300 -mt-4 mb-4">Invalid or expired code.</p>
              )}

              <div className="flex flex-col gap-3 text-[14px] pb-5 border-b border-ivory/10">
                <div className="flex justify-between text-ivory/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountCode && (
                  <div className="flex justify-between text-gold-soft">
                    <span>Discount ({discountCode})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ivory/70">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? "Complimentary" : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-5">
                <span className="font-display text-xl">Total</span>
                <span className="font-display text-3xl text-gold-soft">${total.toFixed(2)}</span>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                variant="gold"
                icon={ArrowRight}
                className="w-full"
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
