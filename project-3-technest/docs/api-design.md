# API Design — TechNest

## 1. API Design Overview

TechNest uses a REST-based API to allow the React frontend to communicate with the Express backend.

### Architecture

```text
React Frontend
      ↓
HTTP Request
      ↓
Express REST API
      ↓
Routes
      ↓
Middleware
      ↓
Controller
      ↓
Service
      ↓
Mongoose
      ↓
MongoDB
```

### General API Principles

* APIs follow REST principles.
* Request and response data are exchanged as JSON.
* HTTP methods are used according to the operation.
* Authentication is handled using JWT-based sessions.
* The JWT is stored in an HTTP-only cookie.
* The frontend does not directly access or manage the JWT.
* Backend authorization determines whether a user can perform an operation.
* Input validation is performed before business logic is executed.
* Business logic is handled in the service layer.
* Controllers handle HTTP request/response responsibilities.

---

# 2. API Base Configuration

The frontend uses an environment variable for the backend API URL.

```text
VITE_API_URL
```

The frontend's API layer uses this value as the base URL for requests.

Authentication-related requests use:

```text
credentials: "include"
```

This allows the browser to send the HTTP-only authentication cookie with requests.

---

# 3. HTTP Methods

| Method | Purpose                          |
| ------ | -------------------------------- |
| GET    | Retrieve data                    |
| POST   | Create data or perform an action |
| PUT    | Update existing data             |
| PATCH  | Partially update existing data   |
| DELETE | Delete data                      |

The exact method will be selected based on the operation and business requirement.

---

# 4. Standard Response Structure

Successful API responses generally follow this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

For operations that do not return a data object:

```json
{
  "success": true,
  "message": "Operation completed successfully."
}
```

### Error Response

API errors generally follow:

```json
{
  "success": false,
  "message": "Error message."
}
```

Validation-related errors may contain additional information about the fields that failed validation.

---

# 5. HTTP Status Codes

| Status | Meaning               | Typical Use                                        |
| ------ | --------------------- | -------------------------------------------------- |
| 200    | OK                    | Successful request                                 |
| 201    | Created               | Resource successfully created                      |
| 400    | Bad Request           | Invalid request or validation failure              |
| 401    | Unauthorized          | User is not authenticated                          |
| 403    | Forbidden             | User is authenticated but does not have permission |
| 404    | Not Found             | Resource does not exist                            |
| 409    | Conflict              | Duplicate or conflicting resource                  |
| 500    | Internal Server Error | Unexpected server error                            |

### Authentication vs Authorization

```text
401 → Who are you?
403 → You are authenticated, but are you allowed to do this?
```

---

# 6. Authentication APIs

Authentication APIs are currently implemented.

## 6.1 Customer Registration

### Endpoint

```http
POST /users/register
```

### Access

Public.

Only customers can self-register.

Admin accounts are created separately by seeding the database.

### Request Body

```json
{
  "fullName": "Nitesh",
  "email": "nitesh@gmail.com",
  "password": "password123",
  "mobile": "8668056231"
}
```

### Processing

```text
Request
 ↓
Validation
 ↓
Check existing email
 ↓
Hash password
 ↓
Create customer
 ↓
Return customer information
```

### Important Rules

* Email must be valid.
* Required fields must be provided.
* Email must be unique.
* Password is hashed before storage.
* Customer role is assigned by the backend.
* The client cannot choose the role during registration.
* Password is never returned in the response.

### Success

```http
201 Created
```

Example:

```json
{
  "success": true,
  "message": "Customer registered successfully.",
  "data": {
    "fullName": "Nitesh",
    "email": "nitesh@gmail.com",
    "mobile": "8668056231",
    "role": "customer",
    "_id": "6aa30df4026e72dfcadced4d",
    "createdAt": "2026-09-10T20:07:16.848Z",
    "updatedAt": "2026-09-10T20:07:16.848Z"
  }
}
```

---

## 6.2 Customer Login

### Endpoint

```http
POST /users/login
```

### Access

Public.

### Request Body

```json
{
  "email": "nitesh@gmail.com",
  "password": "password123"
}
```

### Processing

```text
Request
 ↓
Validation
 ↓
Find user
 ↓
Compare password
 ↓
Generate JWT
 ↓
Set HTTP-only cookie
 ↓
Return user information
```

### Important Rules

* Email and password must be validated.
* Password is compared against the hashed password.
* A JWT is generated after successful authentication.
* JWT payload contains only the required identity information.
* JWT is stored in an HTTP-only cookie.
* The frontend does not receive or store the JWT directly.

### Authentication Cookie

```text
accessToken
```

The cookie is configured with security-related options such as:

* `httpOnly`
* `secure` in production
* `sameSite: strict`
* expiration/max-age

