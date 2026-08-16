// Signature motif — echoes the wave beneath the A/H in the AYLA mark.
// Used across the site as a quiet, recurring divider.
export default function GoldThread({ className = "", width = 120 }) {
  return (
    <svg
      className={className}
      width={width}
      height="14"
      viewBox="0 0 120 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 10C18 -2 28 14 45 5C62 -4 74 12 91 4C102 -1 110 2 119 7"
        stroke="var(--color-gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
