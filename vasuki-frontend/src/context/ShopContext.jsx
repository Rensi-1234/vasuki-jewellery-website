import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const ShopContext = createContext(null);
const CART_KEY = 'vasuki_cart';
const WISHLIST_KEY = 'vasuki_wishlist';
const RECENT_KEY = 'vasuki_recently_viewed';

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function normalizeProduct(p) {
  const image = p?.image || p?.images?.[0]?.url || p?.imageUrl || '/images/brand/product-placeholder.jpg';
  return {
    ...p,
    id: String(p?.id || p?._id || p?.slug || ''),
    image,
    images: p?.images || [{ url: image, alt: p?.name || 'VASUKI jewellery' }],
    price: Number(p?.price) || 0,
    stock: Number(p?.stock ?? p?.countInStock ?? 0),
    qty: Math.max(1, Number(p?.qty) || 1),
  };
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage(CART_KEY).map(normalizeProduct));
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY).map(normalizeProduct));
  const [recentlyViewed, setRecentlyViewed] = useState(() => readStorage(RECENT_KEY).map(normalizeProduct));
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      // Backend response is expected to be { success: true, data: [...], pagination: {...} }.
      const response = await api.get('/products?limit=100');
      const list = Array.isArray(response?.data) ? response.data
        : Array.isArray(response?.products) ? response.products
        : Array.isArray(response) ? response : [];
      const normalized = list.map(normalizeProduct);
      setProducts(normalized);
      return normalized;
    } catch (error) {
      setProductsError(error?.message || 'Unable to load products from the server.');
      return [];
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => { refreshProducts(); }, [refreshProducts]);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const addToCart = useCallback((product, quantity = 1) => {
    const p = normalizeProduct(product);
    const amount = Math.max(1, Math.floor(Number(quantity) || 1));
    setCart(current => {
      const existing = current.find(item => item.id === p.id);
      if (existing) {
        const requested = existing.qty + amount;
        const max = p.stock > 0 ? p.stock : requested;
        return current.map(item => item.id === p.id ? { ...item, ...p, qty: Math.min(requested, max) } : item);
      }
      return [...current, { ...p, qty: p.stock > 0 ? Math.min(amount, p.stock) : amount }];
    });
  }, []);

  const changeQty = useCallback((productId, quantity) => {
    const id = String(productId);
    const qty = Math.floor(Number(quantity));
    if (!Number.isFinite(qty) || qty < 1) {
      setCart(current => current.filter(p => p.id !== id));
      return;
    }
    setCart(current => current.map(p => {
      if (p.id !== id) return p;
      return { ...p, qty: p.stock > 0 ? Math.min(qty, p.stock) : qty };
    }));
  }, []);

  const removeCart = useCallback(productId => {
    const id = String(productId);
    setCart(current => current.filter(p => p.id !== id));
  }, []);

  const toggleWishlist = useCallback(product => {
    const p = normalizeProduct(product);
    setWishlist(current => current.some(item => item.id === p.id)
      ? current.filter(item => item.id !== p.id)
      : [...current, p]);
  }, []);

  const trackProduct = useCallback(product => {
    const p = normalizeProduct(product);
    setRecentlyViewed(current => [p, ...current.filter(item => item.id !== p.id)].slice(0, 12));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const cartTotal = useMemo(
    () => cart.reduce((total, p) => total + (Number(p.price) || 0) * (Number(p.qty) || 1), 0),
    [cart]
  );

  const value = useMemo(() => ({
    cart, wishlist, recentlyViewed, products, productsLoading, productsError,
    refreshProducts, addToCart, changeQty, removeCart, toggleWishlist,
    trackProduct, clearCart, cartTotal,
  }), [cart, wishlist, recentlyViewed, products, productsLoading, productsError,
    refreshProducts, addToCart, changeQty, removeCart, toggleWishlist,
    trackProduct, clearCart, cartTotal]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error('useShop must be used inside <ShopProvider>.');
  return value;
}

export default ShopContext;
