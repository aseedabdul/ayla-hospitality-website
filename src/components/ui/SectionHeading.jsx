import { motion } from "framer-motion";
import GoldThread from "./GoldThread";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}) {
  const alignClass =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <motion.div
      className={`flex flex-col ${alignClass} gap-4 mb-12 md:mb-16`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <span className="text-[11px] tracking-[0.28em] uppercase text-gold-deep font-semibold">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.05] text-ink text-balance">
        {title}
      </h2>
      <GoldThread />
      {description && (
        <p className="max-w-xl text-ink-soft/80 text-[15px] md:text-base leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
