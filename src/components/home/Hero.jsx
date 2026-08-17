import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Leaf, ShieldCheck, Coffee, Bath, Boxes, Gem } from "lucide-react";
import Button from "../ui/Button";

const ease = [0.22, 1, 0.36, 1];

const categories = [
  { label: "Bathroom Amenities", detail: "Shampoo, Conditioner, Soaps & More", icon: Bath },
  { label: "Personal Care", detail: "Dental Kits, Shaving Kits & More", icon: Sparkles },
  { label: "Room Essentials", detail: "Slippers, Laundry Bags, Tissues & More", icon: Boxes },
  { label: "Beverage Essentials", detail: "Tea, Coffee, Water & More", icon: Coffee },
  { label: "Welcome Kits", detail: "Customized Kits for Guests", icon: Gem },
  { label: "Hotel Supplies", detail: "Housekeeping & Hotel Supplies", icon: ShieldCheck },
];

const benefits = [
  { title: "Premium Quality", text: "Carefully selected top-quality products", icon: Sparkles },
  { title: "Eco Friendly", text: "Sustainable choices for a better tomorrow", icon: Leaf },
  { title: "Custom Solutions", text: "Tailored amenities for your brand", icon: Gem },
  { title: "Trusted Supplier", text: "Reliable service with consistent quality", icon: ShieldCheck },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-black text-[#F5F1E8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(230,199,102,0.08),_transparent_25%)]" />
      <div className="relative mx-auto max-w-[1400px] px-5 pb-6 pt-28 md:px-10 md:pb-10 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="grid items-center gap-8 lg:grid-cols-[1.05fr_1.2fr_0.75fr]"
        >
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease }}
            className="max-w-[520px]"
          >
            <p className="mb-5 text-[10px] font-medium tracking-[0.28em] text-[#D4AF37] uppercase">
              Premium Guest Amenities
            </p>
            <h1 className="font-display text-[3.2rem] leading-[0.9] text-[#F5F1E8] sm:text-[4.2rem] lg:text-[5rem]">
              ELEVATE EVERY
              <span className="block text-[#E6C766]">STAY WITH</span>
              <span className="block text-[#F5F1E8]">THOUGHTFUL</span>
              <span className="block text-[#D4AF37]">AMENITIES.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] text-[#F5F1E8]/72 leading-relaxed">
              Curated guest amenities and essentials that reflect your hospitality standards and leave a lasting impression on every guest.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button as="a" href="#categories" variant="primary" icon={ArrowRight}>
                Explore Amenities
              </Button>
              <Button as="a" href="#contact" variant="secondary">
                Request A Quote
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 1, ease }}
            className="relative flex items-center justify-center pb-6 pt-2"
          >
            <div className="absolute inset-x-12 top-12 h-[280px] rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="absolute left-8 top-10 h-28 w-28 rounded-full bg-[#E6C766]/10 blur-3xl" />
            <div className="absolute bottom-4 right-6 h-40 w-40 rounded-full bg-[#E6C766]/8 blur-3xl" />

            <div className="relative h-[420px] w-full max-w-[560px]">
              <div className="absolute left-1/2 top-16 h-44 w-52 -translate-x-1/2 rounded-[34px] border border-[#D4AF37]/20 bg-[radial-gradient(circle_at_50%_25%,_rgba(255,255,255,0.24),_rgba(12,12,12,0.85)_30%,_rgba(8,8,8,1)_60%)] shadow-[0_28px_55px_rgba(0,0,0,0.6)]" style={{ transform: "perspective(1200px) rotateX(12deg) rotateY(-9deg)" }} />

              <div className="absolute left-[18%] top-[98px] h-[178px] w-[74px] rounded-[22px] border border-[#D4AF37]/20 bg-[linear-gradient(180deg,#121212,#050505)] shadow-[0_18px_32px_rgba(0,0,0,0.55)]" style={{ transform: "rotate(-18deg)" }} />
              <div className="absolute left-[18%] top-[122px] h-[150px] w-[64px] rounded-[18px] border border-[#D4AF37]/15 bg-[linear-gradient(180deg,#1a1a1a,#0a0a0a)]" style={{ transform: "rotate(-18deg)" }} />
              <div className="absolute left-[22%] top-[110px] h-14 w-16 rounded-full bg-[#D4AF37]/25 blur-xl" style={{ transform: "rotate(-18deg)" }} />

              <div className="absolute right-[18%] top-[128px] h-[182px] w-[94px] rounded-[18px] border border-[#D4AF37]/20 bg-[linear-gradient(180deg,#262626,#0d0d0d)] shadow-[0_18px_32px_rgba(0,0,0,0.5)]" style={{ transform: "rotate(18deg)" }} />
              <div className="absolute right-[22%] top-[144px] h-[126px] w-[80px] rounded-[14px] border border-[#D4AF37]/15 bg-[linear-gradient(180deg,#1e1e1e,#090909)]" style={{ transform: "rotate(18deg)" }} />

              <div className="absolute left-[40%] top-[160px] h-[126px] w-[110px] rounded-[22px] border border-[#D4AF37]/18 bg-[linear-gradient(180deg,#1c1c1c,#090909)] shadow-[0_18px_28px_rgba(0,0,0,0.55)]" style={{ transform: "rotate(-7deg)" }} />
              <div className="absolute left-[43%] top-[176px] h-[90px] w-[68px] rounded-[12px] border border-[#D4AF37]/12 bg-[linear-gradient(180deg,#121212,#080808)]" style={{ transform: "rotate(-7deg)" }} />

              <div className="absolute left-[54%] top-[136px] h-[42px] w-[118px] rounded-[22px] border border-[#D4AF37]/18 bg-[linear-gradient(180deg,#111111,#050505)] shadow-[0_16px_28px_rgba(0,0,0,0.5)]" style={{ transform: "rotate(11deg)" }} />
              <div className="absolute left-[57%] top-[172px] h-[24px] w-[112px] rounded-[14px] border border-[#D4AF37]/18 bg-[linear-gradient(180deg,#171717,#080808)]" style={{ transform: "rotate(11deg)" }} />

              <div className="absolute left-[31%] bottom-[0] h-[108px] w-[270px] rounded-[40px] border border-[#D4AF37]/20 bg-[radial-gradient(circle_at_50%_25%,_rgba(255,255,255,0.2),_rgba(28,28,28,0.9)_30%,_rgba(8,8,8,1)_70%)] shadow-[0_28px_55px_rgba(0,0,0,0.62)]" style={{ transform: "rotate(-3deg)" }} />

              <div className="absolute left-[34%] bottom-[28px] h-[72px] w-[172px] rounded-[24px] bg-[linear-gradient(180deg,#f2efe8,#d7d0c5)] shadow-[0_14px_22px_rgba(0,0,0,0.3)]" style={{ transform: "rotate(-4deg)" }} />
              <div className="absolute left-[31%] bottom-[36px] h-[40px] w-[170px] rounded-[20px] bg-[linear-gradient(180deg,#f8f4ef,#eae3d8)] opacity-95" style={{ transform: "rotate(-4deg)" }} />
              <div className="absolute left-[53%] bottom-[30px] h-[70px] w-[54px] rounded-[18px] bg-[linear-gradient(180deg,#f2efe8,#d7d0c5)] shadow-[0_8px_18px_rgba(0,0,0,0.2)]" style={{ transform: "rotate(-8deg)" }} />

              <div className="absolute left-[48%] bottom-[102px] h-[66px] w-[90px] rounded-[24px] border border-[#D4AF37]/12 bg-[linear-gradient(180deg,#0d0d0d,#000000)] shadow-[0_18px_28px_rgba(0,0,0,0.45)]" style={{ transform: "rotate(-5deg)" }} />
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease }}
            className="relative z-10 hidden xl:block"
          >
            <div className="rounded-[26px] border border-[#D4AF37]/20 bg-[#0a0a0a]/70 p-5 shadow-[0_18px_35px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <div className="space-y-4">
                {benefits.map(({ title, text, icon: Icon }) => (
                  <div key={title} className="flex items-start gap-3 border-b border-[#D4AF37]/10 pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/8 text-[#D4AF37]">
                      <Icon size={15} strokeWidth={1.7} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">{title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#F5F1E8]/72">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease }}
          className="mt-10 rounded-[20px] border border-[#D4AF37]/20 bg-[#0b0b0b]/80 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm"
        >
          <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
            {categories.map(({ label, detail, icon: Icon }) => (
              <div key={label} className="flex items-start gap-3 rounded-[14px] border border-[#D4AF37]/10 bg-transparent px-3 py-3 text-left">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/35 text-[#D4AF37]">
                  <Icon size={15} strokeWidth={1.7} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">{label}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#F5F1E8]/65">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
