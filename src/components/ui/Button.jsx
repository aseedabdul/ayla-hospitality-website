import { motion } from "framer-motion";

const variants = {
  primary: "bg-[#D4AF37] text-black hover:bg-[#E6C766] border border-[#D4AF37] shadow-[0_12px_26px_rgba(212,175,55,0.18)]",
  secondary: "bg-transparent text-[#F5F1E8] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
  gold: "bg-[#D4AF37] text-black hover:bg-[#E6C766] border border-[#D4AF37] shadow-[0_12px_26px_rgba(212,175,55,0.18)]",
  outline: "bg-transparent text-[#F5F1E8] border border-[#D4AF37]/80 hover:border-[#E6C766] hover:text-[#E6C766]",
  ghost: "bg-black/20 text-[#F5F1E8] border border-white/20 hover:border-[#D4AF37] hover:text-[#E6C766]",
};

const motionCache = new Map();

function getMotionComponent(as) {
  if (typeof as === "string") {
    return motion[as] || motion.button;
  }
  if (!motionCache.has(as)) {
    motionCache.set(as, motion(as));
  }
  return motionCache.get(as);
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  as = "button",
  icon: Icon,
  ...props
}) {
  const Component = getMotionComponent(as);

  return (
    <Component
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[13px] tracking-[0.12em] uppercase font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon size={15} strokeWidth={2} />}
    </Component>
  );
}
