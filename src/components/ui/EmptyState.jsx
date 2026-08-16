import { Link } from "react-router-dom";
import Button from "./Button";

export default function EmptyState({ icon: Icon, title, description, ctaLabel, ctaTo }) {
  return (
    <div className="flex flex-col items-center text-center py-20 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-ivory-deep flex items-center justify-center mb-6">
          <Icon size={26} strokeWidth={1.4} className="text-gold-deep" />
        </div>
      )}
      <h3 className="font-display text-2xl text-ink mb-2">{title}</h3>
      {description && (
        <p className="text-ink-soft/70 text-[14px] max-w-sm mb-7 leading-relaxed">{description}</p>
      )}
      {ctaLabel && ctaTo && (
        <Button as={Link} to={ctaTo} variant="primary">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
