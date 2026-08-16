import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Edit3 } from "lucide-react";
import { myReviews as seedReviews } from "../data/reviews";
import { orders } from "../data/orders";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

// Deliverable-eligible items pulled from delivered orders that haven't been reviewed yet.
function getReviewableItems(reviews) {
  const reviewedIds = new Set(reviews.map((r) => r.productId));
  const delivered = orders.filter((o) => o.status === "Delivered");
  const items = [];
  delivered.forEach((o) =>
    o.items.forEach((item) => {
      if (!reviewedIds.has(item.productId) && !items.find((i) => i.productId === item.productId)) {
        items.push(item);
      }
    })
  );
  return items;
}

export default function Reviews() {
  const [reviews, setReviews] = useState(seedReviews);
  const [drafting, setDrafting] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewable = getReviewableItems(reviews);

  const submitReview = (e) => {
    e.preventDefault();
    if (!drafting) return;
    setReviews((prev) => [
      {
        id: `mr-${Date.now()}`,
        productId: drafting.productId,
        productName: drafting.name,
        rating,
        comment,
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setDrafting(null);
    setComment("");
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader eyebrow="Your Voice" title="Reviews & Ratings" description="Share your experience with items you've received, or revisit what you've written." />

      <div className="max-w-[900px] mx-auto px-5 md:px-10 py-12 md:py-16">
        {reviewable.length > 0 && (
          <div className="mb-12">
            <h3 className="font-display text-2xl text-ink mb-4">Pending Review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviewable.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 bg-white/60 border border-line rounded-[4px] p-4">
                  <img src={item.image} alt="" className="w-12 h-12 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] text-ink truncate">{item.name}</p>
                  </div>
                  <button
                    onClick={() => setDrafting(item)}
                    className="shrink-0 w-9 h-9 rounded-full bg-ink text-ivory flex items-center justify-center hover:bg-gold-deep transition-colors"
                    aria-label="Write review"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {drafting && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={submitReview}
            className="bg-white/60 border border-gold/40 rounded-[6px] p-6 md:p-7 mb-12 overflow-hidden"
          >
            <h4 className="font-display text-xl text-ink mb-4">Review: {drafting.name}</h4>
            <div className="flex items-center gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} onClick={() => setRating(n)}>
                  <Star size={22} className={n <= rating ? "fill-gold text-gold" : "text-ink/15"} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience…"
              className="w-full bg-white border border-line rounded-[4px] p-3 text-[13.5px] outline-none focus:border-gold-deep transition-colors resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button type="submit" variant="primary">Submit Review</Button>
              <button type="button" onClick={() => setDrafting(null)} className="text-[13px] text-ink-soft/60 hover:text-ink">
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        <h3 className="font-display text-2xl text-ink mb-4">Your Reviews</h3>
        {reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Reviews you write will appear here." />
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white/50 border border-line rounded-[4px] p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[14px] font-semibold text-ink">{r.productName}</h4>
                  <span className="text-[11.5px] text-ink-soft/50">{r.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? "fill-gold text-gold" : "text-ink/15"} />
                  ))}
                </div>
                <p className="text-[13.5px] text-ink-soft/75 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
