import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, PhoneCall } from "lucide-react";
import Button from "../ui/Button";
import GoldThread from "../ui/GoldThread";

export default function SupportCTA() {
  return (
    <section id="support" className="relative py-24 md:py-28 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-ink rounded-[6px] px-6 py-16 md:px-16 md:py-20 flex flex-col items-center text-center overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_50%_0%,var(--color-gold)_0,transparent_45%)]" />

          <span className="relative text-[11px] tracking-[0.28em] uppercase text-gold-soft font-semibold mb-5">
            Always Within Reach
          </span>
          <h2 className="relative font-display text-4xl md:text-5xl text-ivory max-w-xl text-balance mb-5">
            Our concierge team is here, day or night
          </h2>
          <GoldThread className="relative mb-6" />
          <p className="relative text-ivory/65 max-w-md text-[15px] leading-relaxed mb-10">
            Questions about an order, a special request, or simply unsure what to choose —
            reach us any time and we'll take it from there.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <Button as={Link} to="/support" variant="gold" icon={MessageCircle}>
              Chat with Concierge
            </Button>
            <Button variant="ghost" icon={PhoneCall}>
              Call Support
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
