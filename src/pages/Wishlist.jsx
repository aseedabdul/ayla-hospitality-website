import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import PageHeader from "../components/ui/PageHeader";
import ProductCard from "../components/ui/ProductCard";
import EmptyState from "../components/ui/EmptyState";

export default function Wishlist() {
  const { ids, items } = useWishlist();

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader
        eyebrow="Saved For Later"
        title="Your Wishlist"
        description="Amenities you've saved to order whenever you're ready."
      />

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-16">
        {items.length === 0 && ids.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Tap the heart icon on any product to save it here."
            ctaLabel="Browse Amenities"
            ctaTo="/shop"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
