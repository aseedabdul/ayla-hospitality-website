import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { reviews } from "../../data/reviews";
import SectionHeading from "../ui/SectionHeading";

export default function Reviews() {
  return (
    <section className="relative py-24 md:py-32 bg-ivory-deep/40">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeading
          eyebrow="Guest Voices"
          title="Trusted by discerning guests"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col bg-ivory border border-line rounded-[4px] p-7"
            >
              <Quote size={20} strokeWidth={1.5} className="text-gold/60 mb-4" />
              <blockquote className="font-display text-lg text-ink leading-snug italic flex-1">
                "{r.quote}"
              </blockquote>
              <div className="flex items-center gap-0.5 mt-6 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={13}
                    className={s < r.rating ? "fill-gold text-gold" : "text-ink/15"}
                  />
                ))}
              </div>
              <figcaption className="text-[13px]">
                <span className="block text-ink font-semibold">{r.name}</span>
                <span className="text-ink-soft/60">{r.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
