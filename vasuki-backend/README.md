# VASUKI Backend

JavaScript REST API for the VASUKI — Guardian of Gold frontend. This backend is a sibling of `vasuki-frontend`, and its initial implementation is limited to Express setup, MongoDB connection, and a health endpoint.

## Structure

```text
vasuki-backend/
  src/
    app.js
    server.js
    config/
      database.js
      env.js
    middleware/
      errorHandler.js
      notFound.js
    routes/
      health.routes.js
  .env.example
```

Planned feature modules will add `models/`, `controllers/`, `services/`, `validators/`, and feature-specific routes as each API phase is implemented. They are not present or functional yet.

## Requirements

- Node.js 20 or newer
- MongoDB running locally or a MongoDB connection URI

## Run locally

From this directory:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Set `MONGODB_URI` in `.env` to the target database. The frontend's existing `VITE_API_URL` default points to `http://localhost:5000/api`, which matches the default backend port.

## Implemented API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Reports API and MongoDB connection status |

The health route returns HTTP `200` when MongoDB is connected and `503` otherwise. It does not disclose the connection URI.

## Planned API phases

Authentication and role authorization, product/category/collection APIs and Cloudinary image uploads, cart/wishlist, orders, and gold-rate management are future phases. No login, admin dashboard, product CRUD, upload, cart, wishlist, order, or gold-rate endpoint is implemented by this foundation. The browser-provided role must never grant authorization; admin access will be based on a verified server-side user record and signed token claims.

JWT and Cloudinary settings are listed in `.env.example` for planning and are not read or required by this foundation. Never commit `.env` or expose those values to the frontend.