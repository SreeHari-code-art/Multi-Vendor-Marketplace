```bash

Multi-Vendor-Marketplace/
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Shop.js
│       │   ├── Product.js
│       │   └── Order.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── productController.js
│       │   ├── shopController.js
│       │   ├── orderController.js
│       │   └── adminController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── productRoutes.js
│       │   ├── shopRoutes.js
│       │   ├── orderRoutes.js
│       │   └── adminRoutes.js
│       └── middleware/
│           ├── authMiddleware.js
│           └── roleMiddleware.js
│
└── frontend/
    ├── public/
    │   └── favicon.ico
    ├── package.json
    ├── tailwind.config.js (or bootstrap setup)
    └── src/
        ├── app/
        │   └── store.js
        ├── features/
        │   ├── auth/
        │   │   └── authSlice.js
        │   ├── cart/
        │   │   └── cartSlice.js
        │   ├── wishlist/
        │   │   └── wishlistSlice.js
        │   └── products/
        │       └── productSlice.js
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   └── ProtectedRoute.jsx
        │   └── product/
        │       └── ProductCard.jsx
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── customer/
        │   │   ├── Home.jsx
        │   │   ├── ProductCatalog.jsx
        │   │   ├── ProductDetails.jsx
        │   │   ├── Cart.jsx
        │   │   └── Checkout.jsx
        │   ├── seller/
        │   │   ├── SellerDashboard.jsx
        │   │   ├── ManageProducts.jsx
        │   │   └── ManageOrders.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── ManageUsers.jsx
        │       └── ManageShops.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        └── main.jsx
```

Detailed breakdown of every file in `Multi-Vendor-Marketplace` project structure, explaining its specific function, role, and responsibility within the MERN architecture.

---

### Root Directory

- **`Multi-Vendor-Marketplace/`**: The monorepo root container holding separate workspaces for your server (`backend`) and client (`frontend`).

---

### Backend (`/backend`)

#### Root & Config

- **`backend/.env`**: Stores sensitive environment variables and configuration secrets (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`) kept out of version control.
- **`backend/package.json`**: Manages backend dependencies (such as `express`, `mongoose`, `dotenv`, `jsonwebtoken`, `bcryptjs`) and script entry points.
- **`backend/server.js`**: The main application entry point. Initializes the Express app, applies global middleware (`cors`, `express.json()`), connects to the database via `db.js`, mounts API route handlers, and starts listening on the designated port.
- **`backend/src/config/db.js`**: Handles MongoDB connection logic using Mongoose, establishing the connection pool and handling success or error states on startup.

#### Models (`backend/src/models/`)

- **`User.js`**: Mongoose schema for system users. Defines fields for name, email, hashed password, and role (`customer`, `seller`, `admin`).
- **`Shop.js`**: Mongoose schema representing vendor storefronts. Links a seller (`ownerId` referencing `User`), store name, description, and verification status (`isVerified`).
- **`Product.js`**: Mongoose schema for catalog items. Links each product to a specific shop (`shopId`), storing item titles, pricing, stock levels, and categories.
- **`Order.js`**: Mongoose schema for customer purchases. Stores references to the buying user (`customerId`), embedded order items with quantities/prices, shipping addresses, payment methods, and current fulfillment status (`Pending`, `Processing`, `Shipped`, `Delivered`).

#### Controllers (`backend/src/controllers/`)

- **`authController.js`**: Contains business logic for user registration and login, including password hashing (`bcrypt`) and JWT token generation.
- **`productController.js`**: Handles operations for adding, updating, deleting vendor products, alongside public query logic for searching, filtering, and fetching product lists.
- **`shopController.js`**: Manages vendor store profile creation, profile updates, and status retrieval.
- **`orderController.js`**: Manages order creation logic during checkout, handles stock decrement routines, and retrieves orders for specific customers.
- **`adminController.js`**: Handles administrative platform oversight, letting admins monitor and manage registered users, shops, and platform-wide orders.

#### Routes (`backend/src/routes/`)

- **`authRoutes.js`**: Maps HTTP endpoints (`/api/auth/register`, `/api/auth/login`) to their respective controller functions.
- **`productRoutes.js`**: Defines public and protected endpoints for product CRUD operations and catalog searches.
- **`shopRoutes.js`**: Maps endpoints for vendor shop creation and management.
- **`orderRoutes.js`**: Defines endpoints for checkout submission and order history tracking.
- **`adminRoutes.js`**: Maps restricted administrative endpoints for platform management.

#### Middleware (`backend/src/middleware/`)

- **`authMiddleware.js`**: Verifies incoming JSON Web Tokens (JWT) from request headers to authenticate users and attach user data to the request object.
- **`roleMiddleware.js`**: Enforces Role-Based Access Control (RBAC), verifying whether an authenticated user holds the required role (`customer`, `seller`, or `admin`) before permitting access to protected routes.

---

### Frontend (`/frontend`)

#### Root & Public

- **`frontend/public/favicon.ico`**: The browser tab icon for your web application.
- **`frontend/package.json`**: Manages frontend dependencies (such as `react`, `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `axios`, and CSS/Bootstrap packages) and build scripts.
- **`frontend/tailwind.config.js (or bootstrap setup)`**: Configuration file for styling definitions, custom themes, or CSS framework integrations.

