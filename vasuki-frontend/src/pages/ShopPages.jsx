import React from 'react';
import {useEffect,useMemo,useState} from 'react';import {Link,useParams,useSearchParams,useNavigate} from 'react-router-dom';import {ArrowUpRight,SlidersHorizontal,ChevronDown,Search as SearchIcon,X,Minus,Plus,Heart,ShoppingBag,CheckCircle,Truck,ShieldCheck,RotateCcw,ArrowLeft,MapPin,CalendarDays,Upload,RotateCw,Move} from 'lucide-react';import {categoryGroups,products,money,collections} from '../data/catalog';import ProductCard from '../components/products/ProductCard';import Reveal from '../components/common/Reveal';import {useShop} from '../context/ShopContext';import {toast} from 'sonner';
export function CategoryPage() {
  const { slug, subslug } = useParams();

  const cat = categoryGroups.find(c => c.slug === slug);

  const sub = subslug
    ? cat?.subs.find(
        s =>
          s.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') === subslug
      )
    : null;

  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [purity, setPurity] = useState('All');
  const [metal, setMetal] = useState('All');
  const [onlyStock, setOnlyStock] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [limit, setLimit] = useState(8);

  const navigate = useNavigate();

  // Always call useMemo before any conditional return.
  const filtered = useMemo(() => {
    let arr = products.filter(
      p =>
        p.category === slug ||
        p.categoryName === cat?.name ||
        (p.collection || '').toLowerCase().includes(slug || '')
    );

    if (sub) {
      arr = arr.filter(
        p =>
          p.subcategory === sub ||
          p.name.toLowerCase().includes(sub.split(' ')[0].toLowerCase()) ||
          p.category === slug
      );
    }

    arr = arr.filter(
      p =>
        p.price <= maxPrice &&
        (purity === 'All' || p.purity === purity) &&
        (metal === 'All' || p.metal === metal) &&
        (!onlyStock || p.stock > 0)
    );

    if (sort === 'low') arr.sort((a, b) => a.price - b.price);
    if (sort === 'high') arr.sort((a, b) => b.price - a.price);
    if (sort === 'new') arr.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);

    return arr;
  }, [slug, sub, cat?.name, maxPrice, purity, metal, onlyStock, sort]);

  // Conditional return comes AFTER all hooks.
  if (!cat) return <NotFound />;

  const display = filtered.length
    ? filtered
    : products.filter(p => p.category === slug).slice(0, 4);

  return (
    <main className="shop-page">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/category/${slug}`}>{cat.name}</Link>
          {sub && (
            <>
              <span>/</span>
              <span>{sub}</span>
            </>
          )}
        </div>

        <section className="category-hero">
          <div className="category-hero-copy">
            <span className="eyebrow">THE VASUKI COLLECTION</span>
            <h1>
              {sub || cat.name}
              <br />
              <em>
                {sub
                  ? '— chosen with meaning'
                  : '— made to be treasured'}
              </em>
            </h1>
            <p>
              {cat.description} Discover considered designs, crafted for
              the moments that matter and the everyday in between.
            </p>
            <span className="category-count">
              {filtered.length || display.length} considered designs
            </span>
          </div>

          <div className="category-hero-image">
            <img
              src={`/images/categories/${cat.image}.jpg`}
              onError={e => {
                if (display[0]?.image) {
                  e.currentTarget.src = display[0].image;
                }
              }}
              alt={`${cat.name} collection`}
            />
          </div>
        </section>

        <div className="subcategories">
          <span>EXPLORE {cat.name.toUpperCase()}</span>
          <div>
            {cat.subs.map(s => {
              const ss = s
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

              return (
                <button
                  className={sub === s ? 'active' : ''}
                  key={s}
                  onClick={() => navigate(`/category/${slug}/${ss}`)}
                >
                  {s}
                  <ArrowUpRight size={12} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="shop-toolbar">
          <span>
            {filtered.length} pieces{' '}
            <span className="muted">/ {sub || cat.name}</span>
          </span>

          <div>
            <button
              className="filter-toggle"
              onClick={() => setFilterOpen(v => !v)}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            <label>
              Sort by{' '}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="new">Newest</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="rating">Highest rated</option>
              </select>
            </label>
          </div>
        </div>

        <div className="shop-layout">
          {filterOpen && (
            <aside className="filter-panel">
              <div className="filter-title">
                <h3>Refine your edit</h3>
                <button
                  onClick={() => {
                    setMaxPrice(300000);
                    setPurity('All');
                    setMetal('All');
                    setOnlyStock(false);
                  }}
                >
                  Clear all
                </button>
              </div>

              <label className="filter-label">
                Maximum price <strong>{money(maxPrice)}</strong>
                <input
                  type="range"
                  min="5000"
                  max="300000"
                  step="5000"
                  value={maxPrice}
                  onChange={e => setMaxPrice(+e.target.value)}
                />
              </label>

              <label className="filter-label">
                Gold purity
                <select
                  value={purity}
                  onChange={e => setPurity(e.target.value)}
                >
                  {['All', '10K', '14K', '18K', '22K', '24K'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>

              <label className="filter-label">
                Metal colour
                <select
                  value={metal}
                  onChange={e => setMetal(e.target.value)}
                >
                  {['All', 'Yellow Gold', 'Rose Gold', 'White Gold'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>

              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={onlyStock}
                  onChange={e => setOnlyStock(e.target.checked)}
                />
                In stock only
              </label>
            </aside>
          )}

          <div className="shop-results">
            {display.length ? (
              <div className="product-grid">
                {display.slice(0, limit).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No pieces match just yet.</h3>
                <p>Try adjusting your filters to discover more.</p>
                <button
                  className="button button-dark"
                  onClick={() => {
                    setMaxPrice(300000);
                    setPurity('All');
                    setMetal('All');
                    setOnlyStock(false);
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}

            {display.length > limit && (
              <button
                className="button button-outline load-more"
                onClick={() => setLimit(n => n + 8)}
              >
                Discover more pieces <Plus size={15} />
              </button>
            )}
          </div>
        </div>

        <section className="related-categories">
          <span className="eyebrow">CONTINUE EXPLORING</span>
          <h2>More to fall for.</h2>
          <div>
            {categoryGroups
              .filter(c => c.slug !== slug)
              .slice(0, 6)
              .map(c => (
                <Link key={c.slug} to={`/category/${c.slug}`}>
                  {c.name}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}export function ProductPage(){const {id}=useParams();const {addToCart,toggleWishlist,wishlist,trackProduct}=useShop();const p=products.find(x=>x.id===id);const [img,setImg]=useState(0),[qty,setQty]=useState(1),[size,setSize]=useState('Default'),[pin,setPin]=useState(''),[pinMsg,setPinMsg]=useState('');useEffect(()=>{if(p)trackProduct(p)},[id]);if(!p)return <NotFound/>;const relatedAngles=products.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,3).map(x=>x.image);const images=[...new Set([p.image,p.imageAlt,...relatedAngles])].slice(0,4);return <main className="product-detail container"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to={`/category/${p.category}`}>{p.categoryName}</Link><span>/</span><span>{p.name}</span></div><div className="product-detail-grid"><div className="gallery"><div className="gallery-thumbs">{images.map((im,i)=><button className={img===i?'active':''} key={i} onClick={()=>setImg(i)}><img src={im} alt={`${p.name} view ${i+1}`}/></button>)}</div><div className="gallery-main"><img src={images[img]} alt={p.name}/><button className="gallery-view" onClick={()=>setImg((img+1)%images.length)}>View next angle <ArrowUpRight size={14}/></button></div></div><div className="product-detail-info"><span className="eyebrow">{p.collection}</span><h1>{p.name}</h1><div className="detail-rating"><span>★★★★★</span> {p.rating} <a href="#reviews">({p.reviews} reviews)</a></div><h2 className="detail-price">{money(p.price)}</h2><p className="tax-note">Inclusive of applicable taxes · Final price confirmed at checkout</p><p className="detail-description">{p.description} Designed to become a part of your personal story, this piece balances timeless craft with a distinctive VASUKI point of view.</p><div className="detail-specs"><div><span>Gold purity</span><strong>{p.purity}</strong></div><div><span>Approx. weight</span><strong>{p.weight} g</strong></div><div><span>Metal colour</span><strong>{p.metal}</strong></div><div><span>SKU</span><strong>{p.sku}</strong></div></div><label className="detail-label">Size / variation<select value={size} onChange={e=>setSize(e.target.value)}>{['Select size (cm)','Ring inner diameter: 1.6 cm','Ring inner diameter: 1.7 cm','Ring inner diameter: 1.8 cm','Ring inner diameter: 1.9 cm','Bangle inner diameter: 5.5 cm','Bangle inner diameter: 5.8 cm','Bangle inner diameter: 6.0 cm','Bracelet length: 16 cm','Bracelet length: 17 cm','Bracelet length: 18 cm','Necklace length: 40 cm','Necklace length: 45 cm','Necklace length: 50 cm','One size'].map(s=><option key={s} value={s}>{s}</option>)}</select></label><div className="quantity-line"><span>Quantity</span><div><button onClick={()=>setQty(q=>Math.max(1,q-1))} aria-label="Decrease quantity"><Minus size={14}/></button><span>{qty}</span><button onClick={()=>setQty(q=>Math.min(p.stock,q+1))} aria-label="Increase quantity"><Plus size={14}/></button></div><span className="stock-note">{p.stock>0?'In stock':'Currently unavailable'}</span></div><button className="button button-dark detail-add" onClick={()=>{addToCart({...p,selectedSize:size},qty);toast('Added to your bag')}}><ShoppingBag size={17}/> Add to bag — {money(p.price*qty)}</button><button className="button button-outline detail-wish" onClick={()=>{toggleWishlist(p);toast(wishlist.some(x=>x.id===p.id)?'Removed from wishlist':'Saved to wishlist')}}><Heart size={17}/> Save to wishlist</button><div className="pincode-check"><label htmlFor="pincode">Check delivery availability</label><div><MapPin size={16}/><input id="pincode" inputMode="numeric" maxLength="6" placeholder="Enter 6-digit pincode" value={pin} onChange={e=>{setPin(e.target.value.replace(/\D/g,'').slice(0,6));setPinMsg('')}}/><button onClick={()=>setPinMsg(/^\d{6}$/.test(pin)?'Delivery estimate: 3–7 business days.':'Enter a valid 6-digit pincode.')}>Check</button></div>{pinMsg&&<small>{pinMsg}</small>}</div><div className="promise-list"><p><ShieldCheck size={17}/> Certified materials & quality checks</p><p><Truck size={17}/> Insured delivery, carefully packed</p><p><RotateCcw size={17}/> Support for eligible returns</p></div><details open><summary>Design story</summary><p>Every VASUKI design begins with a thought: how can an object become a keepsake? This piece honours that idea through considered proportions and lasting detail.</p></details><details><summary>Metal & product details</summary><p>Purity: {p.purity} · Gross weight: {p.weight} g · Metal: {p.metal} · Collection: {p.collection} · SKU: {p.sku}. Specifications are illustrative demo catalogue data.</p></details><details><summary>Care instructions</summary><p>Store separately in a soft-lined box. Avoid direct contact with perfumes, lotions and cleaning products. Wipe gently with a clean, dry jewellery cloth.</p></details></div></div><section id="reviews" className="product-reviews"><span className="eyebrow">NOTES FROM OUR CUSTOMERS</span><h2>Made to be remembered.</h2><p>★ ★ ★ ★ ★ <b>{p.rating}/5</b> · {p.reviews} demo catalogue reviews</p><div className="review-disclaimer">Review content shown in this development preview is illustrative. Verified-purchase badges are only shown when supported by the connected backend.</div></section><section className="related-products"><div className="section-heading"><div><span className="eyebrow">A COMPLEMENTARY PIECE</span><h2>You may also love</h2></div><Link to={`/category/${p.category}`} className="text-link">Explore more <ArrowUpRight size={15}/></Link></div><div className="product-grid">{products.filter(x=>x.id!==p.id).slice(0,4).map((x,i)=><ProductCard key={x.id} product={x} index={i}/>)}</div></section></main>}
export function SearchPage(){const [params]=useSearchParams();const q=params.get('q')||'';const [term,setTerm]=useState(q);const results=products.filter(p=>`${p.name} ${p.sku} ${p.categoryName} ${p.subcategory} ${p.collection}`.toLowerCase().includes(term.toLowerCase()));return <main className="container generic-page"><span className="eyebrow">FIND YOUR PIECE</span><h1>Search <em>VASUKI.</em></h1><form className="large-search" onSubmit={e=>e.preventDefault()}><SearchIcon/><input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Try ‘serpent’, ‘diamond’ or a SKU" autoFocus/><button type="button" onClick={()=>setTerm('')}><X size={16}/></button></form><p className="muted">{results.length} pieces found for “{term}”</p>{results.length?<div className="product-grid">{results.map((p,i)=><ProductCard key={p.id} product={p} index={i}/>)}</div>:<div className="empty-state"><h2>Nothing found, for now.</h2><p>Try a different search, or browse our considered collections.</p><Link to="/collections" className="button button-dark">Explore collections</Link></div>}</main>}
export function CollectionsPage(){return <main className="container generic-page"><span className="eyebrow">A COLLECTION FOR EVERY STORY</span><h1>Considered <em>collections.</em></h1><p className="page-intro">Each collection is a different expression of the VASUKI spirit: strength, heritage, personal meaning, and beauty that stays.</p><div className="collection-page-grid">{collections.map((c,i)=>{const slug=['rings','wedding','charms','bangles','necklaces','earrings'][i%6];return <Link key={c} to={`/category/${slug}`} className="collection-page-card"><img src={products[i%products.length].image} alt={c}/><div><span>0{i+1} / VASUKI COLLECTION</span><h2>{c}</h2><b>Discover collection <ArrowUpRight size={15}/></b></div></Link>})}</div></main>}
export function CartPage(){const {cart,cartTotal,changeQty,removeCart,toggleWishlist}=useShop();const [coupon,setCoupon]=useState(''),[applied,setApplied]=useState(false),[pin,setPin]=useState('');const discount=applied?Math.round(cartTotal*.1):0;const gst=Math.round((cartTotal-discount)*.03);return <main className="container generic-page"><span className="eyebrow">YOUR PERSONAL EDIT</span><h1>Your bag<em>.</em></h1><p className="page-intro">Pieces chosen by you, made to be kept close.</p>{!cart.length?<div className="empty-state"><ShoppingBag size={34}/><h2>Your bag is waiting for something special.</h2><p>Take a moment to find a piece that feels like you.</p><Link to="/collections" className="button button-dark">Explore jewellery <ArrowUpRight size={15}/></Link></div>:<div className="cart-layout"><div className="cart-items">{cart.map(p=><article className="cart-item" key={p.id}><Link to={`/product/${p.id}`}><img src={p.image} alt={p.name}/></Link><div className="cart-item-info"><span className="eyebrow">{p.sku}</span><Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link><p>{p.purity} gold · Approx. {p.weight} g</p>{p.selectedSize&&<p>Size: {p.selectedSize}</p>}<div className="cart-quantity"><button onClick={()=>changeQty(p.id,p.qty-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{p.qty}</span><button onClick={()=>changeQty(p.id,p.qty+1)} aria-label="Increase quantity"><Plus size={13}/></button></div><div className="cart-item-actions"><button onClick={()=>{toggleWishlist(p);removeCart(p.id);toast('Saved for later')}}>Save for later</button><button onClick={()=>removeCart(p.id)}>Remove</button></div></div><strong>{money(p.price*p.qty)}</strong></article>)}</div><aside className="order-summary"><span className="eyebrow">A CLEAR BREAKDOWN</span><h2>Order summary</h2><div className="coupon-form"><label htmlFor="coupon">Gift code or coupon</label><div><input id="coupon" value={coupon} onChange={e=>{setCoupon(e.target.value);setApplied(false)}} placeholder="Enter code"/><button onClick={()=>{if(coupon.trim()){setApplied(true);toast('Demo coupon applied: 10% off')}}}>Apply</button></div>{applied&&<small>DEMO10 · 10% discount applied</small>}</div><label className="coupon-label" htmlFor="delivery-pin">Delivery pincode</label><input id="delivery-pin" className="full-input" value={pin} maxLength={6} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="6-digit pincode"/><div className="summary-row"><span>Subtotal</span><span>{money(cartTotal)}</span></div>{applied&&<div className="summary-row discount-row"><span>Discount (demo)</span><span>−{money(discount)}</span></div>}<div className="summary-row"><span>Estimated GST*</span><span>{money(gst)}</span></div><div className="summary-row"><span>Insured shipping</span><span>{cartTotal>=25000?'Complimentary':money(250)}</span></div><div className="summary-row summary-total"><strong>Estimated total</strong><strong>{money(cartTotal-discount+gst+(cartTotal>=25000?0:250))}</strong></div><p className="summary-note">*Illustrative tax estimate. Final tax and gold pricing are calculated by the backend at checkout. Gold-rate lock is not active in demo mode.</p><Link to="/checkout" className="button button-dark checkout-button">Continue to checkout <ArrowUpRight size={16}/></Link><div className="secure-note"><ShieldCheck size={16}/> Secure checkout experience</div></aside></div>}</main>}
export function WishlistPage(){const {wishlist,toggleWishlist,addToCart}=useShop();return <main className="container generic-page"><span className="eyebrow">SAVED FOR ANOTHER DAY</span><h1>Your wishlist<em>.</em></h1><p className="page-intro">A personal collection of pieces you love.</p>{wishlist.length?<div className="product-grid">{wishlist.map((p,i)=><div key={p.id} className="wishlist-card"><ProductCard product={p} index={i}/><button className="button button-outline" onClick={()=>{addToCart(p);toggleWishlist(p);toast('Moved to your bag')}}><ShoppingBag size={15}/> Move to bag</button></div>)}</div>:<div className="empty-state"><Heart size={34}/><h2>Keep the pieces that speak to you.</h2><p>Tap the heart on any piece to save it here.</p><Link className="button button-dark" to="/collections">Find your piece</Link></div>}</main>}
export function AccountPage(){const [mode,setMode]=useState('login');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [name,setName]=useState('');const [done,setDone]=useState(false);return <main className="auth-page"><div className="auth-image"><img src={products[2].image} alt="VASUKI jewellery detail"/><div><span className="eyebrow light">A PERSONAL CONNECTION</span><h2>Your story,<br/><em>kept close.</em></h2></div></div><div className="auth-panel"><span className="eyebrow">WELCOME TO VASUKI</span><h1>{done?'You’re on your way.':mode==='login'?'Welcome back.':mode==='register'?'Create your account.':'Reset your password.'}</h1><p>{done?'This is a frontend demo. Connect the authentication API to complete this action.':'Sign in to keep your orders, favourites and details in one place.'}</p>{!done&&<form onSubmit={e=>{e.preventDefault();setDone(true);toast('Demo only — authentication API is not connected')}}>{mode==='register'&&<label>Full name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}<label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>{mode!=='forgot'&&<label>Password<input type="password" minLength="6" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/></label>}<button className="button button-dark auth-submit">{mode==='login'?'Sign in':mode==='register'?'Create account':'Send reset link'} <ArrowUpRight size={15}/></button></form>}{done&&<button className="button button-outline" onClick={()=>{setDone(false);setMode('login')}}>Back to sign in</button>}<div className="auth-switch">{mode==='login'?<>New to VASUKI? <button onClick={()=>setMode('register')}>Create an account</button><button onClick={()=>setMode('forgot')}>Forgot password?</button></>:<><button onClick={()=>{setMode('login');setDone(false)}}>Return to sign in</button></>}</div><p className="demo-disclaimer">Demo frontend: credentials are not submitted to a live authentication service.</p></div></main>}
export function CheckoutPage(){const {cart,cartTotal}=useShop();const [step,setStep]=useState(0),[method,setMethod]=useState('UPI (demo)'),[placed,setPlaced]=useState(false);const [form,setForm]=useState({name:'',email:'',phone:'',address:'',city:'',state:'Gujarat',pin:''});const steps=['Address','Delivery','Payment','Review'];if(placed)return <main className="container generic-page confirmation"><CheckCircle size={54}/><span className="eyebrow">ORDER CONFIRMATION · DEMO</span><h1>Thank you. <em>Truly.</em></h1><p>Your demo order has been created locally for this session. No payment was processed.</p><div className="order-number">VG-DEMO-{Date.now().toString().slice(-7)}</div><Link to="/orders" className="button button-dark">View orders</Link><Link to="/" className="text-link">Continue exploring <ArrowUpRight size={15}/></Link></main>;if(!cart.length)return <main className="container generic-page empty-state"><h1>Your bag is empty.</h1><Link to="/collections" className="button button-dark">Explore jewellery</Link></main>;return <main className="container generic-page checkout-page"><span className="eyebrow">A CONSIDERED CHECKOUT</span><h1>Almost <em>yours.</em></h1><div className="checkout-steps">{steps.map((s,i)=><button className={i===step?'active':i<step?'complete':''} key={s} onClick={()=>i<step&&setStep(i)}><span>{i<step?'✓':i+1}</span>{s}</button>)}</div><div className="checkout-layout"><form className="checkout-form" onSubmit={e=>{e.preventDefault();if(step<3)setStep(step+1);else{setPlaced(true);}}}><h2>{steps[step]}</h2>{step===0&&<div className="form-grid">{[['name','Full name','text'],['email','Email address','email'],['phone','Phone number','tel'],['pin','Pincode','text'],['city','City','text'],['state','State','text']].map(([key,label,type])=><label key={key}>{label}<input required type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}<label className="span-two">Full delivery address<textarea required rows="3" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label></div>}{step===1&&<div className="delivery-option"><Truck/><div><b>Insured standard delivery</b><p>Estimated 3–7 business days after order confirmation. Demo estimate.</p></div><strong>Complimentary</strong></div>}{step===2&&<div className="payment-options">{['UPI (demo)','Credit / Debit Card (sandbox)','Net Banking (demo)','Wallet (demo)','EMI (demo)'].map(m=><label key={m}><input type="radio" name="payment" checked={method===m} onChange={()=>setMethod(m)}/><span><b>{m}</b><small>Simulated payment — no real money will be charged.</small></span></label>)}</div>}{step===3&&<div className="review-order"><h3>Deliver to</h3><p>{form.name}<br/>{form.address}, {form.city}, {form.state} {form.pin}<br/>{form.email} · {form.phone}</p><h3>Payment</h3><p>{method}</p>{cart.map(p=><p key={p.id}>{p.name} × {p.qty} <b>{money(p.price*p.qty)}</b></p>)}<p className="demo-disclaimer">Final price, applicable taxes, stock and gold-rate locks must be revalidated by the backend before a real order is accepted.</p></div>}<div className="checkout-form-actions">{step>0&&<button type="button" className="button button-outline" onClick={()=>setStep(step-1)}><ArrowLeft size={15}/> Back</button>}<button type="submit" className="button button-dark">{step===3?'Place demo order':`Continue to ${steps[step+1].toLowerCase()}`} <ArrowUpRight size={15}/></button></div></form><aside className="order-summary"><span className="eyebrow">YOUR SELECTION</span><h2>Order summary</h2>{cart.map(p=><div className="mini-order-item" key={p.id}><img src={p.image} alt={p.name}/><span>{p.name}<small>Qty {p.qty} · {p.purity}</small></span><b>{money(p.price*p.qty)}</b></div>)}<div className="summary-row"><span>Subtotal</span><span>{money(cartTotal)}</span></div><div className="summary-row"><span>Estimated GST*</span><span>{money(Math.round(cartTotal*.03))}</span></div><div className="summary-row summary-total"><b>Estimated total</b><b>{money(Math.round(cartTotal*1.03))}</b></div><p className="summary-note">Demo totals. Backend should calculate final price.</p></aside></div></main>}
export function TryOnPage(){const [photo,setPhoto]=useState(''),[item,setItem]=useState(products[0].id),[scale,setScale]=useState(100),[rotation,setRotation]=useState(0),[pos,setPos]=useState({x:50,y:50});const p=products.find(x=>x.id===item)||products[0];return <main className="container generic-page tryon-page"><span className="eyebrow">A FIRST LOOK, YOUR WAY</span><h1>Make it <em>yours.</em></h1><p className="page-intro">Upload a photo and place a jewellery overlay to preview scale and position. This is a manual 2D preview, not augmented reality.</p><div className="tryon-layout"><div className="tryon-stage" onPointerMove={e=>{if(e.buttons===1){const r=e.currentTarget.getBoundingClientRect();setPos({x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))})}}}><div className="tryon-stage-hint"><Move size={15}/> Drag to reposition</div>{photo?<img className="customer-photo" src={photo} alt="Your uploaded photo"/>:<div className="upload-placeholder"><Upload size={28}/><h3>Your canvas begins here.</h3><p>Upload a portrait to try a placement preview.</p><label className="button button-outline">Choose photo<input type="file" accept="image/*" hidden onChange={e=>{const f=e.target.files?.[0];if(f){if(photo)URL.revokeObjectURL(photo);setPhoto(URL.createObjectURL(f))}}}/></label></div>}<img className="tryon-overlay" draggable="false" src={p.image} alt={`${p.name} preview overlay`} style={{left:`${pos.x}%`,top:`${pos.y}%`,width:`${scale}px`,transform:`translate(-50%,-50%) rotate(${rotation}deg)`}}/></div><aside className="tryon-controls"><span className="eyebrow">YOUR PREVIEW</span><h2>Choose a piece</h2><label>Jewellery type<select value={item} onChange={e=>setItem(e.target.value)}>{products.filter(x=>['rings','earrings','necklaces','nose-pins','bracelets','bangles','charms'].includes(x.category)).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><div className="tryon-control"><label htmlFor="scale">Overlay size</label><input id="scale" type="range" min="50" max="260" value={scale} onChange={e=>setScale(+e.target.value)}/></div><div className="tryon-control"><label htmlFor="rotate">Rotation</label><input id="rotate" type="range" min="-180" max="180" value={rotation} onChange={e=>setRotation(+e.target.value)}/></div><div className="tryon-control"><label>Horizontal position</label><input type="range" min="0" max="100" value={pos.x} onChange={e=>setPos({...pos,x:+e.target.value})}/></div><div className="tryon-control"><label>Vertical position</label><input type="range" min="0" max="100" value={pos.y} onChange={e=>setPos({...pos,y:+e.target.value})}/></div><button className="button button-outline" onClick={()=>{setScale(100);setRotation(0);setPos({x:50,y:50})}}><RotateCw size={15}/> Reset placement</button><Link className="button button-dark" to={`/product/${p.id}`}>View selected piece <ArrowUpRight size={15}/></Link><p className="demo-disclaimer">For preview purposes only. Overlay positioning does not use facial or body tracking.</p></aside></div></main>}
export function GoldRatePage(){return <main className="container generic-page"><span className="eyebrow">A LITTLE MORE TRANSPARENCY</span><h1>Gold, <em>explained.</em></h1><p className="page-intro">Gold rates vary by purity and market conditions. The rates below are illustrative development data, not live market quotes.</p><div className="gold-rate-grid">{[['24K','99.9% purity','₹9,250'],['22K','91.6% purity','₹8,480'],['18K','75.0% purity','₹6,940'],['14K','58.5% purity','₹5,395'],['10K','41.7% purity','₹3,850']].map(([k,p,r])=><article key={k}><span>{k}</span><h2>{r}<small>/ gram</small></h2><p>{p}</p><i>Illustrative demo rate</i></article>)}</div><div className="info-callout"><ShieldCheck/><div><h3>Clear pricing, always.</h3><p>Product prices in this preview are demo catalogue values. A connected backend must provide authoritative rates, making charges, applicable taxes, discounts, and the final payable price.</p></div></div></main>}
export function JourneyPage(){return <main className="journey-page"><section className="journey-hero"><img src={products[9].image} alt="Gold jewellery, a study in craft"/><div><span className="eyebrow light">THE STORY OF VASUKI</span><h1>Rooted in heritage.<br/><em>Made for forever.</em></h1><p>Some things are measured in weight. The most precious are measured in what they mean.</p></div></section><section className="journey-chapter container"><span className="eyebrow">01 — THE SYMBOL</span><h2>Strength that circles back.</h2><p>The serpent is an ancient symbol of guardianship, renewal, and continuity. At VASUKI, it inspires a design philosophy: beauty should protect a memory, honour a beginning, and stay meaningful as life changes.</p><img src={products[0].image} alt="VASUKI Serpent Ring"/></section><section className="journey-chapter chapter-dark"><span className="eyebrow light">02 — THE CRAFT</span><h2>Consider every detail.</h2><p>From the first sketch to the final polish, our design language celebrates considered proportion, thoughtful detail, and the enduring warmth of gold. Production and sourcing claims will be published here when verified by the brand.</p></section><section className="journey-end container"><span className="eyebrow">03 — YOUR STORY</span><h2>The next chapter is yours.</h2><Link to="/collections" className="button button-dark">Discover VASUKI <ArrowUpRight size={16}/></Link></section></main>}
export function GenericPage({title}){const [open,setOpen]=useState(0);const [sent,setSent]=useState(false);const faqs=[['How do I care for my jewellery?','Keep each piece in a separate soft pouch, avoid perfumes and harsh chemicals, and wipe gently with a clean, dry cloth.'],['How long does delivery take?','The demo estimate is 3–7 business days. Actual delivery dates must be confirmed by the connected order and shipping service.'],['Can I return an item?','Return and exchange eligibility depends on the final published VASUKI policy and order status. Please contact client care for assistance.'],['Are gold rates live?','Not in this preview. Gold-rate figures are clearly labelled illustrative demo data until a trusted provider is connected.']];const legal=title.toLowerCase().includes('policy')||['Terms and Conditions','Privacy Policy','Shipping Policy','Returns and Exchanges','Cancellation Policy','Jewellery Care'].includes(title);return <main className="container generic-page"><span className="eyebrow">VASUKI CLIENT CARE</span><h1>{title}<em>.</em></h1><p className="page-intro">{title==='FAQ'?'A few helpful answers, with care.':title==='Contact Us'?'We would love to hear from you. Leave a note and our client-care team can follow up once connected.':`Thoughtful guidance from VASUKI — Guardian of Gold. This preview contains demonstration content; confirm final brand policies before launch.`}</p>{title==='FAQ'?<div className="faq-list">{faqs.map(([q,a],i)=><article key={q}><button onClick={()=>setOpen(open===i?-1:i)}>{q}{open===i?<Minus size={16}/>:<Plus size={16}/>}</button>{open===i&&<p>{a}</p>}</article>)}</div>:title==='Contact Us'?<form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}>{sent?<div className="info-callout"><CheckCircle/><p>Your message has been captured in this demo interface. No live email has been sent.</p></div>:<><label>Your name<input required/></label><label>Email address<input required type="email"/></label><label>How can we help?<select><option>Product enquiry</option><option>Order support</option><option>Returns and exchanges</option><option>Other</option></select></label><label>Message<textarea required rows="5"/></label><button className="button button-dark">Send enquiry <ArrowUpRight size={15}/></button></>}</form>:legal?<div className="policy-copy"><h2>Our commitment</h2><p>VASUKI aims to offer a considered, transparent customer experience. This page is a frontend placeholder for the final, legally reviewed brand policy and does not constitute a complete legal document.</p><h2>Clear information</h2><p>Prices, materials, delivery estimates, returns, warranties, privacy practices and consumer rights must be confirmed against the live business policies before launch. Demo data and simulated payment flows must not be treated as live commitments.</p><h2>Questions</h2><p>For help, use the contact form or connect the appropriate client-care API endpoint.</p></div>:<div className="info-callout"><CalendarDays/><div><h2>How would you like to continue?</h2><p>This page is ready for live data integration and uses the same VASUKI design system.</p><Link className="text-link" to="/contact">Contact client care <ArrowUpRight size={15}/></Link></div></div>}</main>}
export function NotFound(){return <main className="container generic-page not-found"><span className="eyebrow">A LITTLE DETOUR</span><h1>Not quite <em>here.</em></h1><p>The page you are looking for may have moved. Let's find something worth keeping instead.</p><Link to="/" className="button button-dark">Return home <ArrowUpRight size={15}/></Link></main>}
