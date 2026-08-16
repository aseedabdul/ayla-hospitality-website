import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingBag, ChevronRight, Check, PackageX } from "lucide-react";
import { productService } from "../services/productService";
import { products as fallbackProducts } from "../data/products";
import { categories as fallbackCategories } from "../data/categories";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ui/ProductCard";
import GoldThread from "../components/ui/GoldThread";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function ProductDetail() {
  const { productId } = useParams();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const [product, setProduct] = useState(() =>
    fallbackProducts.find((p) => p.id === productId) || null
  );
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const p = await productService.getProductById(productId);
        if (p) {
          setProduct(p);
          const catRes = await productService.getCategoryById(p.category);
          if (catRes) setCategory(catRes);

          const relRes = await productService.getProducts({ category: p.category, limit: 5 });
          if (relRes?.products) {
            setRelated(relRes.products.filter((item) => item.id !== p.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.warn("Using fallback for product detail:", err.message);
        const fallback = fallbackProducts.find((p) => p.id === productId);
        if (fallback) {
          setProduct(fallback);
          setCategory(fallbackCategories.find((c) => c.id === fallback.category) || null);
          setRelated(
            fallbackProducts
              .filter((p) => p.category === fallback.category && p.id !== fallback.id)
              .slice(0, 4)
          );
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-ivory pt-[110px]">
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="This item may no longer be available."
          ctaLabel="Back to Shop"
          ctaTo="/shop"
        />
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen bg-ivory pt-[110px]" />;
  }

  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    if (!product.available) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="min-h-screen bg-ivory pt-[96px] md:pt-[110px]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8 md:py-12">
        {/* breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-ink-soft/60 mb-8 flex-wrap">
          <Link to="/" className="hover:text-gold-deep">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-gold-deep">
            Shop
          </Link>
          {category && (
            <>
              <ChevronRight size={12} />
              <Link to={`/shop/${category.id}`} className="hover:text-gold-deep">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-ink">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          {/* image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square rounded-[6px] overflow-hidden bg-ivory-deep"
          >
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.tag && (
              <span className="absolute top-5 left-5 bg-ink/90 text-ivory text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full">
                {product.tag}
              </span>
            )}
            {!product.available && (
              <div className="absolute inset-0 bg-ivory/70 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-[12px] tracking-[0.18em] uppercase text-ink-soft border border-ink/30 rounded-full px-4 py-2 bg-ivory">
                  Currently Unavailable
                </span>
              </div>
            )}
          </motion.div>

          {/* info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <span className="text-[11px] tracking-[0.2em] uppercase text-gold-deep font-semibold">
              {product.brand}
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-ink mt-2 mb-1">{product.name}</h1>
            <span className="text-[13px] text-ink-soft/60 mb-5">{product.size}</span>

            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-3xl text-ink">
                {product.currency || "$"}
                {Number(product.price).toFixed(2)}
              </span>
              <span
                className={`text-[11px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border ${
                  product.available
                    ? "text-emerald-800 border-emerald-800/25 bg-emerald-800/10"
                    : "text-red-800 border-red-800/25 bg-red-800/10"
                }`}
              >
                {product.available ? `In Stock (${product.stock ?? 24})` : "Unavailable"}
              </span>
            </div>

            <GoldThread className="mb-6" />

            <p className="text-[15px] text-ink-soft/80 leading-relaxed mb-8 max-w-md">
              {product.description}
            </p>

            <div className="flex items-center gap-5 mb-8">
              <span className="text-[13px] text-ink-soft/70">Quantity</span>
              <div className="inline-flex items-center border border-ink/15 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ink/5 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold text-ink">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ink/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleAdd}
                disabled={!product.available}
                variant="primary"
                icon={added ? Check : ShoppingBag}
                className={!product.available ? "opacity-40 pointer-events-none" : ""}
              >
                {added ? "Added to Cart" : "Add to Cart"}
              </Button>
              <button
                onClick={() => toggle(product.id)}
                aria-label="Toggle wishlist"
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                  wishlisted
                    ? "border-gold-deep bg-gold-deep/10"
                    : "border-ink/15 hover:border-gold-deep"
                }`}
              >
                <Heart
                  size={18}
                  strokeWidth={1.8}
                  className={wishlisted ? "fill-gold-deep text-gold-deep" : "text-ink-soft"}
                />
              </button>
            </div>
          </motion.div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <div className="mt-24 md:mt-32">
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-2">You may also like</h2>
            <GoldThread className="mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
