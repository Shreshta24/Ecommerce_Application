# MERN Ecommerce Application

This project is a **simple ecommerce application** built with the **MERN stack** (MongoDB, Express, React, Node). It has **separate dashboards for three roles**:

- **Customer dashboard** – browse products, search/filter, buy items, see orders, manage basic profile.
- **Admin dashboard** – manage transport agents and update order shipping details.
- **Seller dashboard** – manage products (price, images via URL, category, features/description).

The code is deliberately kept clean and beginner-friendly so you can read it and extend it.

---

## 1. Project structure

At the root (your `Ecommerce Application` folder) you have:

- `backend/` – Node/Express API with MongoDB (Mongoose)
- `frontend/` – React (Vite) SPA with role-based dashboards
- `package.json` – helper scripts to run backend/frontend from the root

### 1.1 Backend

Key files/folders:

- `backend/src/server.js`
  - Boots the Express server.
  - Connects to MongoDB.
  - Registers routes:
    - `/api/auth` – authentication
    - `/api/products` – public product listing + seller product management
    - `/api/orders` – customer orders (create + list)
    - `/api/admin` – admin-only management (transport agents, shipping updates)

- `backend/src/config/db.js`
  - Connects to MongoDB using Mongoose.

- `backend/src/models/User.js`
  - User schema with fields: `name`, `email`, `passwordHash`, `role` (`customer`, `admin`, `seller`), and optional address.

- `backend/src/models/Product.js`
  - Product schema with: `name`, `description`, `price`, `category`, `images`, `features`, `stock`, `seller`, `isActive`.
  - Each product belongs to a **seller**.

- `backend/src/models/Order.js`
  - Order schema with:
    - `customer`
    - `items` (product reference, quantity, price at purchase)
    - `totalAmount`
    - `paymentStatus` (`pending`, `paid`, `failed`)
    - `paymentMethod`
    - `deliveryAddress`
    - `status` (`processing`, `shipped`, `delivered`, `cancelled`)
    - `shippingTrackingNumber`, `shippingCarrier`
    - linked `transportAgent`

- `backend/src/models/TransportAgent.js`
  - Stores transport/shipping agents managed by admin.

- `backend/src/middleware/auth.js`
  - `authRequired` – verifies JWT token and adds `req.user`.
  - `requireRole(...roles)` – ensures the caller has the right role (customer, admin, seller).

- `backend/src/routes/authRoutes.js`
  - `POST /api/auth/register` – register as customer/seller/admin.
  - `POST /api/auth/login` – login to get a JWT.

- `backend/src/routes/productRoutes.js`
  - `GET /api/products` – public list with filters:
    - `?search=`, `?category=`, `?minPrice=`, `?maxPrice=`
  - `GET /api/products/mine` – seller’s own products.
  - `POST /api/products` – seller creates product.
  - `PUT /api/products/:id` – seller updates *own* product (price, images, features, etc).

- `backend/src/routes/orderRoutes.js`
  - `POST /api/orders` – **customer creates an order**:
    - Items: product + quantity.
    - Delivery address (location where the product is to be delivered).
    - Payment is simulated as always successful (`paymentStatus = "paid"`).
  - `GET /api/orders/mine` – customer sees their own orders.

- `backend/src/routes/adminRoutes.js`
  - All routes require `admin` role.
  - `GET /api/admin/sellers` – list all sellers.
  - `GET /api/admin/transport-agents` – list agents.
  - `POST /api/admin/transport-agents` – add a new agent.
  - `PUT /api/admin/orders/:id/shipping` – assign transport agent and update shipping status/tracking.
  - `GET /api/admin/orders` – list all orders with customer and agent info.

Authentication uses **JWT** (JSON Web Tokens) stored in the frontend and sent via `Authorization: Bearer <token>` headers.

### 1.2 Frontend

Built with **Vite + React** and **React Router**.

Key files:

- `frontend/src/App.jsx`
  - Defines client routes:
    - `/login` – login/register page (select role).
    - `/customer/*` – customer dashboard + nested routes.
    - `/admin/*` – admin dashboard + nested routes.
    - `/seller/*` – seller dashboard + nested routes.
  - Uses a `ProtectedRoute` component to ensure only logged-in users with the correct role can see each dashboard.

- `frontend/src/auth/AuthContext.jsx`
  - Stores `user` and `token` in React context and in `localStorage`.
  - Provides `login()` and `logout()` helpers.

- `frontend/src/api.js`
  - Small wrapper around `fetch` that:
    - Prefixes all calls with `VITE_API_BASE_URL` (or `http://localhost:5000`).
    - Adds JSON headers and Authorization header when a token is available.

#### Customer dashboard

Under `frontend/src/pages/customer/`:

- `CustomerDashboard.jsx`
  - Layout with sidebar and nested routes:
    - `""` → `HomePage`
    - `"orders"` → `OrdersPage`
    - `"profile"` → `ProfilePage`

