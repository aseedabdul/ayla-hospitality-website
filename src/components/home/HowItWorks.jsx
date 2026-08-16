import { motion } from "framer-motion";
import { howItWorks } from "../../data/reviews";
import SectionHeading from "../ui/SectionHeading";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-ivory">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <SectionHeading
          eyebrow="The Experience"
          title="How it works"
          description="A quiet, four-step rhythm designed to feel less like ordering, and more like being looked after."
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {/* connecting line desktop */}
          <div className="hidden lg:block absolute top-[22px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-line to-transparent" />

          {howItWorks.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-start"
            >
              <div className="relative z-10 w-11 h-11 rounded-full bg-ivory border border-gold/50 flex items-center justify-center font-display text-lg text-gold-deep mb-5">
                {i + 1}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold-deep font-semibold mb-1.5">
                {s.step}
              </span>
              <h3 className="font-display text-2xl text-ink mb-2">{s.title}</h3>
              <p className="text-[13.5px] text-ink-soft/75 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
