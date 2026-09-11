# Business Rules — TechNest

## 1. Purpose

This document defines the business rules that control how TechNest should behave.

Business rules describe:

* What customers can do.
* What administrators can do.
* What the system should allow.
* What the system should prevent.
* How products, carts, orders, payments, and reviews behave.

These rules should be enforced primarily by the backend.

---

# 2. User Roles

TechNest has two roles:

```text
customer
admin
```

## Customer

Customers can:

* Register an account.
* Login.
* Browse products.
* Search and filter products.
* View product details.
* Add products to cart.
* Manage their cart.
* Checkout.
* Place orders.
* View their orders.
* Track order status.
* Cancel orders when allowed.
* Manage their profile.
* Review products they have purchased.

## Admin

Admins can:

* Manage products.
* Manage product availability.
* View orders.
* Manage order status.
* Perform permitted order overrides.
* View dashboard statistics.

Admin accounts are created separately and are not available through public customer registration.

---

# 3. Registration Rules

Only customers can register through the public registration API.

### Rules

* Full name is required.
* Email is required.
* Email must be valid.
* Email must be unique.
* Password is required.
* Mobile number is required.
* Password must be hashed before storage.
* The client cannot select the role.
* Newly registered users are always assigned the `customer` role.
* Password must never be returned in API responses.

---

# 4. Login Rules

A user can login using valid credentials.

### Rules

* Email must exist.
* Password must match the stored password hash.
* Invalid credentials must not reveal whether the email or password was incorrect.
* Successful authentication creates a TechNest session.
* The JWT is stored in an HTTP-only cookie.
* The frontend must not directly manage the JWT.

---

# 5. Authentication Rules

Authentication answers:

```text
"Is this user logged in?"
```

The backend is the source of truth for authentication.

The `/users/me` endpoint is used to determine the current authenticated user.

### Rules

* Missing/invalid authentication results in `401 Unauthorized`.
* Expired or invalid JWTs must not be accepted.
* The frontend may redirect unauthenticated users to the login page.
* Frontend authentication state must not be treated as the security boundary.

---

# 6. Authorization Rules

Authorization answers:

```text
"Is this authenticated user allowed to perform this action?"
```

### Rules

* Customers cannot access admin-only functionality.
* Admins can access authorized administrative functionality.
* Authentication must happen before protected authorization checks.
* Unauthorized access results in `403 Forbidden`.
* Backend authorization is mandatory even if the frontend hides the functionality.

---

# 7. Product Rules

TechNest focuses on electronics and gadgets.

Each product contains information such as:

* Name/title.
* Description.
* Price.
* Discounted price.
* Brand.
* Category.
* Color.
* Specifications.
* Stock.
* Active/inactive status.

### Rules

* Product price cannot be negative.
* Discounted price cannot be invalid.
* Stock cannot be negative.
* Products must belong to a valid category.
* Inactive products should not be available for normal customer purchase.
* Out-of-stock products cannot be purchased.
* Product availability must be checked again during checkout.
* Admins are responsible for product management.

---

# 8. Product Availability

Products can have different availability conditions.

```text
Active + Stock Available
        ↓
Available for purchase

Active + Low Stock
        ↓
Available but low-stock warning shown

Active + Out of Stock
        ↓
Cannot purchase

Inactive
        ↓
Not available for normal purchase
```

Low-stock threshold:

```text
Stock < 5
```

The exact customer-facing UI can communicate low-stock status without exposing unnecessary internal information.

---

# 9. Product Pricing Rules

Products can have:

```text
Original Price
Discounted Price
```

The displayed selling price should be determined consistently by the backend/product model.

### Important Rule

Once an order is placed, the product's current price must not change the historical order amount.

Therefore, orders store:

```text
priceAtPurchase
```

---

# 10. Cart Rules

Each customer has their own cart.

### Rules

* A customer can only access their own cart.
* Only authenticated customers can manage a cart.
* A product can appear only once in the cart.
* Quantity must be greater than zero.
* Quantity cannot exceed available stock.
* Inactive products cannot be added.
* Out-of-stock products cannot be added.
* Cart operations must validate current product availability.
* Removing an item must not affect the product itself.

### Important

A cart represents the customer's current shopping intention.

It does not guarantee that the stock will remain reserved indefinitely.

---

# 11. Checkout Rules

Checkout converts the customer's cart into an order.

Before creating an order, the backend must verify:

* Customer authentication.
* Cart existence.
* Cart items.
* Product existence.
* Product active status.
* Current stock.
* Requested quantities.
* Delivery address.
* Payment method.
* Final payable amount.

The backend must not blindly trust totals calculated by the frontend.

---

# 12. Payment Rules

TechNest V1 uses:

```text
Cash on Delivery
Simulated Online Payment
```

No real payment gateway is required for V1.

### Rules

* Payment method must be valid.
* Simulated payment must produce a successful or failed result.
* An order should only be treated as successfully paid when the payment process succeeds.
* Stock should be permanently reduced only after successful payment/order confirmation according to the final checkout flow.
* Failed payments must not incorrectly create a completed purchase.

---

# 13. Order Creation Rules

An order is created only after successful checkout validation.

An order must preserve:

* Customer.
* Purchased products.
* Quantity.
* Price at purchase.
* Total amount.
* Delivery address.
* Payment information.
* Order status.

### Historical Data Rule

Order information should remain historically accurate even if the product or customer changes later.

For example:

```text
Product price today:
₹2,999

Customer purchased:
₹2,499

Future product price:
₹3,499
```

The order must continue to show:

