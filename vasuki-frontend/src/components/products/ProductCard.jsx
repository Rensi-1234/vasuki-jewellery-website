import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { money } from '../../data/catalog';
import { useShop } from '../../context/ShopContext';
import { toast } from 'sonner';

const imageOf = p => p?.image || p?.images?.[0]?.url || p?.imageUrl || '/images/brand/product-placeholder.jpg';
const idOf = p => String(p?.id || p?._id || p?.slug || '');

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, wishlist = [] } = useShop();
  if (!product) return null;

  const id = idOf(product);
  const image = imageOf(product);
  const saved = wishlist.some(p => idOf(p) === id);
  const stock = Number(product.stock ?? product.countInStock ?? 0);
  const item = {
    ...product,
    id,
    image,
    images: product.images || [{ url: image, alt: product.name }],
    price: Number(product.price) || 0,
    stock,
  };

  const toggleSaved = e => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
    toast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const add = e => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0) return toast('This piece is currently unavailable');
    addToCart(item, 1);
    toast('Added to your bag');
  };

  return (
    <article className="product-card" style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}>
      <Link className="product-card-image" to={`/product/${encodeURIComponent(id)}`} aria-label={`View ${product.name}`}>
        <img
          src={image}
          alt={product.name || 'VASUKI jewellery'}
          loading="lazy"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/images/brand/product-placeholder.jpg';
          }}
        />
        <div className="product-card-badges">
          {(Array.isArray(product.badges) ? product.badges : []).slice(0, 2).map(b => (
            <span className="product-badge" key={String(b)}>{b}</span>
          ))}
          {product.isFeatured && !(product.badges || []).length && <span className="product-badge">Featured</span>}
          {stock <= 0 && <span className="product-badge">Sold out</span>}
        </div>
      </Link>

      <button type="button" className={`product-card-wishlist${saved ? ' active' : ''}`}
        onClick={toggleSaved} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={saved}>
        <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
      </button>

      <div className="product-card-info">
        <div className="product-card-meta">
          <span>{product.collection || product.categoryName || 'VASUKI'}</span>
          {product.purity && <span>{product.purity}</span>}
        </div>
        <Link to={`/product/${encodeURIComponent(id)}`} className="product-card-name">
          <h3>{product.name || 'VASUKI Jewellery'}</h3>
        </Link>
        <p className="product-card-price">{money(item.price)}</p>
        <div className="product-card-actions">
          <Link to={`/product/${encodeURIComponent(id)}`} className="product-card-view">
            View piece <ArrowUpRight size={14} />
          </Link>
          <button type="button" className="product-card-add" onClick={add} disabled={stock <= 0}
            aria-label={`Add ${product.name} to bag`}>
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
