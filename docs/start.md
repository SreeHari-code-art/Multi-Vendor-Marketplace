# Build the Multi-Vendor Marketplace from Scratch

This guide walks through creating the project in implementation order: repository setup, dependencies, backend, frontend, Docker, and documentation. It describes the current project structure and stack: **Node.js/Express, MongoDB/Mongoose, React/Vite, Redux Toolkit, React Router, Axios, and Tailwind CSS**.

## 1. Install prerequisites

- **Git**
- **Node.js 22 LTS** and npm. Node 22 is used by the Dockerfiles and supports the current Vite toolchain.
- **MongoDB 7**, either installed locally or run with Docker Compose.
- **Docker Desktop** (optional, for container-based development)
- An editor such as Visual Studio Code

Check your installations:

```bash
git --version
node --version
npm --version
docker --version
docker compose version
```

## 2. Create and initialize the repository

For a new project:

```bash
mkdir multi-vendor-marketplace
cd multi-vendor-marketplace
git init
```

If you are starting from an existing remote repository, clone it instead:

```bash
git clone <repository-url>
cd multi-vendor-marketplace
```

Create the root `.gitignore` before adding local dependencies or credentials. Create the `backend`, `frontend`, and `docs` directories. Keep backend and frontend as separate npm projects; each has its own `package.json` and lockfile.

## 3. Install project dependencies

From the repository root, initialize the backend package and install its runtime dependencies:

```bash
cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

Add these scripts to `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "seed": "node src/seed.js"
  }
}
```

Initialize the frontend with Vite and install the app dependencies:

```bash
cd ../frontend
npm create vite@latest . -- --template react
npm install
npm install @reduxjs/toolkit axios react-redux react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

Use the scripts created by Vite: `dev`, `build`, and `preview`. The `npm install` commands generate `package-lock.json`; commit these lockfiles, but do not edit them by hand.

## 4. Implement files in this order

Work through the numbered steps in order. Each step identifies the file and its responsibility. The two `.env` files named below are examples; create private `.env` files by copying them and never commit the private files.

### Repository and backend

1. **`.gitignore`** — Exclude `node_modules/`, build output, `.env` files, and operating-system files.
2. **`.dockerignore`** — Exclude local dependencies, environment files, and generated output from Docker build contexts.
3. **`.env.example`** — Document Docker-level settings such as the JWT secret and admin seed credentials.
4. **`backend/package.json`** — Define backend dependencies and the `start`, `dev`, and `seed` scripts.
5. **`backend/.env.example`** — Document `PORT`, `MONGO_URI`, JWT settings, client origin, and seed-admin credentials.
6. **`backend/src/models/User.js`** — Define users, password hashing, and customer/seller/admin roles.
7. **`backend/src/models/Shop.js`** — Define seller-owned shops and their verification state.
8. **`backend/src/models/Product.js`** — Define shop-owned products, price, stock, category, and description.
9. **`backend/src/models/Order.js`** — Define customer orders, line items, shipping address, payment method, and status.
10. **`backend/src/config/db.js`** — Connect to MongoDB using `MONGO_URI` and fail clearly if the connection fails.
11. **`backend/src/middleware/authMiddleware.js`** — Read and verify the JWT and attach the authenticated user to the request.
12. **`backend/src/middleware/roleMiddleware.js`** — Restrict protected routes to the required user roles.
13. **`backend/src/middleware/errorMiddleware.js`** — Handle unknown routes and report API errors consistently.
14. **`backend/src/utils/pick.js`** — Pick permitted fields from request data to avoid accepting unintended properties.
15. **`backend/src/controllers/authController.js`** — Implement registration, login, and current-user operations.
16. **`backend/src/controllers/productController.js`** — Implement public product listing/search and seller product CRUD.
17. **`backend/src/controllers/shopController.js`** — Implement seller shop profile and shop-related operations.
18. **`backend/src/controllers/orderController.js`** — Implement customer checkout/order history and seller order management.
19. **`backend/src/controllers/adminController.js`** — Implement admin statistics and user, shop, and order management.
20. **`backend/src/routes/authRoutes.js`** — Connect authentication endpoints to their controller methods.
21. **`backend/src/routes/productRoutes.js`** — Connect public product and seller product endpoints.
22. **`backend/src/routes/shopRoutes.js`** — Connect shop profile endpoints and required authentication.
23. **`backend/src/routes/orderRoutes.js`** — Connect customer and seller order endpoints with role checks.
24. **`backend/src/routes/adminRoutes.js`** — Protect administrative endpoints with authentication and admin-role checks.
25. **`backend/server.js`** — Configure Express, CORS, JSON parsing, health check, API routes, and error middleware; connect to MongoDB before listening.
26. **`backend/src/seed.js`** — Add repeatable demo data for an admin, customer, sellers, shops, and products.
27. **`backend/Dockerfile`** — Build and run the production backend container.
28. **`backend/.dockerignore`** — Keep local-only files and dependencies out of the backend image build.

