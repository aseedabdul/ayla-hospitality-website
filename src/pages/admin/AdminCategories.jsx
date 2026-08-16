import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { useAdminCatalog } from "../../context/AdminCatalogContext";
import { adminService } from "../../services/adminService";

const emptyForm = { name: "", tagline: "", description: "", image: "" };

export default function AdminCategories() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdminCatalog();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setForm({ name: c.name, tagline: c.tagline || "", description: c.description || "", image: c.image || "" });
    setEditingId(c.id);
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

    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        const id = form.name.toLowerCase().trim().replace(/\s+/g, "-");
        await addCategory({
          id,
          ...form,
          image:
            form.image ||
            `https://loremflickr.com/900/1100/${encodeURIComponent(form.name)}?lock=${Math.floor(Math.random() * 999)}`,
        });
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || "Failed to save category.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Categories</h1>
          <p className="text-[13px] text-ink-soft/60">{categories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-ink text-ivory rounded-full px-5 py-2.5 text-[12.5px] tracking-[0.06em] uppercase hover:bg-gold-deep transition-colors"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.id || p.categorySlug === c.id).length;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-line rounded-[6px] overflow-hidden"
            >
              <img src={c.image} alt={c.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-lg text-ink">{c.name}</h3>
                  <span className="text-[11px] text-ink-soft/50">{count} items</span>
                </div>
                <p className="text-[12.5px] text-ink-soft/60 mb-4 line-clamp-2">{c.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-line rounded-full py-2 text-[11.5px] text-ink-soft hover:border-gold-deep transition-colors"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(c.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 rounded-full py-2 text-[11.5px] text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* modal */}
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
              className="bg-ivory rounded-[6px] w-full max-w-md p-7"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl text-ink">
                  {editingId ? "Edit Category" : "Add Category"}
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

              <div className="flex flex-col gap-4">
                <AdminField label="Name">
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input2" />
                </AdminField>
                <AdminField label="Tagline">
                  <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="admin-input2" />
                </AdminField>
                <AdminField label="Description">
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input2 resize-none" />
                </AdminField>
                <AdminField label="Image">
                  <div className="flex gap-2">
                    <input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://… or upload"
                      className="admin-input2 flex-1"
                    />
                    <label className="bg-ink text-ivory px-3 py-2 rounded text-[12px] cursor-pointer flex items-center gap-1 hover:bg-gold-deep transition-colors shrink-0">
                      <Upload size={13} />
                      {uploading ? "…" : "Upload"}
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </AdminField>
              </div>
              <div className="flex gap-3 mt-7">
                <button type="submit" className="flex-1 bg-ink text-ivory rounded-full py-3 text-[13px] tracking-[0.08em] uppercase hover:bg-gold-deep transition-colors">
                  {editingId ? "Save Changes" : "Add Category"}
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 text-[13px] text-ink-soft/60 hover:text-ink">
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

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
              <h3 className="font-display text-xl text-ink mb-2">Delete this category?</h3>
              <p className="text-[13px] text-ink-soft/60 mb-6">Products in this category will remain but lose their grouping.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    deleteCategory(confirmDeleteId);
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
        .admin-input2 {
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
        .admin-input2:focus { border-color: var(--color-gold-deep); }
      `}</style>
    </div>
  );
}

function AdminField({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