#### App State (`frontend/src/app/`)

- **`store.js`**: Configures and exports the central Redux Toolkit store, combining all feature slices into a unified global state tree.

#### Redux Features (`frontend/src/features/`)

- **`auth/authSlice.js`**: Manages global authentication state, storing user session details, login tokens, and loading/error states.
- **`cart/cartSlice.js`**: Manages shopping cart items, quantities, and subtotal calculations on the client side.
- **`wishlist/wishlistSlice.js`**: Manages saved/bookmarked product items for customer wishlists.
- **`products/productSlice.js`**: Handles asynchronous fetching, filtering, and caching of catalog products for the UI.

#### Components (`frontend/src/components/`)

- **`common/Navbar.jsx`**: Global navigation bar displaying links, search inputs, and dynamic user/cart controls.
- **`common/Footer.jsx`**: Standard bottom footer containing branding, links, and copyright info.
- **`common/ProtectedRoute.jsx`**: Wrapper component that guards specific routes based on authentication status and user roles.
- **`product/ProductCard.jsx`**: Reusable card UI component for rendering individual product previews in catalogs or grids.

#### Pages (`frontend/src/pages/`)

- **`auth/Login.jsx`**: User login form view.
- **`auth/Register.jsx`**: New account registration form view supporting role choices.
- **`customer/Home.jsx`**: Landing page view for customers.
- **`customer/ProductCatalog.jsx`**: Main shopping catalog view with filters and product grids.
- **`customer/ProductDetails.jsx`**: Detailed view for a single product with options to add to cart or wishlist.
- **`customer/Cart.jsx`**: Shopping cart review view.
- **`customer/Checkout.jsx`**: Multi-step checkout view for entering shipping addresses and confirming simulated orders.
- **`seller/SellerDashboard.jsx`**: Central overview portal for vendors.
- **`seller/ManageProducts.jsx`**: Interface for vendors to add, edit, or delete their catalog items.
- **`seller/ManageOrders.jsx`**: Interface for vendors to view customer orders and update shipping statuses.
- **`admin/AdminDashboard.jsx`**: High-level platform monitoring overview for administrators.
- **`admin/ManageUsers.jsx`**: Administrative view for viewing and modifying platform users.
- **`admin/ManageShops.jsx`**: Administrative view for reviewing and verifying vendor shops.

#### Core Services & Entry (`frontend/src/src/`)

- **`services/api.js`**: Configures an Axios instance with base URLs and automatic request/response interceptors for attaching authorization tokens.
- **`App.jsx`**: Root component handling top-level layout structure and client-side routing definitions.
- **`main.jsx`**: Application entry point that mounts the React application and Redux Provider to the DOM.