### Frontend

29. **`frontend/package.json`** — List React, Vite, Tailwind, Redux Toolkit, Axios, and React Router dependencies and scripts.
30. **`frontend/vite.config.js`** — Configure React and Tailwind plugins and proxy `/api` requests to the local backend on port `5001`.
31. **`frontend/index.html`** — Define the browser document, app mount point, page title, and favicon.
32. **`frontend/public/favicon.svg`** — Add the browser tab icon.
33. **`frontend/src/index.css`** — Import Tailwind and define reusable button, form, table, and card styles.
34. **`frontend/src/app/store.js`** — Configure Redux reducers and persist cart/wishlist state.
35. **`frontend/src/services/api.js`** — Configure Axios API requests, JWT authorization, and expired-session handling.
36. **`frontend/src/utils/format.js`** — Centralize display formatting, including INR currency.
37. **`frontend/src/features/auth/authSlice.js`** — Manage authentication state and login/register actions.
38. **`frontend/src/features/products/productSlice.js`** — Manage product data and product-loading state.
39. **`frontend/src/features/cart/cartSlice.js`** — Manage cart items and cart operations.
40. **`frontend/src/features/wishlist/wishlistSlice.js`** — Manage wishlist items and wishlist operations.
41. **`frontend/src/main.jsx`** — Mount React, Redux Provider, the app, and global styles.
42. **`frontend/src/components/common/ui.jsx`** — Provide shared UI helpers/components used across pages.
43. **`frontend/src/components/common/Navbar.jsx`** — Build site navigation and role-aware links.
44. **`frontend/src/components/common/Footer.jsx`** — Build the shared page footer.
45. **`frontend/src/components/common/ProtectedRoute.jsx`** — Guard routes by sign-in state and permitted role.
46. **`frontend/src/components/product/ProductCard.jsx`** — Render a product summary and its shopping actions.
47. **`frontend/src/pages/auth/Login.jsx`** — Build the sign-in form and connect it to authentication state.
48. **`frontend/src/pages/auth/Register.jsx`** — Build customer/seller registration.
49. **`frontend/src/pages/customer/Home.jsx`** — Build the customer landing page.
50. **`frontend/src/pages/customer/ProductCatalog.jsx`** — Build product browsing, search, filters, and sorting.
51. **`frontend/src/pages/customer/ProductDetails.jsx`** — Build an individual product page.
52. **`frontend/src/pages/customer/Cart.jsx`** — Show and update cart items.
53. **`frontend/src/pages/customer/Wishlist.jsx`** — Show and manage saved products.
54. **`frontend/src/pages/customer/Checkout.jsx`** — Collect shipping details, review totals, and place an order.
55. **`frontend/src/pages/customer/MyOrders.jsx`** — Show the signed-in customer’s orders and statuses.
56. **`frontend/src/pages/seller/SellerDashboard.jsx`** — Show the seller overview.
57. **`frontend/src/pages/seller/ManageProducts.jsx`** — Create, edit, and remove the seller’s products.
58. **`frontend/src/pages/seller/ManageOrders.jsx`** — Show seller orders and update their allowed statuses.
59. **`frontend/src/pages/admin/AdminDashboard.jsx`** — Show platform-wide administration statistics.
60. **`frontend/src/pages/admin/ManageUsers.jsx`** — Manage users and roles as an admin.
61. **`frontend/src/pages/admin/ManageShops.jsx`** — Review and manage seller shops.
62. **`frontend/src/App.jsx`** — Configure public/customer/seller/admin routes, shared layout, and not-found page.
63. **`frontend/Dockerfile`** — Build the Vite app and serve it with Nginx.
64. **`frontend/nginx.conf`** — Serve the single-page app, proxy `/api` to the backend container, and support deep links.
65. **`frontend/.dockerignore`** — Exclude local dependencies, environment files, and build output from the image build.

