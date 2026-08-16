import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { productService } from "../../services/productService";
import { categories as fallbackCategories } from "../../data/categories";
import SectionHeading from "../ui/SectionHeading";

export default function Categories() {
  const [categoriesList, setCategoriesList] = useState(fallbackCategories);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await productService.getCategories();
        if (res?.categories?.length) {
          setCategoriesList(res.categories);
        }
      } catch (err) {
        console.warn("Failed to fetch categories for home:", err.message);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section id="categories" className="relative py-24 md:py-32 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeading
          eyebrow="Curated Amenities"
          title="Everything your stay could ask for"
          description="Five considered categories, each stocked with essentials chosen for the traveler who values comfort, care and convenience."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categoriesList.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/shop/${cat.id}`}
                className={`group relative flex flex-col justify-end overflow-hidden rounded-[4px] aspect-[3/4.2] ${
                  i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent transition-opacity duration-500 group-hover:from-ink/95" />

                <div className="relative z-10 p-5 md:p-6">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold-soft font-semibold">
                    {cat.tagline}
                  </span>
                  <h3 className="font-display text-2xl md:text-[1.7rem] text-ivory mt-1.5 mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-[12.5px] text-ivory/70 leading-relaxed max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-ivory text-[11px] tracking-[0.14em] uppercase">
                    Browse
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-ivory/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:border-gold">
                  <ArrowUpRight size={14} className="text-ivory" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
