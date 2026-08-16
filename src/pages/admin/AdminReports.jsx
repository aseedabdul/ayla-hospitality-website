import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Package, DollarSign, Layers } from "lucide-react";
import { useOrders } from "../../context/OrdersContext";
import { useAdminCatalog } from "../../context/AdminCatalogContext";

export default function AdminReports() {
  const { orders } = useOrders();
  const { products, categories } = useAdminCatalog();

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length ? revenue / orders.length : 0;

  const revenueByCategory = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.id] = 0));
    orders.forEach((o) =>
      o.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          map[product.category] = (map[product.category] || 0) + item.price * item.qty;
        }
      })
    );
    return categories.map((c) => ({ ...c, revenue: map[c.id] || 0 }));
  }, [orders, products, categories]);

  const maxCategoryRevenue = Math.max(...revenueByCategory.map((c) => c.revenue), 1);

  const topProducts = useMemo(() => {
    const counts = {};
    orders.forEach((o) =>
      o.items.forEach((item) => {
        counts[item.productId] = (counts[item.productId] || 0) + item.qty;
      })
    );
    return Object.entries(counts)
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
      .filter((x) => x.product)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders, products]);

  const paymentBreakdown = useMemo(() => {
    const map = { Cash: 0, UPI: 0, Card: 0 };
    orders.forEach((o) => (map[o.paymentMethod] = (map[o.paymentMethod] || 0) + 1));
    return map;
  }, [orders]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Sales Reports</h1>
        <p className="text-[13px] text-ink-soft/60">Performance overview across the AYLA catalogue</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <ReportStat icon={DollarSign} label="Total Revenue" value={`$${revenue.toFixed(2)}`} />
        <ReportStat icon={TrendingUp} label="Avg Order Value" value={`$${avgOrderValue.toFixed(2)}`} />
        <ReportStat icon={Package} label="Total Orders" value={orders.length} />
        <ReportStat icon={Layers} label="Active Products" value={products.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* revenue by category */}
        <div className="bg-white border border-line rounded-[6px] p-6">
          <h3 className="font-display text-xl text-ink mb-6">Revenue by Category</h3>
          <div className="flex flex-col gap-4">
            {revenueByCategory.map((c) => (
              <div key={c.id}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="text-ink">{c.name}</span>
                  <span className="text-ink-soft/60">${c.revenue.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-ivory-deep rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(c.revenue / maxCategoryRevenue) * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gold-deep rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* payment breakdown */}
        <div className="bg-white border border-line rounded-[6px] p-6">
          <h3 className="font-display text-xl text-ink mb-6">Payment Method Breakdown</h3>
          <div className="flex flex-col gap-4">
            {Object.entries(paymentBreakdown).map(([method, count]) => (
              <div key={method}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="text-ink">{method}</span>
                  <span className="text-ink-soft/60">{count} orders</span>
                </div>
                <div className="h-2 bg-ivory-deep rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${orders.length ? (count / orders.length) * 100 : 0}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-ink rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* top products */}
      <div className="bg-white border border-line rounded-[6px] p-6">
        <h3 className="font-display text-xl text-ink mb-6">Top Selling Products</h3>
        <div className="flex flex-col gap-3">
          {topProducts.length === 0 && <p className="text-[13px] text-ink-soft/50">No sales data yet.</p>}
          {topProducts.map(({ product, qty }, i) => (
            <div key={product.id} className="flex items-center gap-4 py-2 border-b border-line/60 last:border-0">
              <span className="font-display text-lg text-gold-deep w-6">{i + 1}</span>
              <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-ink truncate">{product.name}</p>
                <p className="text-[11.5px] text-ink-soft/50">{product.brand}</p>
              </div>
              <span className="text-[13px] text-ink-soft/70">{qty} sold</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-line rounded-[6px] p-5">
      <div className="w-9 h-9 rounded-full bg-gold-deep/10 flex items-center justify-center mb-4">
        <Icon size={16} strokeWidth={1.6} className="text-gold-deep" />
      </div>
      <p className="font-display text-2xl text-ink">{value}</p>
      <p className="text-[11.5px] text-ink-soft/55 mt-1">{label}</p>
    </div>
  );
}
