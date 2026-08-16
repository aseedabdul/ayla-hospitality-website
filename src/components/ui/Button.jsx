import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-ink text-ivory hover:bg-gold-deep hover:text-ivory border border-ink hover:border-gold-deep",
  gold: "bg-gold text-ivory hover:bg-gold-deep border border-gold hover:border-gold-deep",
  outline:
    "bg-transparent text-ink border border-ink/30 hover:border-gold hover:text-gold-deep",
  ghost: "bg-transparent text-ivory border border-ivory/40 hover:border-gold hover:text-gold-soft",
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
      className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-[13px] tracking-[0.12em] uppercase font-semibold transition-colors duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon size={15} strokeWidth={2} />}
    </Component>
  );
}
