import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-ivory flex flex-col items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="relative w-[220px] sm:w-[280px]">
            {/* path */}
            <svg viewBox="0 0 280 24" width="100%" height="24" className="overflow-visible">
              <motion.line
                x1="6"
                y1="12"
                x2="274"
                y2="12"
                stroke="var(--color-line)"
                strokeWidth="1"
              />
              <motion.line
                x1="6"
                y1="12"
                x2="274"
                y2="12"
                stroke="var(--color-gold)"
                strokeWidth="1.4"
                strokeDasharray="0 268"
                animate={{ strokeDasharray: ["0 268", "268 268"] }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              />
              {/* origin dot */}
              <circle cx="6" cy="12" r="3" fill="var(--color-ink)" />
              {/* destination dot */}
              <circle cx="274" cy="12" r="3" fill="var(--color-gold-deep)" />

              {/* moving order marker */}
              <motion.g
                animate={{ x: [0, 268] }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              >
                <circle cx="6" cy="12" r="7" fill="var(--color-ivory)" stroke="var(--color-gold)" strokeWidth="1.2" />
                <rect x="2" y="8" width="8" height="8" rx="1" fill="var(--color-gold-deep)" />
              </motion.g>
            </svg>

            {/* labels */}
            <div className="flex justify-between mt-4 text-[9px] sm:text-[10px] tracking-[0.16em] uppercase">
              <motion.span
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.4] }}
                transition={{ duration: 1.3, times: [0, 0.15, 1] }}
                className="text-ink-soft"
              >
                Order
              </motion.span>
              <motion.span
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 1, 0.4] }}
                transition={{ duration: 1.3, times: [0, 0.45, 0.8, 1] }}
                className="text-ink-soft"
              >
                On the Way
              </motion.span>
              <motion.span
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 0.3, 1] }}
                transition={{ duration: 1.3, times: [0, 0.8, 1] }}
                className="text-gold-deep font-semibold"
              >
                Hotel
              </motion.span>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 font-display text-lg tracking-[0.08em] text-ink-soft/70 italic"
          >
            AYLA Hospitality
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