---

# 7. Get Current User

### Endpoint

```http
GET /users/me
```

### Access

Authenticated users.

### Processing

```text
Browser
 ↓
HTTP-only accessToken cookie
 ↓
Authentication middleware
 ↓
Verify JWT
 ↓
Identify user
 ↓
Return current user
```

### Purpose

This endpoint allows the frontend to determine whether the current browser session is authenticated.

It is also used when the application starts or refreshes.

### Example Response

```json
{
  "success": true,
  "message": "User fetched successfully.",
  "data": {
    "fullName": "Nitesh",
    "email": "nitesh@gmail.com",
    "mobile": "8668056231",
    "role": "customer",
    "_id": "6aa30df4026e72dfcadced4d"
  }
}
```

---

# 8. Logout

### Endpoint

```http
POST /users/logout
```

### Access

Public endpoint.

Authentication middleware is not required.

### Processing

```text
Logout request
 ↓
Clear accessToken cookie
 ↓
Return success response
```

### Success Response

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

Clearing the cookie is harmless even if the cookie is already missing or expired.

---

# 9. Authorization

TechNest uses role-based authorization.

Current roles:

```text
customer
admin
```

### Example

```text
Authenticated Customer
        ↓
Customer-only endpoint
        ↓
Allowed

Authenticated Admin
        ↓
Customer-only endpoint
        ↓
Forbidden → 403
```

The backend remains the final authority for authorization.

Frontend route protection improves user experience, but it does not replace backend authorization.

---

# 10. Product APIs

Product APIs will provide the product catalog for customers and product management capabilities for administrators.

## Customer APIs

### Get Products

```http
GET /products
```

Purpose:

* Display product listing.
* Support search.
* Support filtering.
* Support sorting.
* Support pagination.

Planned query parameters:

```text
?page=1
&limit=12
&search=iphone
&category=mobile
&brand=apple
&sort=price_asc
```

### Get Product Details

```http
GET /products/:productId
```

Purpose:

* Display complete product information.
* Display availability.
* Display pricing.
* Display specifications.
* Display reviews.

---

## Admin Product APIs

### Create Product

```http
POST /products
```

Access:

```text
Admin only
```

### Update Product

```http
PUT /products/:productId
```

Access:

```text
Admin only
```

### Deactivate Product

```http
PATCH /products/:productId/status
```

Access:

```text
Admin only
```

### Delete Product

```http
DELETE /products/:productId
```

Access:

```text
Admin only
```

The exact product API contract will be finalized when product management is implemented.

---

# 11. Category APIs

Categories will be used to organize electronic products.

### Get Categories

```http
GET /categories
```

Purpose:

* Display available product categories.
* Support product filtering.
* Support category navigation.

Admin category management may be added if required by the final business rules.

---

# 12. Cart APIs

The cart belongs to the authenticated customer.

### Get Cart

```http
GET /cart
```

### Add Product to Cart

```http
POST /cart/items
```

### Update Cart Item

```http
PATCH /cart/items/:productId
```

### Remove Cart Item

```http
DELETE /cart/items/:productId
```

### Clear Cart

```http
DELETE /cart
```

### Cart Rules

* Only authenticated customers can access their cart.
* A customer can only access their own cart.
* Product availability must be checked.
* Stock availability must be checked before adding/updating quantities.
* Inactive products should not be added to the cart.
* Cart operations must not allow quantities greater than available stock.

The final cart behavior will be defined during cart implementation.

---

# 13. Order APIs

Orders represent completed purchases.

## Create Order

```http
POST /orders
```

Access:

```text
Authenticated customer
```

The order creation process will validate:

* Cart contents.
* Product availability.
* Product stock.
* Delivery address.
* Payment method.
* Final payable amount.

The order stores the purchase price at the time of purchase rather than relying on the product's future price.

---

## Get Customer Orders

```http
GET /orders
```

Returns the authenticated customer's orders.

---

## Get Order Details

```http
GET /orders/:orderId
```

Customers can only access their own orders.

---

## Cancel Order

```http
PATCH /orders/:orderId/cancel
```

Cancellation is subject to business rules.

For example:

```text
Pending / eligible status
        ↓
Customer can cancel

Shipped
        ↓
Customer cannot cancel
```

---

# 14. Admin Order APIs

Administrators can manage orders according to the defined business rules.

### Get All Orders

```http
GET /admin/orders
```

### Get Order Details

```http
GET /admin/orders/:orderId
```

### Update Order Status

```http
PATCH /admin/orders/:orderId/status
```

### Admin Cancellation / Override

```http
PATCH /admin/orders/:orderId/cancel
```

Admin operations will include appropriate authorization checks and status-transition rules.

---

