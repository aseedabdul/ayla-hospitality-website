import { api } from "./api";

export const cartService = {
  async getCart() {
    return await api.get("/cart");
  },

  async addItem(productId, quantity = 1) {
    return await api.post("/cart/items", { productId, quantity });
  },

  async updateQuantity(productId, quantity) {
    return await api.put("/cart/items", { productId, quantity });
  },

  async removeItem(productId) {
    return await api.delete(`/cart/items/${encodeURIComponent(productId)}`);
  },

  async clearCart() {
    return await api.delete("/cart");
  },

  async applyDiscount(code) {
    return await api.post("/cart/discount", { code });
  },
};
