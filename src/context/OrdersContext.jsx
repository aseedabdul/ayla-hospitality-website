import { createContext, useContext, useState } from "react";
import { orders as seedOrders, ORDER_STATUSES } from "../data/orders";

const OrdersContext = createContext(null);

let orderCounter = 10300;

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(seedOrders);

  const placeOrder = (orderDraft) => {
    orderCounter += 1;
    const newOrder = {
      id: `AYLA-${orderCounter}`,
      status: "Received",
      paymentStatus: orderDraft.paymentMethod === "Cash" ? "Pending" : "Paid",
      placedAt: new Date().toISOString(),
      ...orderDraft,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (id) => orders.find((o) => o.id === id);

  const advanceStatus = (id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = ORDER_STATUSES.indexOf(o.status);
        const next = ORDER_STATUSES[Math.min(idx + 1, ORDER_STATUSES.length - 1)];
        return { ...o, status: next };
      })
    );
  };

  const setStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const setPaymentStatus = (id, paymentStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus } : o)));
  };

  return (
    <OrdersContext.Provider
      value={{ orders, placeOrder, getOrder, advanceStatus, setStatus, setPaymentStatus }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
