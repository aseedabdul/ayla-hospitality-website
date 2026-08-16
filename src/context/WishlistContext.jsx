import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { wishlistService } from "../services/wishlistService";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [items, setItems] = useState([]);

  const refreshWishlist = useCallback(async () => {
    try {
      const data = await wishlistService.getWishlist();
      if (data) {
        setIds(data.ids || []);
        setItems(data.items || []);
      }
    } catch (err) {
      console.warn("Failed to load wishlist from server:", err.message);
    }
  }, []);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggle = async (productId) => {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    try {
      const data = await wishlistService.toggleWishlist(productId);
      if (data) {
        setIds(data.ids || []);
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      refreshWishlist();
    }
  };

  const isWishlisted = (productId) => ids.includes(productId);

  const remove = async (productId) => {
    setIds((prev) => prev.filter((id) => id !== productId));
    try {
      const data = await wishlistService.removeItem(productId);
      if (data) {
        setIds(data.ids || []);
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Wishlist remove error:", err);
      refreshWishlist();
    }
  };

  return (
    <WishlistContext.Provider value={{ ids, items, toggle, isWishlisted, remove, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
