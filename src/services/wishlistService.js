import { api } from "./api";

export const wishlistService = {
  async getWishlist() {
    return await api.get("/wishlist");
  },

  async toggleWishlist(productId) {
    return await api.post("/wishlist/toggle", { productId });
  },

  async removeItem(productId) {
    return await api.delete(`/wishlist/${encodeURIComponent(productId)}`);
  },
};
