import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Search, Upload } from "lucide-react";
import { useAdminCatalog } from "../../context/AdminCatalogContext";
import { adminService } from "../../services/adminService";
import StatusPill from "../../components/ui/StatusPill";

const emptyForm = {
  name: "",
  brand: "",
  category: "",
  size: "",
  price: "",
  stock: "",
  available: true,
  image: "",
  description: "",
  tag: "",
};

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdminCatalog();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.brand?.toLowerCase().includes(query.toLowerCase())
  );

  const openAdd = () => {
    setForm({ ...emptyForm, category: categories[0]?.id || "" });
    setEditingId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      size: p.size,
      price: p.price,
      stock: p.stock ?? 0,
      available: p.available,
      image: p.image,
      description: p.description,
      currency: p.currency || "$",
      tag: p.tag || "",
    });
    setEditingId(p.id);
    setError("");
    setModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const res = await adminService.uploadImage(file);
      if (res?.url) {
        setForm((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock, 10) || 0,
      currency: form.currency || "$",
      image:
        form.image ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct(payload);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || "Failed to save product.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Products</h1>
          <p className="text-[13px] text-ink-soft/60">{products.length} products in catalogue</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-ink text-ivory rounded-full px-5 py-2.5 text-[12.5px] tracking-[0.06em] uppercase hover:bg-gold-deep transition-colors"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-white border border-line rounded-full pl-10 pr-4 py-2.5 text-[13px] outline-none focus:border-gold-deep transition-colors"
        />
      </div>

      <div className="bg-white border border-line rounded-[6px] overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.06em] text-ink-soft/50 border-b border-line bg-ivory-deep/30">
              <th className="py-3 px-4 font-medium">Product</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th className="py-3 px-4 font-medium">Price</th>
              <th className="py-3 px-4 font-medium">Stock</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0 hover:bg-ivory-deep/20">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-ink truncate">{p.name}</p>
                      <p className="text-[11.5px] text-ink-soft/50">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-[12.5px] text-ink-soft/70 capitalize">
                  {categories.find((c) => c.id === p.category || c.slug === p.category)?.name ||
                    p.category}
                </td>
                <td className="py-3 px-4 text-[13px] text-ink">${Number(p.price)?.toFixed(2)}</td>
                <td className="py-3 px-4 text-[13px] text-ink">{p.stock ?? "—"}</td>
                <td className="py-3 px-4">
                  <StatusPill status={p.available ? "In Stock" : "Low Stock"} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-ivory-deep transition-colors"
                      aria-label="Edit product"
                    >
                      <Pencil size={14} className="text-ink-soft" />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(p.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                      aria-label="Delete product"
                    >
                      <Trash2 size={14} className="text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-[13px] text-ink-soft/50 py-10">No products match your search.</p>
        )}
      </div>

      {/* add/edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="bg-ivory rounded-[6px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-7"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl text-ink">
                  {editingId ? "Edit Product" : "Add Product"}
                </h3>
                <button type="button" onClick={() => setModalOpen(false)}>
                  <X size={18} className="text-ink-soft" />
                </button>
              </div>

              {error && (
                <p className="text-[12px] text-red-700 bg-red-50 border border-red-200 rounded p-2.5 mb-4">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminField label="Product Name" span2>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="admin-input"
                  />
                </AdminField>
                <AdminField label="Brand">
                  <input
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="admin-input"
                  />
                </AdminField>
                <AdminField label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="admin-input"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </AdminField>
                <AdminField label="Size / Quantity">
                  <input
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="admin-input"
                  />
                </AdminField>
                <AdminField label="Price ($)">
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="admin-input"
                  />
                </AdminField>
                <AdminField label="Stock Quantity">
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="admin-input"
                  />
                </AdminField>
                <AdminField label="Availability">
                  <select
                    value={form.available ? "yes" : "no"}
                    onChange={(e) => setForm({ ...form, available: e.target.value === "yes" })}
                    className="admin-input"
                  >
                    <option value="yes">Available</option>
                    <option value="no">Unavailable</option>
                  </select>
                </AdminField>
                <AdminField label="Tag / Badge (e.g. Bestseller, New)">
                  <input
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="Optional tag"
                    className="admin-input"
                  />
                </AdminField>

                <AdminField label="Product Image" span2>
                  <div className="flex gap-2">
                    <input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://… or upload file"
                      className="admin-input flex-1"
                    />
                    <label className="bg-ink text-ivory px-3 py-2 rounded text-[12px] cursor-pointer flex items-center gap-1 hover:bg-gold-deep transition-colors shrink-0">
                      <Upload size={13} />
                      {uploading ? "Uploading…" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </AdminField>

                <AdminField label="Description" span2>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="admin-input resize-none"
                  />
                </AdminField>
              </div>

              <div className="flex gap-3 mt-7">
                <button
                  type="submit"
                  className="flex-1 bg-ink text-ivory rounded-full py-3 text-[13px] tracking-[0.08em] uppercase hover:bg-gold-deep transition-colors"
                >
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 text-[13px] text-ink-soft/60 hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* delete confirm */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory rounded-[6px] w-full max-w-sm p-7 text-center"
            >
              <h3 className="font-display text-xl text-ink mb-2">Delete this product?</h3>
              <p className="text-[13px] text-ink-soft/60 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    deleteProduct(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="flex-1 bg-red-700 text-ivory rounded-full py-2.5 text-[12.5px] tracking-[0.06em] uppercase hover:bg-red-800 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 border border-line rounded-full py-2.5 text-[12.5px] text-ink-soft hover:border-gold-deep transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-input {
          width: 100%;
          background: white;
          border: 1px solid var(--color-line);
          border-radius: 4px;
          padding: 0.6rem 0.8rem;
          font-size: 13px;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus { border-color: var(--color-gold-deep); }
      `}</style>
    </div>
  );
}

function AdminField({ label, children, span2 }) {
  return (
    <label className={`flex flex-col gap-1.5 ${span2 ? "sm:col-span-2" : ""}`}>
      <span className="text-[11.5px] font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
