import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { productService } from "../services/productService";
import { products as fallbackProducts } from "../data/products";
import { categories as fallbackCategories } from "../data/categories";
import ProductCard from "../components/ui/ProductCard";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

export default function Shop() {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [productsList, setProductsList] = useState(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availability, setAvailability] = useState("all"); // all | available | unavailable
  const [maxPrice, setMaxPrice] = useState(100);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load categories and products from backend API
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({ limit: 200 }),
          productService.getCategories(),
        ]);
        if (prodRes?.products) setProductsList(prodRes.products);
        if (catRes?.categories) setCategoriesList(catRes.categories);
      } catch (err) {
        console.warn("Using fallback catalog data:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const activeCategory = categoriesList.find((c) => c.id === categoryId || c.slug === categoryId);

  const maxPriceCeiling = useMemo(() => {
    if (!productsList.length) return 100;
    return Math.ceil(Math.max(...productsList.map((p) => p.price)));
  }, [productsList]);

  useEffect(() => {
    if (maxPriceCeiling > 0 && maxPrice === 100) {
      setMaxPrice(maxPriceCeiling);
    }
  }, [maxPriceCeiling]);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const categoryBrands = useMemo(() => {
    const pool = categoryId
      ? productsList.filter((p) => p.category === categoryId || p.categorySlug === categoryId)
      : productsList;
    return [...new Set(pool.map((p) => p.brand))].sort();
  }, [categoryId, productsList]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filtered = useMemo(() => {
    let list = categoryId
      ? productsList.filter((p) => p.category === categoryId || p.categorySlug === categoryId)
      : [...productsList];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.length) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    if (availability === "available") list = list.filter((p) => p.available);
    if (availability === "unavailable") list = list.filter((p) => !p.available);

    list = list.filter((p) => p.price <= maxPrice);

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [categoryId, productsList, query, selectedBrands, availability, maxPrice, sort]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setAvailability("all");
    setMaxPrice(maxPriceCeiling);
    setSort("featured");
    setQuery("");
    setSearchParams({});
  };

  const activeFilterCount =
    selectedBrands.length + (availability !== "all" ? 1 : 0) + (maxPrice < maxPriceCeiling ? 1 : 0);

  return (
    <div className="min-h-screen bg-ivory">
      {activeCategory ? (
        <div className="relative h-[36vh] min-h-[260px] overflow-hidden pt-[76px] md:pt-[88px]">
          <img
            src={activeCategory.image}
            alt={activeCategory.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ink/45 to-ink/15" />
          <div className="absolute inset-0 flex flex-col justify-end max-w-[1400px] mx-auto px-5 md:px-10 pb-10">
            <span className="text-[11px] tracking-[0.28em] uppercase text-gold-soft font-semibold mb-2">
              {activeCategory.tagline}
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-ivory">{activeCategory.name}</h1>
          </div>
        </div>
      ) : (
        <PageHeader
          eyebrow="Full Catalogue"
          title="Shop All Amenities"
          description="Browse every essential across AYLA Hospitality — filter by brand, availability and price to find exactly what you need."
        />
      )}

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16">
        {activeCategory && (
          <p className="max-w-xl text-ink-soft/80 leading-relaxed mb-10">
            {activeCategory.description}
          </p>
        )}

        {/* search + sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="flex-1 bg-white/70 border border-line rounded-full px-5 py-3 text-sm text-ink placeholder:text-ink-soft/50 outline-none focus:border-gold-deep transition-colors"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/70 border border-line rounded-full px-5 py-3 text-sm text-ink outline-none focus:border-gold-deep transition-colors"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 bg-ink text-ivory rounded-full px-5 py-3 text-sm"
          >
            <SlidersHorizontal size={15} />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
          {/* desktop filters */}
          <aside className="hidden lg:block">
            <FilterPanel
              categoryBrands={categoryBrands}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              availability={availability}
              setAvailability={setAvailability}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              maxPriceCeiling={maxPriceCeiling}
              resetFilters={resetFilters}
            />
          </aside>

          {/* results */}
          <div>
            <p className="text-[13px] text-ink-soft/60 mb-5">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
              {query.trim() && <> for "<span className="text-ink">{query}</span>"</>}
            </p>

            {filtered.length ? (
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </motion.div>
            ) : (
              <EmptyState
                icon={PackageSearch}
                title="No items match your filters"
                description="Try adjusting your search or clearing filters to see more products."
              />
            )}
          </div>
        </div>
      </div>

      {/* mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-ivory p-7 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-2xl text-ink">Filters</h3>
                <button onClick={() => setFiltersOpen(false)} className="w-9 h-9 flex items-center justify-center">
                  <X size={20} className="text-ink" />
                </button>
              </div>
              <FilterPanel
                categoryBrands={categoryBrands}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                availability={availability}
                setAvailability={setAvailability}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                maxPriceCeiling={maxPriceCeiling}
                resetFilters={resetFilters}
              />
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full mt-8 bg-ink text-ivory rounded-full py-3.5 text-sm tracking-[0.1em] uppercase"
              >
                Show {filtered.length} Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPanel({
  categoryBrands,
  selectedBrands,
  toggleBrand,
  availability,
  setAvailability,
  maxPrice,
  setMaxPrice,
  maxPriceCeiling,
  resetFilters,
}) {
  return (
    <div className="flex flex-col gap-9">
      <div className="flex items-center justify-between">
        <span className="text-[11px] tracking-[0.2em] uppercase text-gold-deep font-semibold">
          Refine
        </span>
        <button onClick={resetFilters} className="text-[12px] text-ink-soft/60 hover:text-gold-deep">
          Reset
        </button>
      </div>

      <div>
        <h4 className="text-[13px] font-semibold text-ink mb-4">Brand</h4>
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
          {categoryBrands.map((b) => (
            <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="w-4 h-4 accent-[var(--color-gold-deep)]"
              />
              <span className="text-[13.5px] text-ink-soft group-hover:text-ink transition-colors">
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[13px] font-semibold text-ink mb-4">Availability</h4>
        <div className="flex flex-col gap-3">
          {[
            ["all", "All Items"],
            ["available", "In Stock"],
            ["unavailable", "Currently Unavailable"],
          ].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="availability"
                checked={availability === val}
                onChange={() => setAvailability(val)}
                className="w-4 h-4 accent-[var(--color-gold-deep)]"
              />
              <span className="text-[13.5px] text-ink-soft group-hover:text-ink transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[13px] font-semibold text-ink mb-4">
          Max Price: <span className="text-gold-deep">${maxPrice}</span>
        </h4>
        <input
          type="range"
          min="0"
          max={maxPriceCeiling}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--color-gold-deep)]"
        />
      </div>
    </div>
  );
}
