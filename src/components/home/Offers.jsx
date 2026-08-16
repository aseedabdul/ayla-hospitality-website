import { motion } from "framer-motion";
import { Sparkles, Copy } from "lucide-react";
import { offers } from "../../data/reviews";

export default function Offers() {
  return (
    <section id="offers" className="relative py-24 md:py-28 bg-ink overflow-hidden">
      {/* subtle gold thread texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,var(--color-gold)_0,transparent_35%),radial-gradient(circle_at_80%_70%,var(--color-gold)_0,transparent_40%)]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <span className="text-[11px] tracking-[0.28em] uppercase text-gold-soft font-semibold">
              Guest Privileges
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-ivory mt-3 text-balance">
              Considered offers, for considerate guests
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group relative border border-ivory/12 rounded-[4px] p-7 md:p-8 hover:border-gold/50 transition-colors duration-500"
            >
              <Sparkles size={18} strokeWidth={1.5} className="text-gold-soft mb-6" />
              <h3 className="font-display text-2xl text-ivory mb-2.5">{o.title}</h3>
              <p className="text-[13.5px] text-ivory/60 leading-relaxed mb-6">{o.description}</p>

              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(o.code)}
                className="flex items-center justify-between w-full border border-dashed border-ivory/25 rounded-full px-4 py-2.5 text-ivory/80 hover:border-gold hover:text-gold-soft transition-colors duration-300"
              >
                <span className="text-[12px] tracking-[0.14em]">{o.code}</span>
                <Copy size={13} strokeWidth={1.8} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
