import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { productService } from "../services/productService";
import { adminService } from "../services/adminService";
import { products as seedProducts } from "../data/products";
import { categories as seedCategories } from "../data/categories";

const AdminCatalogContext = createContext(null);

export function AdminCatalogProvider({ children }) {
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(seedCategories);
  const [loading, setLoading] = useState(true);

  const refreshCatalog = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({ limit: 200 }),
        productService.getCategories(),
      ]);

      if (prodRes && prodRes.products) {
        setProducts(prodRes.products);
      }
      if (catRes && catRes.categories) {
        setCategories(catRes.categories);
      }
    } catch (err) {
      console.warn("Failed to fetch catalog from server:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const addProduct = async (productData) => {
    try {
      const res = await adminService.createProduct(productData);
      await refreshCatalog();
      return res.product;
    } catch (err) {
      console.error("AddProduct error:", err);
      throw err;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const res = await adminService.updateProduct(id, updates);
      await refreshCatalog();
      return res.product;
    } catch (err) {
      console.error("UpdateProduct error:", err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await adminService.deleteProduct(id);
      await refreshCatalog();
    } catch (err) {
      console.error("DeleteProduct error:", err);
      throw err;
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const res = await adminService.createCategory(categoryData);
      await refreshCatalog();
      return res.category;
    } catch (err) {
      console.error("AddCategory error:", err);
      throw err;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const res = await adminService.updateCategory(id, updates);
      await refreshCatalog();
      return res.category;
    } catch (err) {
      console.error("UpdateCategory error:", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await adminService.deleteCategory(id);
      await refreshCatalog();
    } catch (err) {
      console.error("DeleteCategory error:", err);
      throw err;
    }
  };

  return (
    <AdminCatalogContext.Provider
      value={{
        products,
        categories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCatalog,
      }}
    >
      {children}
    </AdminCatalogContext.Provider>
  );
}

export function useAdminCatalog() {
  const ctx = useContext(AdminCatalogContext);
  if (!ctx) throw new Error("useAdminCatalog must be used within AdminCatalogProvider");
  return ctx;
}
