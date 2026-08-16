import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { productService } from "../../services/productService";
import { products as fallbackProducts, getFeaturedProducts } from "../../data/products";
import { categories as fallbackCategories } from "../../data/categories";
import ProductCard from "../ui/ProductCard";
import SectionHeading from "../ui/SectionHeading";

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [productsList, setProductsList] = useState(fallbackProducts);
  const [categoriesList, setCategoriesList] = useState(fallbackCategories);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({ limit: 50 }),
          productService.getCategories(),
        ]);
        if (prodRes?.products) setProductsList(prodRes.products);
        if (catRes?.categories) setCategoriesList(catRes.categories);
      } catch (err) {
        console.warn("Failed to load featured products from server:", err.message);
      }
    }
    loadCatalog();
  }, []);

  const filters = useMemo(
    () => [
      { id: "all", name: "All Featured" },
      ...categoriesList.map((c) => ({ id: c.id, name: c.name })),
    ],
    [categoriesList]
  );

  const featured = useMemo(() => {
    const tagged = productsList.filter((p) => p.tag);
    const base = tagged.length ? tagged.slice(0, 8) : productsList.slice(0, 8);
    if (activeFilter === "all") return base;
    return productsList.filter((p) => p.category === activeFilter).slice(0, 8);
  }, [activeFilter, productsList]);

  return (
    <section id="featured" className="relative py-24 md:py-32 bg-ivory-deep/40">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeading
          eyebrow="Handpicked For You"
          title="Featured essentials"
          description="A rotating edit of what our guests reach for most — refreshed to reflect quality, comfort and occasion."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-5 py-2.5 rounded-full text-[12px] tracking-[0.06em] uppercase transition-all duration-300 border ${
                activeFilter === f.id
                  ? "bg-ink text-ivory border-ink"
                  : "bg-transparent text-ink-soft border-ink/15 hover:border-gold"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