### Compose and project documentation

66. **`docker-compose.yml`** — Define MongoDB, backend, and frontend services, health checks, ports, and persistent database storage.
67. **`README.md`** — Document the project overview, setup options, demo accounts, and API overview.
68. **`checklist.md`** — Track implementation milestones and completed features.
69. **`docs/Tech Stack.md`** — Describe the technologies actually used. Keep this consistent with the React/Tailwind project.
70. **`docs/System Architecture.md`** — Diagram the frontend, API, middleware, and database relationships.
71. **`docs/Data Flow Architecture.md`** — Document data relationships and the flow through customer, seller, and admin features.
72. **`docs/Tree Struture.md`** — Document the repository file tree (consider correcting the filename spelling to `Tree Structure.md` if you also update its links).
73. **`docs/Run locally.md`** — Document local backend and frontend development.
74. **`docs/Run with Docker.md`** — Document Compose startup, seeding, and shutdown.
75. **`start.md`** — Keep this from-scratch implementation guide up to date.
76. **`.vscode/settings.json`** — Optional repository-level editor settings; add only settings useful to contributors.

`backend/package-lock.json` and `frontend/package-lock.json` are generated by npm. Generate and commit them after installing dependencies; do not write them manually. Create `backend/.env` from `backend/.env.example` for local work, but do not commit it.

## 5. Configure local environment

Copy the backend example file and adjust values for your machine:

```bash
cp backend/.env.example backend/.env
```

Ensure MongoDB is available at the `MONGO_URI` in `backend/.env`. The example uses `127.0.0.1:27017`. Set `JWT_SECRET` to a long, unique random value before using the app beyond local development.

## 6. Start the project locally

Start MongoDB first. Or, if Docker is installed, start only the database from the repository root:

```bash
docker compose up -d mongo
```

In terminal 1, start the backend:

```bash
cd backend
npm install
npm run seed
npm run dev
```

In terminal 2, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend development server proxies API requests to `http://localhost:5001`; the backend health endpoint is `http://localhost:5001/api/health`.

## 7. Build and verify

Run a production frontend build:

```bash
cd frontend
npm run build
```

Check the API health endpoint while the backend is running:

```bash
curl http://localhost:5001/api/health
```

Expected response:

```json
{"ok":true}
```

## 8. Run the full stack with Docker

From the repository root:

```bash
docker compose up --build
```

Open `http://localhost:8080`. To seed demo data from another terminal:

```bash
docker compose run --rm backend npm run seed
```

Stop the containers with `docker compose down`. Add `-v` only when you intend to delete the persisted MongoDB data.

## 9. Save your work in Git

Review the changed files, make sure no `.env` file or credentials are staged, then commit:

```bash
git status
git add .
git status
git commit -m "Build multi-vendor marketplace"
```

If you have a remote repository, add its URL and push your branch:

```bash
git remote add origin <repository-url>
git push -u origin main
```
