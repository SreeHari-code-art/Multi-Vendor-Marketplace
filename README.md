# Multi-Vendor-Marketplace

A MERN multi-vendor marketplace: customers shop across many sellers in one cart, sellers manage their own products and orders, and admins oversee the platform.

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
**Frontend:** React (Vite), Redux Toolkit, React Router, Tailwind CSS

## Getting started

Pick one: **Docker** (everything in containers) or **Local** (Node on your machine). The same instructions live in `docs/Run with Docker.md` and `docs/Run locally.md`. For a fresh Windows laptop without Docker, see [docs/Run without Docker.md](docs/Run%20without%20Docker.md).

### Option A: Docker

Requires Docker Desktop (Compose v2). Run everything from the project root (the folder containing `docker-compose.yml`).

```bash
docker compose up --build
```

Open **http://localhost:8080**. The first build downloads dependencies and takes a few minutes; later builds reuse the cache. Leave it running until you see `MongoDB connected: mongo` and `API running on http://localhost:5000` (that port is inside the container).

Load the demo data from a second terminal (once):

```bash
docker compose run --rm backend npm run seed
```

Stop with `docker compose down`. Add `-v` to also delete the database.

#### Ports

| Service  | Host port | Change it                                  |
| -------- | --------- | ------------------------------------------ |
| Web app  | 8080      | `WEB_PORT=8081 docker compose up --build`  |
| MongoDB  | 27017     | `MONGO_PORT=27018 docker compose up --build` |
| API      | not published | Use `http://localhost:8080/api/...` (nginx forwards it) |

The API is deliberately not published: macOS reserves host port 5000 for AirPlay Receiver, which would break `docker compose up`. Quick check: `curl http://localhost:8080/api/health` should return `{"ok":true}`.

#### If `npm ci` is slow or hangs during the build

The Dockerfiles already force IPv4 DNS and set npm retries/timeouts. If the frontend build still stalls, build the frontend on your Mac and let Docker only package it:

```bash
(cd frontend && npm ci && npm run build)
export COMPOSE_FILE=docker-compose.yml:docker-compose.prebuilt.yml
docker compose up --build
```

Keep that `export` in the same terminal (also for the `seed` and `down` commands), or run `unset COMPOSE_FILE` to go back to the normal build.

#### Starting clean after failed attempts

```bash
docker compose down --remove-orphans
docker ps -a        # look for leftover containers from manual `docker run` commands
docker rm -f <name> # remove any you don't need
```

### Option B: Local

Requires Node 22 (Vite 8 needs Node 20.19+ or 22.12+) and MongoDB on `localhost:27017`. No MongoDB installed? Use the container from this repo:

```bash
docker compose up -d mongo
```

**Terminal 1: backend** (http://localhost:5001)

```bash
cd backend
cp .env.example .env     # then set JWT_SECRET to any long random string
npm ci
npm run seed             # optional demo data
npm run dev
```

**Terminal 2: frontend** (http://localhost:5173)

```bash
cd frontend
npm ci
npm run dev
```

Open **http://localhost:5173**. Vite proxies `/api` to the backend on port 5001.

Notes:
- The local API uses port 5001 because macOS reserves 5000 for AirPlay Receiver.
- If you started Mongo with `MONGO_PORT=27018`, change the port in `MONGO_URI` inside `backend/.env`.
- The Docker stack (port 8080) and the local stack (port 5173) can run side by side; they don't share ports except MongoDB.

## Demo accounts (after `npm run seed`)

| Role     | Email                    | Password       |
| -------- | ------------------------ | -------------- |
| Admin    | admin@example.com        | Admin@123      |
| Seller   | techhaven@example.com    | Seller@123     |
| Customer | customer@example.com     | Customer@123   |

Admin credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (root `.env` for Docker, `backend/.env` for local). Anyone can register as a customer or seller; admins can only be created by seeding or by an existing admin.

## API overview

| Area     | Endpoints                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| Auth     | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`                                             |
| Products | `GET /api/products` (search, category, minPrice, maxPrice, sort, page, limit), `GET /api/products/:id`, `GET /api/products/categories` |
| Seller   | `GET /api/products/mine`, `POST/PUT/DELETE /api/products[/:id]`, `GET/PUT /api/shops/me`, `GET /api/orders/seller`, `PUT /api/orders/:id/status` |
| Customer | `POST /api/orders`, `GET /api/orders/my`                                                                          |
| Admin    | `GET /api/admin/stats`, `/users`, `/shops`, `/orders`, `PUT /api/admin/users/:id/role`, `PUT /api/admin/shops/:id/verify`, `DELETE /api/admin/users/:id` |

## Design notes

- **Orders are split per shop.** A cart with items from several shops becomes one order per shop, so each seller sees and fulfils only their own items.
- **Server-side pricing and stock.** Checkout ignores client prices, decrements stock atomically per product, and releases reserved stock if any line fails.
- **Order status moves forward only:** Pending → Processing → Shipped → Delivered.
- **Payments are simulated** (Cash on Delivery or Simulated); no gateway is integrated.
- Currency is formatted in INR; change it in `frontend/src/utils/format.js`.
