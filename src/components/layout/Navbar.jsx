import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import logo from "../../assets/images/ayla-logo.jpeg";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { productService } from "../../services/productService";

const links = [
  { label: "Home", href: "/" },
  { label: "Amenities", href: "/#categories" },
  { label: "Featured", href: "/#featured" },
  { label: "Offers", href: "/offers" },
  { label: "Support", href: "/support" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { ids } = useWishlist();
  const { isAuthenticated, setAuthModalOpen } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Real-time live search suggestions from backend database
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await productService.getProducts({ q: query.trim(), limit: 5 });
        setResults(res.products || []);
      } catch (err) {
        console.warn("Search suggestion error:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/90 backdrop-blur-md border-b border-line shadow-[0_4px_24px_-12px_rgba(20,17,10,0.15)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between h-[76px] md:h-[88px]">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="AYLA Hospitality"
              className="h-[52px] md:h-[62px] w-auto object-contain"
            />
          </Link>

          {/* desktop nav */}
          <nav className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[12.5px] tracking-[0.08em] uppercase text-ink-soft hover:text-gold-deep transition-colors duration-300 relative group"
              >
                {l.label}
                <span className="absolute left-0 -bottom-1.5 w-0 h-[1px] bg-gold-deep transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((s) => !s)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
            >
              <Search size={18} strokeWidth={1.6} className="text-ink" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
            >
              <Heart size={18} strokeWidth={1.6} className="text-ink" />
              {ids.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-deep text-ivory text-[9px] flex items-center justify-center font-semibold">
                  {ids.length}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              aria-label="Profile"
              className="relative hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
            >
              <User size={18} strokeWidth={1.6} className="text-ink" />
              {isAuthenticated && (
                <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-ivory" />
              )}
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
            >
              <ShoppingBag size={18} strokeWidth={1.6} className="text-ink" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-deep text-ivory text-[9px] flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
            >
              <Menu size={20} strokeWidth={1.6} className="text-ink" />
            </button>
          </div>
        </div>

        {/* search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <form onSubmit={submitSearch} className="pb-4 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search amenities, essentials, meals…"
                  className="w-full bg-transparent border-b border-ink/20 focus:border-gold-deep outline-none py-2 text-sm text-ink placeholder:text-ink-soft/50 transition-colors"
                  autoFocus
                />
                {results.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-ivory border border-line rounded-md shadow-lg overflow-hidden z-20">
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-ivory-deep/60 transition-colors"
                      >
                        <img src={p.image} alt="" className="w-9 h-9 rounded object-cover" />
                        <div className="flex flex-col">
                          <span className="text-[13px] text-ink">{p.name}</span>
                          <span className="text-[11px] text-ink-soft/60">{p.brand}</span>
                        </div>
                        <span className="ml-auto text-[12px] font-display text-gold-deep font-semibold">
                          ${p.price.toFixed(2)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-[82%] max-w-[340px] bg-ivory p-8 flex flex-col"
            >
              <div className="flex justify-end mb-10">
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5"
                >
                  <X size={20} className="text-ink" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl text-ink hover:text-gold-deep transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="h-px bg-line my-2" />
                {[
                  ["Wishlist", "/wishlist"],
                  ["Profile", "/profile"],
                  ["My Orders", "/orders"],
                  ["Cart", "/cart"],
                ].map(([label, to]) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl text-ink hover:text-gold-deep transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
