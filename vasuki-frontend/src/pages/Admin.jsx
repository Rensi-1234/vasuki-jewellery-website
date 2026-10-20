import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Star, Coins,
  Megaphone, Ticket, Store, CalendarDays, Image as ImageIcon, Settings,
  Search, Bell, ArrowUpRight, TrendingUp, AlertTriangle, Plus, Download,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from 'recharts';
import { products, money, categoryGroups } from '../data/catalog';
import { toast } from 'sonner';
import { api } from '../services/api';

const links = [
  ['Dashboard', '/admin/dashboard', LayoutDashboard],
  ['Products', '/admin/products', Package],
  ['Categories', '/admin/categories', Tags],
  ['Orders', '/admin/orders', ShoppingCart],
  ['Customers', '/admin/customers', Users],
  ['Reviews', '/admin/reviews', Star],
  ['Gold rates', '/admin/gold-rates', Coins],
  ['Campaigns', '/admin/campaigns', Megaphone],
  ['Coupons', '/admin/coupons', Ticket],
  ['Stores', '/admin/stores', Store],
  ['Appointments', '/admin/appointments', CalendarDays],
  ['Banners', '/admin/banners', ImageIcon],
  ['Settings', '/admin/settings', Settings],
];

const sales = [
  { day: 'Mon', sales: 32, orders: 12 },
  { day: 'Tue', sales: 45, orders: 18 },
  { day: 'Wed', sales: 38, orders: 15 },
  { day: 'Thu', sales: 61, orders: 24 },
  { day: 'Fri', sales: 52, orders: 21 },
  { day: 'Sat', sales: 79, orders: 33 },
  { day: 'Sun', sales: 68, orders: 28 },
];

const initialForm = {
  name: '',
  sku: '',
  category: 'rings',
  subcategory: 'Gold Rings',
  price: '',
  stock: '5',
  purity: '18K',
  weight: '2.5',
  description: '',
};

function mapProduct(product) {
  return {
    ...product,
    id: product._id || product.id,
    image: product.images?.[0]?.url || product.image || '',
    categoryName: product.categoryName || product.category || 'Jewellery',
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
  };
}

