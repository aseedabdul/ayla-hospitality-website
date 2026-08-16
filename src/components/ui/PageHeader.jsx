import { motion } from "framer-motion";
import GoldThread from "./GoldThread";

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="bg-ivory-deep/50 border-b border-line pt-[110px] md:pt-[130px] pb-12 md:pb-14">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && (
            <span className="text-[11px] tracking-[0.28em] uppercase text-gold-deep font-semibold">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl text-ink mt-3 mb-4">{title}</h1>
          <GoldThread />
          {description && (
            <p className="max-w-xl text-ink-soft/75 text-[15px] leading-relaxed mt-4">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
