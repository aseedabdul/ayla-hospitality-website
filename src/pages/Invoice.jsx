import { useParams, Link } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import { useOrders } from "../context/OrdersContext";
const logo = "/images/ayla-hospitality-logo.png";
import StatusPill from "../components/ui/StatusPill";
import EmptyState from "../components/ui/EmptyState";
import { PackageX } from "lucide-react";

export default function Invoice() {
  const { orderId } = useParams();
  const { getOrder } = useOrders();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-ivory pt-[110px]">
        <EmptyState icon={PackageX} title="Invoice not found" ctaLabel="Back to Orders" ctaTo="/orders" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-deep/30 pt-[96px] md:pt-[110px] pb-20 print:bg-white print:pt-0">
      <div className="max-w-[760px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/orders" className="inline-flex items-center gap-2 text-[13px] text-ink-soft hover:text-gold-deep">
            <ArrowLeft size={14} /> Back to Orders
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-ink text-ivory rounded-full px-5 py-2.5 text-[12px] tracking-[0.08em] uppercase hover:bg-gold-deep transition-colors"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>

        <div className="bg-white border border-line rounded-[6px] p-8 md:p-12 print:border-0 print:shadow-none">
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <img src={logo} alt="AYLA Hospitality" className="h-14 w-auto object-contain" />
            <div className="text-right">
              <h1 className="font-display text-2xl text-ink">Invoice</h1>
              <p className="text-[12.5px] text-ink-soft/60">{order.id}</p>
              <p className="text-[12.5px] text-ink-soft/60">
                {new Date(order.placedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-10 pb-8 border-b border-line">
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] text-ink-soft/50 mb-1">Billed To</p>
              <p className="text-[14px] text-ink">{order.hotel}</p>
              <p className="text-[13px] text-ink-soft/70">Room {order.room}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.08em] text-ink-soft/50 mb-1">Payment</p>
              <p className="text-[14px] text-ink">{order.paymentMethod}</p>
              <StatusPill status={order.paymentStatus} className="mt-1" />
            </div>
          </div>

          <table className="w-full text-left mb-8">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.06em] text-ink-soft/50 border-b border-line">
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 font-medium text-center">Qty</th>
                <th className="py-2 font-medium text-right">Price</th>
                <th className="py-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId} className="border-b border-line/60">
                  <td className="py-3 text-[13.5px] text-ink">
                    {item.name}
                    <span className="block text-[11.5px] text-ink-soft/50">{item.brand}</span>
                  </td>
                  <td className="py-3 text-[13.5px] text-ink text-center">{item.qty}</td>
                  <td className="py-3 text-[13.5px] text-ink text-right">
                    {item.currency}
                    {item.price.toFixed(2)}
                  </td>
                  <td className="py-3 text-[13.5px] text-ink text-right">
                    {item.currency}
                    {(item.price * item.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full max-w-[260px] flex flex-col gap-2 text-[13.5px]">
              <div className="flex justify-between text-ink-soft/70">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gold-deep">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink font-semibold text-[16px] pt-2 border-t border-line mt-1">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.instructions && (
            <div className="mt-8 pt-6 border-t border-line">
              <p className="text-[11px] uppercase tracking-[0.08em] text-ink-soft/50 mb-1">Special Instructions</p>
              <p className="text-[13px] text-ink-soft/70">{order.instructions}</p>
            </div>
          )}

          <p className="text-center text-[11.5px] text-ink-soft/40 mt-10">
            Thank you for choosing AYLA Hospitality — Comfort · Care · Convenience
          </p>
        </div>
      </div>
    </div>
  );
}
