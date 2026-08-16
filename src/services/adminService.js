import { api } from "./api";

export const adminService = {
  // Get admin dashboard stats
  async getDashboardStats() {
    return await api.get("/admin/stats");
  },

  // Products CRUD
  async createProduct(productData) {
    return await api.post("/products", productData);
  },

  async updateProduct(id, updates) {
    return await api.put(`/products/${encodeURIComponent(id)}`, updates);
  },

  async deleteProduct(id) {
    return await api.delete(`/products/${encodeURIComponent(id)}`);
  },

  // Categories CRUD
  async createCategory(categoryData) {
    return await api.post("/categories", categoryData);
  },

  async updateCategory(id, updates) {
    return await api.put(`/categories/${encodeURIComponent(id)}`, updates);
  },

  async deleteCategory(id) {
    return await api.delete(`/categories/${encodeURIComponent(id)}`);
  },

  // Image Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    return await api.post("/upload", formData);
  },
};
