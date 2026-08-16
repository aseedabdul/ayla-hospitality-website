import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ qty, onIncrement, onDecrement, size = "md" }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  return (
    <div className="inline-flex items-center border border-ink/15 rounded-full overflow-hidden">
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className={`${dim} flex items-center justify-center text-ink hover:bg-ink/5 transition-colors`}
      >
        <Minus size={13} strokeWidth={2} />
      </button>
      <span className="w-8 text-center text-sm font-semibold text-ink select-none">{qty}</span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        className={`${dim} flex items-center justify-center text-ink hover:bg-ink/5 transition-colors`}
      >
        <Plus size={13} strokeWidth={2} />
      </button>
    </div>
  );
}
