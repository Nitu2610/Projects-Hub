# TechNest — Full-Stack E-commerce & Order Management Platform

TechNest is a full-stack e-commerce and order management platform built with the MERN stack and TypeScript.

The application provides separate customer and administrator workflows for product browsing, cart management, checkout, order processing, reviews, product/category management, and order administration.

The project was designed with a layered backend architecture, role-based access control, business-rule validation, REST APIs, and a production-oriented deployment setup.

---

## 🚀 Live Demo

**Frontend:** https://technest-nitesh.vercel.app

**Backend API:** https://projects-hub-production-bb41.up.railway.app

**GitHub:** https://github.com/Nitu2610/Projects-Hub/tree/main/project-3-technest

---

## 📌 Key Features

### Customer

- User authentication and authorization
- Browse products and hierarchical categories
- Product details and product images
- Shopping cart management
- Address management
- Checkout and order creation
- Multiple payment methods
- Order history and order details
- Order cancellation with cancellation reasons
- Product reviews
- Responsive UI with theme support

### Admin

- Admin authentication with role-based access control
- Dashboard with business KPIs
- Product management
- Category management
- Order management
- Customer management
- Review management
- Order status updates
- Admin order cancellation
- Inventory monitoring
- Sales overview and recent orders

---

## 🏗️ Architecture

The backend follows a layered architecture to separate responsibilities and make the application easier to maintain and extend.

```text
Client
  ↓
React / Redux Toolkit / RTK Query
  ↓
REST API
  ↓
Express Routes
  ↓
Authentication & Authorization Middleware
  ↓
Validation Middleware
  ↓
Controllers
  ↓
Services
  ↓
Mongoose Models
  ↓
MongoDB
```

### Backend Request Flow

```text
Route
  ↓
Middleware
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Mongoose
  ↓
MongoDB
```

Business logic is kept primarily within the service layer rather than being tightly coupled to controllers or routes.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- RTK Query
- React Router
- Chakra UI
- Cloudinary

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- HTTP-only Cookies
- Express Validator
- bcrypt

### Deployment

- Vercel — Frontend
- Railway — Backend
- MongoDB Atlas — Database
- Cloudinary — Product Images

---

## 🔐 Authentication & Authorization

TechNest uses JWT-based authentication with HTTP-only cookies.

Authentication flow:

```text
User Login
    ↓
Credentials Validation
    ↓
JWT Generation
    ↓
HTTP-only Cookie
    ↓
Authenticated Requests
    ↓
Authentication Middleware
    ↓
User Identity
    ↓
Role-based Authorization
```

The application supports separate roles:

- Customer
- Admin
- Guest

Protected routes use authentication and authorization middleware to ensure users can access only the resources permitted for their role.

---

## 📦 Order Management

The order workflow includes:

```text
Cart
 ↓
Address Selection
 ↓
Checkout
 ↓
Payment Processing
 ↓
Order Creation
 ↓
Stock Update
 ↓
Order Management
```

Order statuses:

```text
PLACED
   ↓
CONFIRMED
   ↓
SHIPPED
   ↓
DELIVERED
```

Cancellation is available only at permitted stages.

```text
PLACED ───────→ CANCELLED
   ↓
CONFIRMED ────→ CANCELLED
```

Once an order is shipped or delivered, cancellation is no longer permitted.

---

## 📋 Business Rules

The application implements backend business rules instead of relying only on frontend validation.

Examples include:

- Product stock must be available before an order is created.
- Product prices are validated on the backend during checkout.
- An address must belong to the authenticated customer.
- Customers can maintain a maximum of three addresses.
- Shipping fees are calculated based on order subtotal.
- Order cancellation is restricted based on order status.
- Cancelled order quantities are restored to product inventory.
- Order items store product and price snapshots so historical orders are not dependent on future product changes.
- Reviews are restricted according to the application's order/review eligibility rules.
- Admin operations require admin authorization.

---

## 🛒 Cart & Checkout

The checkout process validates important conditions on the backend before creating an order.

```text
Validate Cart
     ↓
Validate Address
     ↓
Validate Products
     ↓
Validate Stock
     ↓
Calculate Current Prices
     ↓
Calculate Subtotal
     ↓
Calculate Shipping
     ↓
Process Payment
     ↓
Create Order
     ↓
Update Inventory
     ↓
Clear Cart
```

This prevents the client from being the sole source of truth for important transactional data.