# 15. Review APIs

Reviews are associated with purchased products.

### Get Product Reviews

```http
GET /products/:productId/reviews
```

### Create Review

```http
POST /products/:productId/reviews
```

Access:

```text
Authenticated customer
```

### Update Review

```http
PUT /reviews/:reviewId
```

### Delete Review

```http
DELETE /reviews/:reviewId
```

### Review Rules

* Only authenticated customers can create reviews.
* A customer must have purchased the product before reviewing it.
* A customer can only modify their own review.
* Review data must be validated.
* Review ownership must be checked on update/delete.

---

# 16. Admin Dashboard APIs

The admin dashboard will use APIs to retrieve aggregated business information.

### Dashboard Statistics

```http
GET /admin/dashboard/stats
```

Potential information:

* Total products.
* Active products.
* Inactive products.
* Low-stock products.
* Out-of-stock products.
* Total orders.
* Orders by status.
* Sales-related statistics.

The exact statistics will be finalized based on the dashboard requirements.

---

# 17. Authentication and API Security

TechNest API security is based on multiple layers.

```text
Input Validation
       ↓
Authentication
       ↓
Authorization
       ↓
Business Rule Validation
       ↓
Database Operation
```

### Current Security Measures

* Password hashing using bcrypt.
* JWT authentication.
* HTTP-only authentication cookie.
* Role-based authorization.
* Request validation.
* Protected backend routes.
* Ownership checks for user-specific resources.
* Sensitive password fields excluded from responses.
* Environment variables for secrets/configuration.
* Centralized error handling.

### Planned Security Improvements

* Rate limiting for authentication endpoints.
* Login throttling / abuse protection.
* Additional security hardening before public deployment.
* Appropriate production CORS configuration.
* Security monitoring and logging improvements.

---

# 18. Google OpenID Connect

Google Sign-In is planned as an additional authentication method.

```text
Google OIDC
     ↓
Google authenticates user
     ↓
TechNest validates identity
     ↓
Find existing customer
     ↓
Create customer if required
     ↓
TechNest creates its own session
     ↓
HTTP-only accessToken cookie
```

Google authentication will not replace the existing local authentication system.

Both authentication methods should ultimately create the same TechNest application session.

Status:

```text
Planned
```

---

# 19. API Layer Responsibilities

TechNest follows a layered backend architecture.

### Route

Responsible for:

* Defining endpoint.
* Connecting middleware and controller.

### Middleware

Responsible for:

* Authentication.
* Authorization.
* Validation processing.
* Other cross-cutting concerns.

### Controller

Responsible for:

* Receiving request.
* Calling service.
* Returning HTTP response.

### Service

Responsible for:

* Business logic.
* Database interaction.
* Business rule enforcement.

### Model

Responsible for:

* Database schema.
* Mongoose model.
* Data-level constraints.

---

# 20. API Error Handling

Errors are handled centrally by the backend error-handling middleware.

Expected flow:

```text
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Error
 ↓
Central Error Handler
 ↓
HTTP Response
```

This prevents every controller from implementing completely different error responses.

The API should avoid exposing sensitive internal information such as:

* Passwords.
* JWT secrets.
* Database credentials.
* Internal stack traces in production.

---

# 21. API Implementation Status

| API Area                 | Status                          |
| ------------------------ | ------------------------------- |
| Customer Registration    | ✅ Implemented                   |
| Customer Login           | ✅ Implemented                   |
| Current User `/users/me` | ✅ Implemented                   |
| Logout                   | ✅ Implemented                   |
| Role Authorization       | ✅ Implemented                   |
| Product APIs             | ⏳ Planned                       |
| Category APIs            | ⏳ Planned                       |
| Cart APIs                | ⏳ Planned                       |
| Order APIs               | ⏳ Planned                       |
| Review APIs              | ⏳ Planned                       |
| Admin Dashboard APIs     | ⏳ Planned                       |
| Google OIDC              | ⏳ Planned                       |
| Rate Limiting            | 📋 Planned security enhancement |

---

# 22. API Design Principles

The following principles guide API development in TechNest:

1. **Backend is the source of truth.**
2. **Authentication and authorization are separate concerns.**
3. **Business rules must be enforced on the backend.**
4. **The frontend should not be trusted for security decisions.**
5. **API responses should be predictable and consistent.**
6. **Sensitive information should never be unnecessarily exposed.**
7. **Controllers should remain focused on HTTP responsibilities.**
8. **Business logic should remain in services.**
9. **Validation should happen before business processing.**
10. **APIs should be designed with future scalability and maintainability in mind.**
11. **Authentication methods should ultimately produce the same TechNest session model.**
12. **API contracts should be finalized before implementing major features and updated when implementation decisions change.**
