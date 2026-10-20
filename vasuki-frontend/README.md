# VASUKI — Guardian of Gold

A JavaScript React + Vite frontend for a luxury jewellery e-commerce experience. The project uses React Router, Framer Motion, Lucide React, Axios, React Hook Form-compatible conventions, Sonner notifications and Recharts.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell equivalent for environment setup:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`).

## Build and lint

```bash
npm run build
npm run lint
```

## Demo-mode behaviour

`VITE_USE_DEMO_DATA=true` labels the catalogue/rates/orders as illustrative demo content. The current application is a frontend demo with localStorage-backed guest cart, wishlist and recently viewed products. Login, newsletter, checkout payment, invoice/order records, gold-rate values, appointment/store data and admin data are not connected to a live service. Simulated payment does not collect or store card numbers/CVV. The UI never claims the displayed gold rates are live. Do not use the demo price/tax calculation as a production checkout authority.

Set `VITE_API_URL=http://localhost:5000/api` to point the Axios client at the planned backend. Service requests should be moved into `src/services/` as backend endpoints are confirmed. Before accepting real orders, the backend must authoritatively validate inventory, calculate prices and taxes, enforce any 24-hour gold-rate lock, authorize roles, and process payment through a compliant provider.

## Supplied brand assets

Place the official logo in `public/images/brand/vasuki-logo.svg` (or `.png`) and the supplied hero image/video in `public/images/hero/`. Replace the editorial demo hero with your supplied asset by updating `src/pages/Home.jsx`. Category image slots are under `public/images/categories/` with names matching the category image keys in `src/data/catalog.js` (for example `rings.jpg`, `earrings.jpg`, `nose-pins.jpg`). Product images belong in `public/images/products/<category>/`.

No user-supplied image files were available in the working environment at scaffold time. The catalogue currently uses clearly demo/remote editorial images. The image fallback means local category assets can be added progressively. Do not describe these images as classified user assets.

## Routes

- Homepage: `/`
- Category and subcategory: `/category/:slug`, `/category/:slug/:subslug`
- Product detail: `/product/:id`
- Search: `/search?q=...`
- Collections, cart, wishlist, account, checkout, gold rate, journey, try-on
- Client care, policy, and information routes
- Admin: `/admin/dashboard`, `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/customers`, `/admin/reviews`, `/admin/gold-rates`, `/admin/campaigns`, `/admin/coupons`, `/admin/stores`, `/admin/appointments`, `/admin/banners`, `/admin/settings`

## Important production gaps

- Admin screens are a UI demonstration and are not a security boundary. Backend role-based authorization is mandatory.
- Authentication and account actions need a backend; demo forms do not authenticate users.
- Checkout uses a simulated payment selection and local demo confirmation only.
- Invoice PDF download, live order tracking, actual appointment/store APIs, upload/reorder image APIs, reviews moderation, notification delivery and real payment provider integration remain to be connected to backend services.
- Try-on is a manual 2D image overlay, not AR. Transparent cutout assets are recommended for convincing previews.
- Demo reviews, order analytics and product pricing must be replaced with authoritative business data before production.
- The category and subcategory architecture is in `src/data/catalog.js`; it is the single source of truth for category labels/slugs.

## Asset naming suggestions

```text
public/images/brand/vasuki-logo.svg
public/images/hero/vasuki-hero.jpg
public/images/categories/rings.jpg
public/images/categories/earrings.jpg
public/images/categories/necklaces.jpg
public/images/categories/bangles.jpg
public/images/categories/bracelets.jpg
public/images/categories/pendants.jpg
public/images/categories/nose-pins.jpg
public/images/categories/charms.jpg
public/images/categories/mangalsutra.jpg
public/images/categories/sets.jpg
public/images/categories/wedding.jpg
public/images/categories/diamond.jpg
public/images/categories/gold.jpg
public/images/categories/gemstone.jpg
public/images/categories/mens.jpg
public/images/categories/womens.jpg
public/images/categories/kids.jpg
```

## Notes

Product catalogue names, SKU values, prices, weights, ratings and gold rates are illustrative demo data. Please verify the final brand tagline and copy against supplied official brand assets before publishing.
