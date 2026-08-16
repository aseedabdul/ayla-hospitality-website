import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { cartService } from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [discountCode, setDiscountCode] = useState(null);
  const [serverTotals, setServerTotals] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync cart from API
  const refreshCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      if (data && data.items) {
        setItems(data.items);
        setDiscountCode(data.discountCode || null);
        setServerTotals({
          subtotal: data.subtotal,
          discountAmount: data.discountAmount,
          deliveryFee: data.deliveryFee,
          total: data.total,
          itemCount: data.itemCount,
        });
      }
    } catch (err) {
      console.warn("Failed to fetch cart from server:", err.message);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (product, qty = 1) => {
    // Optimistic UI update
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + qty, quantity: i.qty + qty } : i
        );
      }
      return [...prev, { product, qty, quantity: qty }];
    });

    try {
      const data = await cartService.addItem(product.id, qty);
      if (data && data.items) {
        setItems(data.items);
        setDiscountCode(data.discountCode || null);
        setServerTotals({
          subtotal: data.subtotal,
          discountAmount: data.discountAmount,
          deliveryFee: data.deliveryFee,
          total: data.total,
          itemCount: data.itemCount,
        });
      }
    } catch (err) {
      console.error("Cart addItem error:", err);
      refreshCart();
    }
  };

  const removeItem = async (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    try {
      const data = await cartService.removeItem(productId);
      if (data && data.items) {
        setItems(data.items);
        setDiscountCode(data.discountCode || null);
        setServerTotals({
          subtotal: data.subtotal,
          discountAmount: data.discountAmount,
          deliveryFee: data.deliveryFee,
          total: data.total,
          itemCount: data.itemCount,
        });
      }
    } catch (err) {
      console.error("Cart removeItem error:", err);
      refreshCart();
    }
  };

  const setQty = async (productId, qty) => {
    if (qty < 1) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, qty, quantity: qty } : i))
    );
    try {
      const data = await cartService.updateQuantity(productId, qty);
      if (data && data.items) {
        setItems(data.items);
        setDiscountCode(data.discountCode || null);
        setServerTotals({
          subtotal: data.subtotal,
          discountAmount: data.discountAmount,
          deliveryFee: data.deliveryFee,
          total: data.total,
          itemCount: data.itemCount,
        });
      }
    } catch (err) {
      console.error("Cart setQty error:", err);
      refreshCart();
    }
  };

  const increment = (productId) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) setQty(productId, (item.qty || item.quantity) + 1);
  };

  const decrement = (productId) => {
    const item = items.find((i) => i.product.id === productId);
    if (item) setQty(productId, (item.qty || item.quantity) - 1);
  };

  const clearCart = async () => {
    setItems([]);
    setDiscountCode(null);
    setServerTotals(null);
    try {
      await cartService.clearCart();
    } catch (err) {
      console.error("Cart clearCart error:", err);
    }
  };

  const applyDiscount = async (code) => {
    try {
      const data = await cartService.applyDiscount(code);
      if (data && data.items) {
        setItems(data.items);
        setDiscountCode(data.discountCode || null);
        setServerTotals({
          subtotal: data.subtotal,
          discountAmount: data.discountAmount,
          deliveryFee: data.deliveryFee,
          total: data.total,
          itemCount: data.itemCount,
        });
        return { ok: true };
      }
      return { ok: false };
    } catch (err) {
      console.warn("Apply promo error:", err.message);
      return { ok: false, message: err.message };
    }
  };

  // Local calculation fallback if serverTotals not yet loaded
  const subtotal = useMemo(() => {
    if (serverTotals?.subtotal !== undefined) return serverTotals.subtotal;
    return items.reduce((sum, i) => sum + i.product.price * (i.qty || i.quantity || 1), 0);
  }, [items, serverTotals]);

  const discountRate = useMemo(() => {
    const rates = {
      "AYLA-WELCOME": 0,
      "AYLA-NIGHT10": 0.1,
      "AYLA-WELL15": 0.15,
    };
    return discountCode ? rates[discountCode] ?? 0 : 0;
  }, [discountCode]);

  const discountAmount = useMemo(() => {
    if (serverTotals?.discountAmount !== undefined) return serverTotals.discountAmount;
    return subtotal * discountRate;
  }, [subtotal, discountRate, serverTotals]);

  const deliveryFee = useMemo(() => {
    if (serverTotals?.deliveryFee !== undefined) return serverTotals.deliveryFee;
    return subtotal === 0 || subtotal >= 40 || discountCode === "AYLA-WELCOME" ? 0 : 3.5;
  }, [subtotal, discountCode, serverTotals]);

  const total = useMemo(() => {
    if (serverTotals?.total !== undefined) return serverTotals.total;
    return Math.max(subtotal - discountAmount + deliveryFee, 0);
  }, [subtotal, discountAmount, deliveryFee, serverTotals]);

  const itemCount = useMemo(() => {
    if (serverTotals?.itemCount !== undefined) return serverTotals.itemCount;
    return items.reduce((n, i) => n + (i.qty || i.quantity || 1), 0);
  }, [items, serverTotals]);

  const value = {
    items,
    addItem,
    removeItem,
    setQty,
    increment,
    decrement,
    clearCart,
    applyDiscount,
    discountCode,
    subtotal,
    discountAmount,
    deliveryFee,
    total,
    itemCount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
