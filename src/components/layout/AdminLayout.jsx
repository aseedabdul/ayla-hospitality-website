import { Link, NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  BarChart3,
  LogOut,
} from "lucide-react";
const logo = "/images/ayla-hospitality-logo.png";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Orders", to: "/admin/orders", icon: ClipboardList },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout() {
  const { adminSession, adminLogout } = useAuth();
  const navigate = useNavigate();

  if (!adminSession) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-ivory-deep/30 flex">
      {/* sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] bg-ink text-ivory shrink-0">
        <div className="px-6 py-7 border-b border-ivory/10">
          <img src={logo} alt="AYLA Hospitality" className="h-11 w-auto object-contain bg-ivory rounded-sm p-1" />
          <p className="text-[10px] tracking-[0.2em] uppercase text-gold-soft mt-3">Admin Console</p>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-[13.5px] transition-colors ${
                  isActive
                    ? "bg-gold-deep/90 text-ivory"
                    : "text-ivory/65 hover:bg-ivory/8 hover:text-ivory"
                }`
              }
            >
              <item.icon size={16} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-ivory/10">
          <p className="text-[11px] text-ivory/40 px-4 mb-3 truncate">{adminSession.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-[13.5px] text-ivory/65 hover:bg-ivory/8 hover:text-ivory transition-colors w-full"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Log Out
          </button>
          <Link
            to="/"
            className="block mt-2 px-4 text-[11px] text-ivory/40 hover:text-gold-soft transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-ink text-ivory flex items-center justify-between px-4 h-16">
        <img src={logo} alt="AYLA Hospitality" className="h-8 w-auto object-contain bg-ivory rounded-sm p-0.5" />
        <button onClick={handleLogout} className="text-[12px] text-ivory/70">
          Log Out
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="md:hidden h-16" />
        {/* mobile nav row */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-3 py-3 bg-ivory border-b border-line sticky top-16 z-30">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] whitespace-nowrap transition-colors ${
                  isActive ? "bg-ink text-ivory" : "bg-ivory-deep/60 text-ink-soft"
                }`
              }
            >
              <item.icon size={13} strokeWidth={1.8} />
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="p-5 md:p-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
