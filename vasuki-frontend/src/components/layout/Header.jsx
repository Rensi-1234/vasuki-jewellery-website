import React from 'react';
import {useState} from 'react';
import {Link,NavLink,useNavigate} from 'react-router-dom';
import {Menu,X,Search,Heart,UserRound,ShoppingBag,ChevronDown,ArrowUpRight, Gem, CircleDot, Flower2, Sparkles} from 'lucide-react';
import {categoryGroups} from '../../data/catalog';

const menuOrder = ['rings','earrings','nose-pins','bangles','mangalsutra','necklaces','bracelets','charms','pendants','jewellery-sets','gold','diamond','gemstone','wedding','mens','womens','kids'];
const menuImages = {
 rings:'/images/products/rings/vasuki-product.png', earrings:'/images/products/earrings/vasuki-product.png',
 'nose-pins':'/images/products/rings/vasuki-product.png', bangles:'/images/products/bracelets/vasuki-product.png',
 mangalsutra:'/images/products/necklaces/vasuki-product.png', necklaces:'/images/products/necklaces/vasuki-product.png',
 bracelets:'/images/products/bracelets/vasuki-product.png', charms:'/images/products/rings/vasuki-product.png',
 pendants:'/images/products/necklaces/vasuki-product.png', 'jewellery-sets':'/images/products/sets/vasuki-product.png',
 gold:'/images/products/gold/vasuki-product.png', diamond:'/images/products/diamond/vasuki-product.png',
 gemstone:'/images/products/diamond/vasuki-product.png', wedding:'/images/products/sets/vasuki-product.png',
 mens:'/images/products/bracelets/vasuki-product.png', womens:'/images/products/earrings/vasuki-product.png', kids:'/images/products/earrings/vasuki-product.png'
};
export default function Header(){
 const [menu,setMenu]=useState(false),[mega,setMega]=useState(false),[search,setSearch]=useState(false),[query,setQuery]=useState('');
 const nav=useNavigate();
 const submit=e=>{e.preventDefault();nav(`/search?q=${encodeURIComponent(query)}`);setSearch(false);setMenu(false);setMega(false)};
 const orderedCategories=menuOrder.map(slug=>categoryGroups.find(c=>c.slug===slug)).filter(Boolean);
 const closeMega=()=>setMega(false);
 return <>
 <div className="announcement">A little something precious, for every chapter of your story <span>✦</span> Complimentary insured shipping over ₹25,000</div>
 <header className="site-header">
  <Link to="/" className="wordmark" aria-label="VASUKI home"><img className="brand-logo" src="/images/brand/vasuki-logo.png" alt="VASUKI — Guardian of Gold" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextElementSibling.style.display='flex'}}/><span className="wordmark-fallback"><span>VASUKI</span><small>GUARDIAN OF GOLD</small></span></Link>
  <nav className="desktop-nav" aria-label="Main navigation">
   <div className="nav-dropdown" onMouseEnter={()=>setMega(true)} onMouseLeave={closeMega}>
    <button className="all-jewellery-trigger" onClick={()=>setMega(v=>!v)} aria-expanded={mega}>All Jewellery <ChevronDown size={14}/></button>
    {mega&&<div className="mega-menu" onMouseEnter={()=>setMega(true)}>
      <aside className="mega-filter"><span className="mega-filter-active">Category</span><button onClick={()=>{nav('/collections');closeMega()}}>Price</button><button onClick={()=>{nav('/collections');closeMega()}}>Occasion</button><button onClick={()=>{nav('/collections');closeMega()}}>Gender</button></aside>
      <div className="mega-category-area"><div className="mega-category-columns">{[orderedCategories.slice(0,6),orderedCategories.slice(6,12),orderedCategories.slice(12)].map((col,i)=><div className="mega-category-column" key={i}>{col.map(c=><Link className="mega-category-item" key={c.slug} to={`/category/${c.slug}`} onClick={closeMega}><span className="mega-category-thumb"><img src={menuImages[c.slug]||menuImages.rings} alt="" loading="lazy"/></span><span>{c.name==='Rings'?'Finger Rings':c.name}</span><ArrowUpRight className="mega-category-arrow" size={13}/></Link>)}</div>)}</div>
       <div className="mega-bottom-promo"><div className="mega-mini-stack"><img src={menuImages.necklaces} alt="Gold necklace"/><img src={menuImages.earrings} alt="Gold earrings"/><img src={menuImages.rings} alt="Gold ring"/></div><div><strong>Jewellery for Every Moment—See It All Here!</strong><small>Discover the VASUKI signature edit.</small></div><Link to="/collections" onClick={closeMega} className="mega-view-all">View All <ArrowUpRight size={15}/></Link></div>
      </div>
      <aside className="mega-feature"><Link to="/category/wedding" onClick={closeMega} className="mega-feature-image"><img src={menuImages.wedding} alt="VASUKI wedding jewellery collection"/><span>THE WEDDING EDIT</span></Link><h3>Discover Timeless Crafted Gold Jewellery.</h3><p>Heirloom-inspired pieces, made for your most meaningful moments.</p><Link to="/category/wedding" onClick={closeMega} className="mega-explore">Explore Now <ArrowUpRight size={16}/></Link></aside>
    </div>}
   </div>
   <NavLink to="/category/gold">Gold</NavLink><NavLink to="/category/diamond">Diamond</NavLink><NavLink to="/category/earrings">Earrings</NavLink><NavLink to="/category/daily-wear">Daily Wear</NavLink><NavLink to="/category/gemstone">Gemstone</NavLink><NavLink to="/category/wedding">Wedding</NavLink><NavLink to="/collections">Gifting</NavLink><NavLink to="/collections">Under 50K</NavLink><NavLink to="/collections">More</NavLink>
  </nav>
  <div className="header-actions"><button aria-label="Search" onClick={()=>setSearch(v=>!v)}><Search size={19}/></button><Link to="/wishlist" aria-label="Wishlist"><Heart size={19}/></Link><Link to="/account" aria-label="Account"><UserRound size={19}/></Link><Link to="/cart" className="cart-action" aria-label="Cart"><ShoppingBag size={19}/><span>Bag</span></Link><button className="mobile-menu-toggle" onClick={()=>setMenu(v=>!v)} aria-label={menu?'Close menu':'Open menu'}>{menu?<X/>:<Menu/>}</button></div>
  {search&&<form className="search-drawer" onSubmit={submit}><Search size={18}/><input autoFocus placeholder="Search your next forever piece…" value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search jewellery"/><button type="submit">Search</button><button type="button" aria-label="Close search" onClick={()=>setSearch(false)}><X size={18}/></button></form>}
 </header>
 {menu&&<div className="mobile-drawer"><div className="mobile-drawer-heading"><span>Explore Jewellery</span><button onClick={()=>setMenu(false)} aria-label="Close menu"><X/></button></div><div className="mobile-drawer-links"><Link to="/collections" onClick={()=>setMenu(false)}>Collections</Link><Link to="/journey" onClick={()=>setMenu(false)}>Our Journey</Link><Link to="/gold-rate" onClick={()=>setMenu(false)}>Gold Rate</Link><Link to="/stores" onClick={()=>setMenu(false)}>Store Locator</Link><Link to="/account" onClick={()=>setMenu(false)}>My Account</Link></div>{orderedCategories.map(c=><Link className="mobile-category-link" key={c.slug} to={`/category/${c.slug}`} onClick={()=>setMenu(false)}><span className="mobile-category-thumb"><img src={menuImages[c.slug]||menuImages.rings} alt=""/></span>{c.name}<ArrowUpRight size={14}/></Link>)}</div>}
 </>;
}
