import { api } from "./api";

export const productService = {
  // Get products with optional filtering
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        if (Array.isArray(val)) {
          val.forEach((v) => query.append(key, v));
        } else {
          query.append(key, val);
        }
      }
    });
    const qs = query.toString();
    const endpoint = `/products${qs ? `?${qs}` : ""}`;
    return await api.get(endpoint);
  },

  // Get product by ID
  async getProductById(id) {
    return await api.get(`/products/${encodeURIComponent(id)}`);
  },

  // Get categories
  async getCategories() {
    return await api.get("/categories");
  },

  // Get category by ID
  async getCategoryById(id) {
    return await api.get(`/categories/${encodeURIComponent(id)}`);
  },

  // Get brands
  async getBrands() {
    return await api.get("/brands");
  },
};