- `HomePage.jsx`
  - Shows **homepage with products** fetched from `/api/products`.
  - Allows **search by name**, **filter by category**, and **filter by price range**.
  - Has a **“Buy now”** flow:
    - User selects a product.
    - Fills a **delivery address form** (location for delivery).
    - Simulated **payment and order creation** by POSTing to `/api/orders`.

- `OrdersPage.jsx`
  - Shows **“My orders”** using `/api/orders/mine`.
  - Displays products, status, payment status, and shipping info (tracking number, carrier) which can be updated by admin.

- `ProfilePage.jsx`
  - Displays basic profile data for the logged-in customer.

#### Admin dashboard

Under `frontend/src/pages/admin/`:

- `AdminDashboard.jsx`
  - Sidebar navigation for:
    - Orders
    - Transport agents

- `AdminOrdersPage.jsx`
  - Uses `/api/admin/orders` to view all orders.
  - Has a demo **“Mark as shipped”** button that:
    - Calls `PUT /api/admin/orders/:id/shipping`.
    - Updates status to `shipped`, sets a fake tracking number, and shipping carrier.

- `AdminTransportAgentsPage.jsx`
  - Uses `/api/admin/transport-agents` (GET/POST).
  - Simple form to **add transport agents** (name, phone, company).

#### Seller dashboard

Under `frontend/src/pages/seller/`:

- `SellerDashboard.jsx`
  - Layout and navigation for seller area.
  - Currently includes a **“My products”** page.

- `SellerProductsPage.jsx`
  - Uses `/api/products/mine` to list seller’s products.
  - Form that allows seller to **create products**, specifying:
    - Name
    - Category
    - Price
    - Description
    - Single image URL (stored as array)
  - This satisfies the requirement for seller to manage **price, images, features/description**.

---

## 2. How to run the project

### 2.1 Prerequisites

- **Node.js** (v18+ recommended)
- **npm**
- **MongoDB** running locally, or a cloud URI (e.g. MongoDB Atlas)

### 2.2 Environment variables

Create a file `backend/.env` with at least:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_app
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

You can adjust `MONGO_URI` if you use a remote MongoDB instance.

### 2.3 Install dependencies

From the project root (`Ecommerce Application` folder), run:

```bash
npm run install:all
```

This will:

- `cd backend && npm install`
- `cd frontend && npm install`

You can also install manually:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2.4 Run the backend

From the project root:

```bash
npm run backend
```

Or directly:

```bash
cd backend
npm run dev
```

The API will start on `http://localhost:5000` by default.

### 2.5 Run the frontend

In a second terminal:

```bash
npm run frontend
```

Or directly:

```bash
cd frontend
npm run dev
```

Vite will open your React app (usually at `http://localhost:5173`).

If your backend is on a different URL, set in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 3. How login and dashboards work

1. **Register or login** at `/login`.
   - When you register, choose **Customer**, **Seller**, or **Admin**.
2. On successful login:
   - Customers are redirected to `/customer`.
   - Admins to `/admin`.
   - Sellers to `/seller`.
3. The frontend stores:
   - The JWT token.
   - Basic user info (id, name, email, role).
4. For protected pages, a **ProtectedRoute**:
   - Checks if a user is logged in.
   - Verifies they have the correct **role** for that dashboard.
   - Redirects to the correct dashboard or `/login` if unauthorized.

---

## 4. Where to modify / extend

- **Add more customer pages** (e.g. wishlist, address book) under:
  - `frontend/src/pages/customer/`
- **Add more admin capabilities** (e.g. deactivate sellers, manage products globally) under:
  - `backend/src/routes/adminRoutes.js`
  - `frontend/src/pages/admin/`
- **Enhance seller tools** (e.g. edit/delete products, see sales) under:
  - `backend/src/routes/productRoutes.js`
  - `frontend/src/pages/seller/`
- **Real payments**:
  - Replace the simulated payment in `orderRoutes.js` and `CustomerHomePage.jsx` with integration to Stripe/PayPal/etc.

Use the existing routes and components as a starting point to extend the application.

---

## 5. Summary of what has been implemented

- **Backend**
  - Node/Express server with MongoDB (Mongoose).
  - JWT-based authentication with roles: customer, admin, seller.
  - Models for users, products, orders, transport agents.
  - Routes for:
    - Auth (`/api/auth`)
    - Products (`/api/products`)
    - Customer orders (`/api/orders`)
    - Admin management (`/api/admin`)

- **Frontend**
  - React SPA with Vite.
  - Global auth context storing user and token.
  - **Customer dashboard**:
    - Homepage with products, search, category & price filters.
    - Buy item flow with payment simulation and delivery location.
    - My orders page.
    - Basic profile page.
  - **Admin dashboard**:
    - View and update order shipping (assign tracking, mark shipped).
    - Manage transport agents.
  - **Seller dashboard**:
    - Manage own products (create with price, images, description, category).

You can now run the app, explore the dashboards for each role, and extend it as you learn more.

