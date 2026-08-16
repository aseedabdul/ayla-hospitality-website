import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import Button from "../ui/Button";
import GoldThread from "../ui/GoldThread";

const easeOut = [0.22, 1, 0.36, 1];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.28]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.75]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink"
    >
      {/* image with slow zoom + parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imgScale, y: imgY }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: easeOut }}
      >
        <img
          src="https://loremflickr.com/1800/1200/luxuryhotel,suite,evening?lock=901"
          alt="A serene luxury hotel suite in the evening"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* cinematic overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />

      {/* content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col justify-end pb-20 md:pb-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: easeOut }}
          className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-gold-soft font-semibold mb-6"
        >
          <Compass size={14} strokeWidth={1.6} />
          Concierge, Reimagined
        </motion.span>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.85, duration: 1, ease: easeOut }}
            className="font-display text-ivory text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.5rem] max-w-3xl text-balance"
          >
            Every comfort,
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 1.0, duration: 1, ease: easeOut }}
            className="font-display italic text-gold-soft text-[2.6rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.5rem] max-w-3xl text-balance"
          >
            delivered quietly.
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9, ease: easeOut }}
          className="mt-7 max-w-md text-ivory/75 text-[15px] md:text-base leading-relaxed"
        >
          From travel essentials to a warm meal at midnight — order what you need,
          and let AYLA bring it to your door with the care of a private concierge.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9, ease: easeOut }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Button as="a" href="#categories" variant="gold" icon={ArrowRight}>
            Explore Amenities
          </Button>
          <Button as={Link} to="/shop" variant="ghost">
            Order Now
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-14 hidden md:block"
        >
          <GoldThread width={140} />
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-6 md:right-10 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-ivory/50 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
