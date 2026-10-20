import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { Toaster } from 'sonner';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

import {
  CategoryPage,
  ProductPage,
  SearchPage,
  CollectionsPage,
  CartPage,
  WishlistPage,
  AccountPage,
  CheckoutPage,
  TryOnPage,
  GoldRatePage,
  JourneyPage,
  GenericPage,
  NotFound,
} from './pages/ShopPages';

import { ShopProvider } from './context/ShopContext';
import BrandIntro from './components/common/BrandIntro';

const pageMap = [
  ['/orders', 'Order History'],
  ['/order/:id', 'Order Details'],
  ['/track-order', 'Order Tracking'],
  ['/invoice/:id', 'Invoice'],
  ['/reviews', 'Reviews'],
  ['/stores', 'Store Locator'],
  ['/appointments', 'Appointment Booking'],
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms and Conditions'],
  ['/shipping', 'Shipping Policy'],
  ['/returns', 'Returns and Exchanges'],
  ['/cancellation', 'Cancellation Policy'],
  ['/care', 'Jewellery Care'],
  ['/faq', 'FAQ'],
  ['/contact', 'Contact Us'],
  ['/account/addresses', 'Saved Addresses'],
  ['/account/profile', 'Customer Profile'],
  ['/account/verify-email', 'Email Verification'],
  ['/account/forgot-password', 'Forgot Password'],
  ['/account/reset-password', 'Reset Password'],
];

function ScrollTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Temporary frontend guard.
// The backend must also enforce administrator permissions.
function AdminRoute({ children }) {
  const token = localStorage.getItem('vasuki_token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(localStorage.getItem('vasuki_user') || 'null');
  } catch {
    user = null;
  }

  if (user?.role !== 'admin') {
    localStorage.removeItem('vasuki_token');
    localStorage.removeItem('vasuki_user');

    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function Shell() {
  const loc = useLocation();
  const isAdminPath = loc.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <BrandIntro />}

      <ScrollTop />

      {!isAdminPath && <Header />}

      <Routes>
        {/* Storefront */}
        <Route path="/" element={<Home />} />

        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route
          path="/category/:slug/:subslug"
          element={<CategoryPage />}
        />

        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/collections" element={<CollectionsPage />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/try-on" element={<TryOnPage />} />
        <Route path="/gold-rate" element={<GoldRatePage />} />
        <Route path="/journey" element={<JourneyPage />} />

        {pageMap.map(([path, title]) => (
          <Route
            key={path}
            path={path}
            element={<GenericPage title={title} />}
          />
        ))}

        {/* Administrator login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protect the administrator dashboard */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Navigate to="/admin/dashboard" replace />
            </AdminRoute>
          }
        />

        {[
          'dashboard',
          'products',
          'categories',
          'orders',
          'customers',
          'reviews',
          'gold-rates',
          'campaigns',
          'coupons',
          'stores',
          'appointments',
          'banners',
          'settings',
        ].map((section) => (
          <Route
            key={section}
            path={`/admin/${section}`}
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        ))}

        {/* Not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminPath && <Footer />}

      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ShopProvider>
  );
}