---

## 📊 Admin Dashboard

The admin dashboard provides operational insights including:

- Total revenue
- Total orders
- Total customers
- Average order value
- Order status statistics
- Sales overview
- Inventory statistics
- Recent orders

The dashboard data is generated through backend APIs rather than being calculated solely from frontend state.

---

## 🗂️ Project Structure

### Frontend

```text
src/
├── components/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── admin/
│   └── reviews/
├── pages/
├── routes/
├── redux/
├── types/
├── theme/
└── main.tsx
```

### Backend

```text
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── validators/
├── types/
├── utils/
└── app.ts
```

---

## 🔌 API Design

The backend exposes RESTful APIs organized around application resources.

Examples:

```text
POST   /users/login
POST   /users/logout

GET    /products
GET    /products/:productId

GET    /cart
POST   /cart
PATCH  /cart/:productId
DELETE /cart/:productId

GET    /orders
POST   /orders/create-order
GET    /orders/:orderId
PATCH  /orders/:orderId/cancel

GET    /admin/orders
GET    /admin/orders/:orderId
PATCH  /admin/orders/:orderId/status
PATCH  /admin/orders/:orderId/cancel
```

Validation and authorization are applied according to the requirements of each endpoint.

---

## 🧪 Validation & Error Handling

The application uses backend validation to handle invalid requests before they reach business logic.

Examples include:

- Invalid MongoDB IDs
- Missing required fields
- Invalid enum values
- Invalid order status transitions
- Insufficient stock
- Unauthorized access
- Invalid ownership of resources
- Invalid cancellation reasons

The API follows HTTP status codes to communicate common outcomes such as:

```text
200 — Successful request
201 — Resource created
400 — Invalid request / business rule violation
401 — Authentication required
403 — Insufficient permissions
404 — Resource not found
```

---

## 🧠 Engineering Decisions

Some important design decisions made during development:

### Layered Backend Architecture

Instead of putting business logic directly inside route handlers, the application separates:

```text
Routes
Controllers
Services
Models
```

This makes business logic easier to test, debug, and modify.

### Backend Business Validation

Important rules are enforced on the server because frontend validation alone cannot be trusted.

### HTTP-only Authentication Cookies

JWTs are stored in HTTP-only cookies rather than being directly accessible from JavaScript.

### Separate Customer & Admin Workflows

Customer and administrator operations use separate API routes and authorization rules.

For example:

```text
/orders
/admin/orders
```

This keeps the authorization boundaries explicit.

---

## 🚧 Challenges & Problem Solving

During development, several real-world issues required debugging across the frontend, backend, and database layers.

Examples included:

- Handling authentication state across protected routes
- Designing order status transitions
- Preventing invalid order cancellations
- Maintaining inventory consistency during order cancellation
- Debugging API validation errors
- Handling MongoDB/Mongoose validation issues
- Managing customer and admin authorization separately
- Synchronizing frontend state with backend mutations
- Debugging deployed frontend/backend communication
- Designing business rules before implementing related features

The focus was not only on making individual features work, but also on understanding why failures occurred and correcting the underlying architecture or business logic.

---

## ⚙️ Local Development

### Prerequisites

- Node.js
- MongoDB or MongoDB Atlas
- npm

### Clone the repository

```bash
git clone https://github.com/Nitu2610/Projects-Hub
cd project-3-technest
```

### Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

### Environment Variables

Backend example:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Frontend example:

```env
VITE_API_URL=http://localhost:8080
```

Use your actual environment variable names from the project when configuring the deployed application.

### Run the application

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

---

## 📈 Future Improvements

Potential future enhancements include:

- Online payment gateway integration
- Wishlist functionality
- Advanced product search
- Product filtering and sorting
- Pagination improvements
- Automated testing with Jest/Playwright
- Email notifications
- More advanced analytics
- CI/CD improvements

---

## 👨‍💻 Developer

**Nitesh Kumar**

MERN Stack Developer | Full-Stack Developer

The project was developed with a focus on understanding the complete development lifecycle:

```text
Requirements
    ↓
Business Rules
    ↓
Architecture
    ↓
Database Design
    ↓
API Design
    ↓
Implementation
    ↓
Validation
    ↓
Testing & Debugging
    ↓
Deployment
    ↓
Documentation
```

TechNest was built as a hands-on full-stack project to demonstrate practical experience in designing, developing, debugging, and deploying a MERN-based application.