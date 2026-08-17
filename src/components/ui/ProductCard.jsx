import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Plus, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product.available) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col bg-[#101010] border border-[#dfff00]/20 rounded-[18px] overflow-hidden hover:border-[#dfff00]/70 shadow-[0_25px_50px_-25px_rgba(223,255,0,0.2)] transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-[#171717] block">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {product.tag && (
          <span className="absolute top-3 left-3 bg-[#dfff00] text-black text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full font-semibold">
            {product.tag}
          </span>
        )}

        {!product.available && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[11px] tracking-[0.18em] uppercase text-white border border-white/25 rounded-full px-3 py-1.5 bg-black/60">
              Currently Unavailable
            </span>
          </div>
        )}

        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center hover:bg-black transition-colors z-10"
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            className={wishlisted ? "fill-[#dfff00] text-[#dfff00]" : "text-white"}
          />
        </button>
      </Link>

      <div className="flex flex-col gap-1.5 px-4 pt-4 pb-4 flex-1">
        <span className="text-[10px] tracking-[0.14em] uppercase text-[#dfff00] font-semibold">
          {product.brand}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-xl leading-snug text-white hover:text-[#dfff00] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[13px] text-white/70 leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <span className="text-[12px] text-white/50 mt-0.5">{product.size}</span>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#dfff00]/20">
          <span className="font-display text-2xl text-[#dfff00]">
            {product.currency}
            {product.price.toFixed(2)}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.available}
            aria-label="Add to cart"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              product.available
                ? added
                  ? "bg-[#dfff00] text-black"
                  : "bg-black border border-[#dfff00] text-[#dfff00] hover:bg-[#dfff00] hover:text-black"
                : "bg-[#181818] text-white/30 cursor-not-allowed border border-white/10"
            }`}
          >
            {added ? <Check size={15} /> : <Plus size={15} />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
