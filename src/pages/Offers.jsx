import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check } from "lucide-react";
import { offers } from "../data/reviews";
import PageHeader from "../components/ui/PageHeader";

export default function Offers() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="min-h-screen bg-ivory">
      <PageHeader eyebrow="Guest Privileges" title="Offers & Discounts" description="Considered savings for our returning guests — apply any code at checkout." />

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-ink text-ivory rounded-[6px] p-7 md:p-8 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,var(--color-gold)_0,transparent_40%)]" />
              <Sparkles size={18} strokeWidth={1.5} className="relative text-gold-soft mb-6" />
              <h3 className="relative font-display text-2xl mb-2.5">{o.title}</h3>
              <p className="relative text-[13.5px] text-ivory/60 leading-relaxed mb-7">{o.description}</p>
              <button
                onClick={() => handleCopy(o.code)}
                className="relative flex items-center justify-between w-full border border-dashed border-ivory/25 rounded-full px-4 py-2.5 text-ivory/80 hover:border-gold hover:text-gold-soft transition-colors"
              >
                <span className="text-[12px] tracking-[0.14em]">{o.code}</span>
                {copied === o.code ? <Check size={13} className="text-gold-soft" /> : <Copy size={13} />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
