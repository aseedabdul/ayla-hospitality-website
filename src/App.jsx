import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/layout/Loader";
import SiteLayout from "./components/layout/SiteLayout";
import AdminLayout from "./components/layout/AdminLayout";
import useLenis from "./hooks/useLenis";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { OrdersProvider } from "./context/OrdersContext";
import { AuthProvider } from "./context/AuthContext";
import { AdminCatalogProvider } from "./context/AdminCatalogContext";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";
import ReviewsPage from "./pages/Reviews";
import Invoice from "./pages/Invoice";
import Support from "./pages/Support";
import OffersPage from "./pages/Offers";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";

import AuthModal from "./components/auth/AuthModal";

function AppShell() {
  const [loading, setLoading] = useState(true);
  useLenis();

  return (
    <>
      <AuthModal />
      {loading && <Loader onFinish={() => setLoading(false)} />}
      <div className={`transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"}`}>
        <Routes>
          {/* Guest-facing site */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:categoryId" element={<Shop />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/invoice/:orderId" element={<Invoice />} />
            <Route path="/support" element={<Support />} />
            <Route path="/offers" element={<OffersPage />} />
          </Route>

          {/* Admin console */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrdersProvider>
              <AdminCatalogProvider>
                <AppShell />
              </AdminCatalogProvider>
            </OrdersProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
