import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Banknote, Smartphone, CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import { brands } from "../data/brands";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { PackageX } from "lucide-react";

const deliveryOptions = [
  "As Soon As Possible",
  "Within 30 Minutes",
  "In 1 Hour",
  "This Evening",
  "Tomorrow Morning",
  "Choose a Specific Time",
];

const paymentOptions = [
  { id: "Cash", label: "Cash on Delivery", icon: Banknote, note: "Pay in cash when your order arrives." },
  { id: "UPI", label: "UPI", icon: Smartphone, note: "Pay instantly via UPI at checkout." },
  { id: "Card", label: "Card", icon: CreditCard, note: "Credit or debit card, charged securely." },
];

export default function Checkout() {
  const { items, subtotal, discountAmount, discountCode, deliveryFee, total, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { guest } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(guest.hotel);
  const [room, setRoom] = useState(guest.room);
  const [deliveryTime, setDeliveryTime] = useState(deliveryOptions[0]);
  const [customTime, setCustomTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [brandMode, setBrandMode] = useState("none"); // none | select | custom
  const [brandSelect, setBrandSelect] = useState(brands[0] || "");
  const [brandCustom, setBrandCustom] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-[110px]">
        <EmptyState
          icon={PackageX}
          title="Your cart is empty"
          description="Add a few essentials before heading to checkout."
          ctaLabel="Browse Amenities"
          ctaTo="/shop"
        />
      </div>
    );
  }

  const brandPreference =
    brandMode === "select" ? brandSelect : brandMode === "custom" ? brandCustom : "";

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setPlacing(true);

    const order = placeOrder({
      hotel,
      room,
      items: items.map(({ product, qty }) => ({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        size: product.size,
        price: product.price,
        currency: product.currency,
        qty,
      })),
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod: payment,
      requestedTime: deliveryTime === "Choose a Specific Time" ? customTime || "Not specified" : deliveryTime,
      instructions,
      brandPreference: brandPreference || "No preference",
    });

    setTimeout(() => {
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader
        eyebrow="Almost There"
        title="Checkout"
        description="A few details so we can deliver precisely where — and how — you'd like it."
      />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <Link to="/cart" className="inline-flex items-center gap-2 text-[13px] text-ink-soft hover:text-gold-deep mb-8">
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="flex flex-col gap-10">
            {/* delivery details */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/60 border border-line rounded-[4px] p-6 md:p-8"
            >
              <h3 className="font-display text-2xl text-ink mb-6">Delivery Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Hotel Name">
                  <input
                    required
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    className="input-field"
                  />
                </Field>
                <Field label="Room Number">
                  <input
                    required
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="input-field"
                  />
                </Field>
              </div>

              <Field label="Requested Delivery Time" className="mt-5">
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="input-field"
                >
                  {deliveryOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              {deliveryTime === "Choose a Specific Time" && (
                <Field label="Specific Time" className="mt-5">
                  <input
                    type="text"
                    placeholder="e.g. Today, 7:30 PM"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="input-field"
                  />
                </Field>
              )}

              <Field label="Special Instructions (optional)" className="mt-5">
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Allergies, gate codes, preferred contact method…"
                  className="input-field resize-none"
                />
              </Field>
            </motion.section>

            {/* brand preference */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="bg-white/60 border border-line rounded-[4px] p-6 md:p-8"
            >
              <h3 className="font-display text-2xl text-ink mb-2">Brand Preference</h3>
              <p className="text-[13px] text-ink-soft/60 mb-5">
                Have a preferred brand for substitutable items? Let us know.
              </p>
              <div className="flex flex-col gap-3">
                <RadioRow
                  checked={brandMode === "none"}
                  onChange={() => setBrandMode("none")}
                  label="No preference"
                />
                <RadioRow
                  checked={brandMode === "select"}
                  onChange={() => setBrandMode("select")}
                  label="Choose from our brands"
                >
                  {brandMode === "select" && (
                    <select
                      value={brandSelect}
                      onChange={(e) => setBrandSelect(e.target.value)}
                      className="input-field mt-3"
                    >
                      {brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  )}
                </RadioRow>
                <RadioRow
                  checked={brandMode === "custom"}
                  onChange={() => setBrandMode("custom")}
                  label="Type a preferred brand"
                >
                  {brandMode === "custom" && (
                    <input
                      value={brandCustom}
                      onChange={(e) => setBrandCustom(e.target.value)}
                      placeholder="Enter brand name"
                      className="input-field mt-3"
                    />
                  )}
                </RadioRow>
              </div>
            </motion.section>

            {/* payment */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="bg-white/60 border border-line rounded-[4px] p-6 md:p-8"
            >
              <h3 className="font-display text-2xl text-ink mb-6">Payment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {paymentOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setPayment(opt.id)}
                    className={`flex flex-col items-start gap-3 p-5 rounded-[4px] border text-left transition-colors ${
                      payment === opt.id
                        ? "border-gold-deep bg-gold-deep/8"
                        : "border-line hover:border-gold/50"
                    }`}
                  >
                    <opt.icon size={20} strokeWidth={1.6} className="text-gold-deep" />
                    <span className="text-[14px] font-semibold text-ink">{opt.label}</span>
                    <span className="text-[12px] text-ink-soft/60 leading-snug">{opt.note}</span>
                  </button>
                ))}
              </div>
              <p className="flex items-center gap-2 text-[12px] text-ink-soft/50 mt-5">
                <ShieldCheck size={14} />
                This is a UI demonstration only — no real payment is processed.
              </p>
            </motion.section>
          </div>

          {/* summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-fit bg-ink text-ivory rounded-[6px] p-7 md:p-8 sticky top-28"
          >
            <h3 className="font-display text-2xl mb-6">Order Summary</h3>
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1 pb-5 border-b border-ivory/10">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.image} alt="" className="w-12 h-12 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-ivory truncate">{product.name}</p>
                    <p className="text-[11px] text-ivory/50">Qty {qty}</p>
                  </div>
                  <span className="text-[13px] text-ivory/80">
                    {product.currency}
                    {(product.price * qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-[14px] py-5 border-b border-ivory/10">
              <div className="flex justify-between text-ivory/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountCode && (
                <div className="flex justify-between text-gold-soft">
                  <span>Discount</span>
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

            <Button type="submit" variant="gold" className="w-full" disabled={placing}>
              {placing ? "Placing Order…" : "Place Order"}
            </Button>
          </motion.div>
        </form>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: white;
          border: 1px solid var(--color-line);
          border-radius: 4px;
          padding: 0.65rem 0.9rem;
          font-size: 13.5px;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.25s;
        }
        .input-field:focus {
          border-color: var(--color-gold-deep);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[12px] font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function RadioRow({ checked, onChange, label, children }) {
  return (
    <div
      className={`rounded-[4px] border p-4 cursor-pointer transition-colors ${
        checked ? "border-gold-deep bg-gold-deep/6" : "border-line"
      }`}
      onClick={onChange}
    >
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="radio" checked={checked} onChange={onChange} className="w-4 h-4 accent-[var(--color-gold-deep)]" />
        <span className="text-[13.5px] text-ink">{label}</span>
      </label>
      {children}
    </div>
  );
}
