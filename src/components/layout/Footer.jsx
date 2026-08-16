import { Link } from "react-router-dom";
import logo from "../../assets/images/ayla-logo.jpeg";
import { categories } from "../../data/categories";
import GoldThread from "../ui/GoldThread";

// Minimal line-style social marks (lucide no longer ships brand icons).
const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconFacebook = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M15 8h-2a2 2 0 0 0-2 2v10M9 13h6" />
    <path d="M13 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />
  </svg>
);
const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 md:gap-8 pb-14 border-b border-ivory/10">
          {/* brand */}
          <div>
            <img src={logo} alt="AYLA Hospitality" className="h-16 w-auto object-contain mb-5 bg-ivory rounded-sm p-1" />
            <p className="text-ivory/55 text-[13.5px] leading-relaxed max-w-xs mb-5">
              Premium in-room amenities and ordering, crafted for guests who expect
              comfort, care and convenience at every hour.
            </p>
            <GoldThread />
          </div>

          {/* categories */}
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold-soft font-semibold mb-5">
              Amenities
            </h4>
            <ul className="flex flex-col gap-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/shop/${c.id}`}
                    className="text-[13.5px] text-ivory/65 hover:text-gold-soft transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* account */}
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold-soft font-semibold mb-5">
              Guest Account
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                ["Profile", "/profile"],
                ["My Orders", "/orders"],
                ["Wishlist", "/wishlist"],
                ["Offers", "/offers"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-[13.5px] text-ivory/65 hover:text-gold-soft transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold-soft font-semibold mb-5">
              Concierge
            </h4>
            <p className="text-[13.5px] text-ivory/65 mb-2">concierge@aylahospitality.com</p>
            <p className="text-[13.5px] text-ivory/65 mb-6">+1 (800) 555-0192 · Available 24/7</p>
            <div className="flex items-center gap-3">
              {[IconInstagram, IconFacebook, IconX].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-full border border-ivory/15 flex items-center justify-center hover:border-gold hover:text-gold-soft transition-colors"
                >
                  <Icon width={14} height={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8">
          <p className="text-[12px] text-ivory/40">
            © {new Date().getFullYear()} AYLA Hospitality. All rights reserved.
          </p>
          <p className="text-[12px] text-ivory/40 tracking-[0.1em] uppercase">
            Comfort · Care · Convenience
          </p>
        </div>
        <div className="flex justify-center pt-4">
          <Link to="/admin/login" className="text-[11px] text-ivory/25 hover:text-ivory/50 transition-colors">
            Staff &amp; Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