export default function Admin() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('All');
  const [items, setItems] = useState(products.map(mapProduct));
  const [form, setForm] = useState(initialForm);
  const [productImage, setProductImage] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const section = links.find((item) => location.pathname === item[1])?.[0] || 'Dashboard';
  const isDashboard = section === 'Dashboard';

  useEffect(() => {
    if (section !== 'Products') return;
    let active = true;
    api.get('/products?limit=50')
      .then((response) => {
        if (!active) return;
        const serverProducts = response?.data;
        if (Array.isArray(serverProducts)) {
          setItems(serverProducts.map(mapProduct));
        }
      })
      .catch((error) => {
        console.warn('Could not load live products; showing catalogue data.', error);
      });
    return () => { active = false; };
  }, [section]);

  useEffect(() => {
    if (!productImage) {
      setImagePreview('');
      return;
    }
    const url = URL.createObjectURL(productImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [productImage]);

  const rows = items.filter((product) =>
    `${product.name || ''} ${product.sku || ''} ${product.categoryName || ''}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const orders = [
    { id: 'VG-2026-1042', customer: 'Demo Customer A', date: '09 Oct 2026', amount: 54200, status: 'Processing' },
    { id: 'VG-2026-1041', customer: 'Demo Customer B', date: '08 Oct 2026', amount: 128000, status: 'Confirmed' },
    { id: 'VG-2026-1040', customer: 'Demo Customer C', date: '08 Oct 2026', amount: 21900, status: 'Shipped' },
    { id: 'VG-2026-1039', customer: 'Demo Customer D', date: '07 Oct 2026', amount: 28500, status: 'Pending' },
  ];

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const closeForm = () => {
    setShowForm(false);
    setProductImage(null);
    setForm(initialForm);
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    if (!productImage) {
      toast.error('Please choose a product photo.');
      return;
    }
    if (!form.name.trim() || !form.sku.trim() || form.price === '' || Number(form.price) < 0) {
      toast.error('Enter a product name, unique SKU, and valid price.');
      return;
    }
    if (Number(form.stock) < 0 || Number(form.weight) < 0) {
      toast.error('Stock and weight cannot be negative.');
      return;
    }

    const selectedCategory = categoryGroups.find((category) => category.slug === form.category);
    const data = new FormData();
    data.append('name', form.name.trim());
    data.append('sku', form.sku.trim());
    data.append('category', form.category);
    data.append('categoryName', selectedCategory?.name || 'Jewellery');
    data.append('subcategory', form.subcategory || '');
    data.append('price', String(Number(form.price)));
    data.append('stock', String(Number(form.stock) || 0));
    data.append('purity', form.purity);
    data.append('weight', String(Number(form.weight) || 0));
    data.append('description', form.description || '');
    data.append('image', productImage);

    try {
      setSavingProduct(true);
      const response = await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const savedProduct = response?.data;
      if (!savedProduct) throw new Error('The server did not return the saved product.');

      setItems((current) => [mapProduct(savedProduct), ...current.filter((p) => p.id !== (savedProduct._id || savedProduct.id))]);
      toast.success('Product and photo saved successfully!');
      closeForm();
    } catch (error) {
      console.error('Product upload failed:', error);
      toast.error(error.message || 'Could not save product. Check the backend terminal.');
    } finally {
      setSavingProduct(false);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="wordmark admin-logo">
          <span>VASUKI</span><small>GUARDIAN OF GOLD</small>
        </Link>
        <div className="admin-side-label">WORKSPACE</div>
        {links.map(([name, path, Icon]) => (
          <Link key={path} to={path} className={`admin-nav-link ${section === name ? 'active' : ''}`}>
            <Icon size={17} />{name}{name === 'Orders' && <i>4</i>}
          </Link>
        ))}
        <div className="admin-sidebar-bottom">
          <div className="admin-avatar">VG</div>
          <div><b>VASUKI administrator</b><small>Admin workspace</small></div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-breadcrumb">VASUKI / ADMIN / </span><b>{section}</b></div>
          <div>
            <span className="demo-pill"><i /> ADMIN WORKSPACE</span>
            <button aria-label="Notifications" onClick={() => toast('No new notifications')}><Bell size={18} /></button>
            <Link to="/" aria-label="Open storefront"><ArrowUpRight size={18} /></Link>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-title">
            <div>
              <span className="eyebrow">VASUKI · GUARDIAN OF GOLD</span>
              <h1>{isDashboard ? 'A considered overview.' : `${section}.`}</h1>
              <p>{isDashboard ? 'A quiet look at what is happening across your VASUKI storefront.' : `Manage ${section.toLowerCase()} for the VASUKI storefront.`}</p>
            </div>
            {['Products', 'Categories', 'Campaigns', 'Coupons', 'Banners'].includes(section) && (
              <button className="button button-dark" onClick={() => setShowForm(true)}>
                <Plus size={16} /> Add {section === 'Products' ? 'product' : section === 'Categories' ? 'category' : section === 'Coupons' ? 'coupon' : section === 'Banners' ? 'banner' : 'campaign'}
              </button>
            )}
          </div>

          {isDashboard ? (
            <>
              <div className="admin-stat-grid">
                {[
                  ['Total revenue', '₹8,42,650', '+12.8%', Coins],
                  ['Orders', '128', '+8.2%', ShoppingCart],
                  ['Customers', '1,842', '+6.4%', Users],
                  ['Products', String(items.length), 'Catalogue', Package],
                  ['Low stock', String(items.filter((p) => p.stock < 5).length).padStart(2, '0'), 'Needs attention', AlertTriangle],
                  ['Pending orders', '12', 'Awaiting action', CalendarDays],
                ].map(([label, value, change, Icon]) => (
                  <article className="admin-stat" key={label}>
                    <div><span>{label}</span><Icon size={18} /></div>
                    <h2>{value}</h2><small className={String(change).includes('+') ? 'positive' : ''}>{change}</small>
                  </article>
                ))}
              </div>

              <div className="admin-charts">
                <section className="admin-panel sales-panel">
                  <div className="admin-panel-heading"><div><h3>Sales overview</h3><p>Illustrative weekly revenue · ₹ thousands</p></div><span>This week</span></div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={sales}>
                      <defs><linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b89b62" stopOpacity={0.24} /><stop offset="100%" stopColor="#b89b62" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeae1" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8b887f', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b887f', fontSize: 12 }} />
                      <Tooltip /><Area type="monotone" dataKey="sales" stroke="#a78a4e" strokeWidth={2} fill="url(#goldFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </section>
                <section className="admin-panel">
                  <div className="admin-panel-heading"><div><h3>Order activity</h3><p>Demo order status breakdown</p></div><MoreHorizontal size={19} /></div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={[{ name: 'Pending', count: 12 }, { name: 'Confirmed', count: 31 }, { name: 'Shipped', count: 45 }, { name: 'Delivered', count: 40 }]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeae1" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b887f', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b887f', fontSize: 11 }} />
                      <Tooltip /><Bar dataKey="count" fill="#b89b62" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </section>
              </div>

              <section className="admin-panel admin-table-panel">
                <div className="admin-panel-heading"><div><h3>Recent orders</h3><p>Sample order activity</p></div><Link to="/admin/orders">View all <ArrowUpRight size={14} /></Link></div>
                <table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>{orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{order.date}</td><td>{money(order.amount)}</td><td><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></td></tr>)}</tbody>
                </table>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-heading"><div><h3>Top products</h3><p>Catalogue preview</p></div><Link to="/admin/products">Manage products <ArrowUpRight size={14} /></Link></div>
                <div className="top-products">{items.slice(0, 4).map((product, index) => (
                  <div key={product.id || product.sku}>
                    {product.image ? <img src={product.image} alt={product.name} /> : <div className="admin-avatar">VG</div>}
                    <span><b>{product.name}</b><small>{product.sku}</small></span><strong>{[42, 35, 29, 24][index]} sold</strong>
                    <span className="positive"><TrendingUp size={14} /> {['18%', '12%', '9%', '6%'][index]}</span>
                  </div>
                ))}</div>
              </section>
            </>
          ) : (
            <section className="admin-panel admin-table-panel">
              <div className="admin-panel-heading">
                <div><h3>{section} management</h3><p>{section === 'Products' ? 'Add products with real photos and save them to the backend.' : 'Some records on this screen are illustrative demo data.'}</p></div>
                <button className="button button-outline" onClick={() => toast('Export is not connected yet.')}><Download size={15} /> Export</button>
              </div>
              {['Products', 'Categories', 'Orders', 'Customers', 'Reviews', 'Gold rates', 'Campaigns', 'Coupons', 'Stores', 'Appointments', 'Banners', 'Settings'].includes(section) && (
                <div className="admin-table-tools">
                  <div><Search size={16} /><input placeholder={`Search ${section.toLowerCase()}…`} value={query} onChange={(event) => setQuery(event.target.value)} /></div>
                  {section === 'Orders' && <select value={tab} onChange={(event) => setTab(event.target.value)}><option>All</option><option>Pending</option><option>Confirmed</option><option>Shipped</option><option>Processing</option></select>}
                </div>
              )}

              {section === 'Products' ? (
                <table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Purity</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
                  <tbody>{rows.map((product) => (
                    <tr key={product.id || product.sku}>
                      <td><div className="table-product">{product.image ? <img src={product.image} alt={product.name} /> : <div className="admin-avatar">VG</div>}<b>{product.name}</b></div></td>
                      <td>{product.sku}</td><td>{product.categoryName}</td><td>{product.purity}</td><td>{money(product.price)}</td><td>{product.stock}</td>
                      <td><span className={`status ${product.stock < 5 ? 'status-pending' : 'status-delivered'}`}>{product.stock < 5 ? 'Low stock' : 'Active'}</span></td>
                      <td><button aria-label={`Product options for ${product.name}`} onClick={() => toast('Product editing is not connected yet.')}><MoreHorizontal size={17} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              ) : section === 'Categories' ? (
                <table><thead><tr><th>Category</th><th>Slug</th><th>Subcategories</th><th>Products</th><th>Status</th></tr></thead>
                  <tbody>{categoryGroups.filter((category) => category.name.toLowerCase().includes(query.toLowerCase())).map((category) => (
                    <tr key={category.slug}><td>{category.name}</td><td>/{category.slug}</td><td>{category.subs.length}</td><td>{products.filter((product) => product.category === category.slug).length}</td><td><span className="status status-delivered">Active</span></td></tr>
                  ))}</tbody>
                </table>
              ) : section === 'Orders' ? (
                <table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>{orders.filter((order) => (tab === 'All' || order.status === tab) && `${order.id} ${order.customer}`.toLowerCase().includes(query.toLowerCase())).map((order) => (
                    <tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{order.date}</td><td>{money(order.amount)}</td><td><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></td><td><button onClick={() => toast(`Demo order ${order.id}`)}>View <ArrowUpRight size={13} /></button></td></tr>
                  ))}</tbody>
                </table>
              ) : (
                <div className="admin-placeholder-grid">
                  {(section === 'Gold rates' ? ['24K · ₹9,250/g', '22K · ₹8,480/g', '18K · ₹6,940/g', '14K · ₹5,395/g']
                    : section === 'Customers' ? ['Demo Customer A', 'Demo Customer B', 'Demo Customer C']
                    : section === 'Reviews' ? ['4.8 average rating', '128 total reviews', '6 awaiting moderation']
                    : section === 'Campaigns' ? ['Bridal Grandeur', 'Everyday Elegance', 'Guardian of Gold']
                    : section === 'Coupons' ? ['DEMO10 · 10%', 'WELCOME · demo', 'FESTIVE · demo']
                    : section === 'Stores' ? ['Demo showroom — no physical location', 'Store API not connected']
                    : section === 'Appointments' ? ['3 demo appointments', 'Appointment API not connected']
                    : section === 'Banners' ? ['Homepage hero', 'Signature collection', 'Wedding editorial']
                    : section === 'Settings' ? ['Store configuration', 'API integration', 'Access and roles']
                    : ['Management overview', 'No live records connected'])
                    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
                    .map((item) => <article key={item}><span className="eyebrow">{section.toUpperCase()}</span><h3>{item}</h3><p>Demo data · Backend integration may be required.</p><button onClick={() => toast('This action is not connected yet.')}>Manage <ArrowUpRight size={14} /></button></article>)}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={closeForm}>
          <form className="admin-product-form" onSubmit={saveProduct} onClick={(event) => event.stopPropagation()}>
            <div className="admin-panel-heading">
              <div><span className="eyebrow">CATALOGUE MANAGEMENT</span><h2>Add product</h2></div>
              <button type="button" onClick={closeForm} aria-label="Close form">×</button>
            </div>

            <label>Product name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} /></label>
            <label>SKU<input required value={form.sku} onChange={(event) => updateForm('sku', event.target.value)} /></label>
            <label>Category<select value={form.category} onChange={(event) => {
              const category = categoryGroups.find((item) => item.slug === event.target.value);
              setForm((current) => ({ ...current, category: event.target.value, subcategory: category?.subs?.[0] || '' }));
            }}>{categoryGroups.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
            <label>Subcategory<select value={form.subcategory} onChange={(event) => updateForm('subcategory', event.target.value)}>
              {(categoryGroups.find((category) => category.slug === form.category)?.subs || []).map((subcategory) => <option key={subcategory} value={subcategory}>{subcategory}</option>)}
            </select></label>

            <div className="form-grid">
              <label>Price (INR)<input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateForm('price', event.target.value)} /></label>
              <label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={(event) => updateForm('stock', event.target.value)} /></label>
              <label>Purity<select value={form.purity} onChange={(event) => updateForm('purity', event.target.value)}>{['10K', '14K', '18K', '22K', '24K'].map((purity) => <option key={purity}>{purity}</option>)}</select></label>
              <label>Weight (g)<input type="number" min="0" step="0.01" value={form.weight} onChange={(event) => updateForm('weight', event.target.value)} /></label>
            </div>

            <label>Description<textarea rows="3" value={form.description} onChange={(event) => updateForm('description', event.target.value)} /></label>

            <label className="product-photo-upload">
              Product photo *
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    setProductImage(null);
                    return;
                  }
                  if (!file.type.startsWith('image/')) {
                    toast.error('Choose a valid image file.');
                    event.target.value = '';
                    setProductImage(null);
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error('Image must be 5 MB or smaller.');
                    event.target.value = '';
                    setProductImage(null);
                    return;
                  }
                  setProductImage(file);
                }}
              />
              <small>JPG, PNG, WEBP or GIF · maximum 5 MB</small>
            </label>

            {imagePreview && <div className="product-image-preview"><img src={imagePreview} alt="Selected product preview" /><span>{productImage?.name}</span></div>}

            <button className="button button-dark" type="submit" disabled={savingProduct}>
              {savingProduct ? 'Uploading photo…' : 'Save product'}
              {!savingProduct && <ArrowUpRight size={15} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