```text
₹2,499
```

---

# 14. Delivery Address Rules

The delivery address used for an order is stored as a snapshot.

### Reason

A customer's profile/address may change after placing an order.

The historical order must continue to contain the address used during that purchase.

---

# 15. Order Status Rules

Orders follow controlled status transitions.

Initial planned flow:

```text
Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Shipped
   ↓
Delivered
```

Cancellation may occur only from eligible states.

### Rules

* Customers cannot arbitrarily change order status.
* Customers cannot cancel an order after the defined cancellation point.
* Admins can perform permitted order-management actions.
* Invalid status transitions must be rejected.
* Once an order reaches a final state, inappropriate reverse transitions must not be allowed.

---

# 16. Order Cancellation Rules

Customer cancellation depends on the current order status.

Example:

```text
Pending
   ↓
Customer cancellation allowed

Confirmed
   ↓
Depends on final business rule

Processing
   ↓
Depends on final business rule

Shipped
   ↓
Customer cancellation not allowed

Delivered
   ↓
Cancellation not allowed
```

The exact cancellation matrix will be finalized when order management is implemented.

---

# 17. Stock Rules

Stock represents the currently available quantity.

Example:

```text
Initial stock = 10
Purchased quantity = 3
Remaining stock = 7
```

### Rules

* Stock cannot become negative.
* Customer cannot purchase more than available stock.
* Stock should be updated only through controlled backend operations.
* Failed checkout/payment must not incorrectly reduce stock.
* Concurrent purchases must be handled carefully to prevent overselling.

---

# 18. Order Price and Stock Independence

Once an order is created:

```text
Order
 ├── priceAtPurchase
 └── quantity
```

should represent the transaction that occurred.

Future changes to:

* Product price.
* Product stock.
* Product description.
* Product availability.

must not change the historical purchase information.

---

# 19. Review Rules

Customers can review products they have purchased.

### Rules

* Customer must be authenticated.
* Customer must have purchased the product.
* Customer cannot review a product they have never purchased.
* Customer can modify only their own review.
* Customer can delete only their own review.
* Rating must be within the allowed range.
* Review text must pass validation.

---

# 20. Ownership Rules

Customer-specific resources must belong to the authenticated customer.

Examples:

```text
Cart
Orders
Reviews
Profile
```

### Example

```text
Customer A
   ↓
Request Order #123
   ↓
Does Order #123 belong to Customer A?
   ↓
Yes → Allow
No  → Reject
```

The backend must perform ownership checks.

---

# 21. Admin Product Rules

Admins can manage products.

Admin capabilities include:

* Create product.
* Update product.
* Change availability.
* Deactivate product.
* Delete product where appropriate.
* Manage stock.

Customer users must not be able to perform these operations.

---

# 22. Admin Order Rules

Admins can manage orders according to defined business rules.

Admin capabilities may include:

* View all orders.
* View order details.
* Update permitted order statuses.
* Cancel orders where permitted.
* Handle administrative overrides for exchange/refund workflows.

Admin actions must still follow business rules and valid status transitions.

---

# 23. Search, Filter and Sort Rules

Product browsing should support:

* Keyword search.
* Category filtering.
* Brand filtering.
* Price-based filtering.
* Sorting.
* Pagination.

The backend should perform these operations so that the client does not need to load the entire product catalog.

---

# 24. Pagination Rules

Large datasets should be returned using pagination.

Example:

```text
page = 1
limit = 12
```

The API should return only the requested portion of the dataset.

Pagination will primarily be used for:

* Products.
* Orders.
* Reviews where required.
* Admin lists.

---

# 25. Error and Validation Rules

Invalid requests must not reach business logic unnecessarily.

Validation should happen before processing.

Examples:

```text
Missing required field
Invalid email
Invalid product ID
Invalid quantity
Invalid order status
Insufficient stock
Unauthorized access
Forbidden operation
```

The API should return an appropriate HTTP status and clear message.

---

# 26. Security Rules

Security is part of the business and technical design.

TechNest should:

* Never store plain-text passwords.
* Use HTTP-only cookies for authentication.
* Validate incoming data.
* Enforce backend authorization.
* Check resource ownership.
* Avoid exposing sensitive information.
* Protect admin functionality.
* Keep secrets in environment variables.
* Consider rate limiting for sensitive endpoints.
* Avoid trusting client-calculated prices or permissions.

---

# 27. V1 vs V2 Rules

### V1

Core functionality:

* Customer authentication.
* Admin authentication.
* Product catalog.
* Search/filter/sort.
* Cart.
* Checkout.
* Simulated payment.
* COD.
* Orders.
* Order tracking.
* Reviews.
* Admin product management.
* Admin order management.
* Dashboard.

### V2

Potential enhancements:

* Wishlist.
* More advanced payment integration.
* Advanced order/refund workflows.
* Additional customer features.
* More advanced analytics.
* Additional authentication providers.

---

# 28. Business Rule Principles

The following principles should guide future development:

1. **Backend is the final authority for business rules.**
2. **Frontend validation improves UX but cannot provide security.**
3. **Customers can access only their own customer data.**
4. **Admins have additional privileges but must still follow business rules.**
5. **Historical order information must remain accurate.**
6. **Stock must never become negative.**
7. **Prices must be captured at purchase time.**
8. **Order status changes must follow controlled transitions.**
9. **A customer can review only products they purchased.**
10. **Business rules should be explicit rather than hidden inside UI code.**
11. **Security and business validation should be enforced server-side.**
12. **New features should add or update business rules before implementation begins.**
