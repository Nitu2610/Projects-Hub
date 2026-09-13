# Database Design — TechNest

## 1. Database Overview

TechNest uses **MongoDB** as the database and **Mongoose** as the ODM.

MongoDB stores application data as documents inside collections.

Main collections planned for TechNest:

```text
Users
Products
Categories
Carts
Orders
Reviews
```

---

# 2. Database Design Principles

* MongoDB is used for persistent application data.
* Mongoose is used to define schemas and interact with MongoDB.
* Each major business entity has its own collection.
* MongoDB ObjectIds are used to identify documents.
* Relationships between entities are represented using references where appropriate.
* Important historical information is stored as snapshots when required.
* Business rules are enforced by the backend, not only by the database.

---

# 3. User Collection

The `users` collection stores customer and admin accounts.

### Fields

| Field       | Type     | Purpose                |
| ----------- | -------- | ---------------------- |
| `_id`       | ObjectId | Unique user identifier |
| `fullName`  | String   | User's full name       |
| `email`     | String   | Unique login email     |
| `password`  | String   | Hashed password        |
| `mobile`    | String   | Customer mobile number |
| `role`      | String   | `customer` or `admin`  |
| `createdAt` | Date     | Account creation time  |
| `updatedAt` | Date     | Last update time       |

### Rules

* Email must be unique.
* Password must never be stored as plain text.
* Password is hashed using bcrypt.
* Customer registration always creates a `customer`.
* Admin accounts are created separately.
* Password should not be returned in normal API responses.
* `password` uses `select: false` in the Mongoose schema.

### Relationship

```text
User
 ├── Cart
 ├── Orders
 └── Reviews
```

---

# 4. Product Collection

The `products` collection stores products available in TechNest.

### Fields

| Field             | Type          | Purpose                               |
| ----------------- | ------------- | ------------------------------------- |
| `_id`             | ObjectId      | Product identifier                    |
| `title`           | String        | Product name                          |
| `description`     | String        | Product description                   |
| `price`           | Number        | Original price                        |
| `discountedPrice` | Number        | Selling price after discount          |
| `brand`           | String        | Product brand                         |
| `category`        | ObjectId      | Product category reference            |
| `color`           | String        | Product color                         |
| `specification`   | Object/Object | Technical specifications              |
| `stock`           | Number        | Available quantity                    |
| `active`          | Boolean       | Whether product is available for sale |
| `createdAt`       | Date          | Creation time                         |
| `updatedAt`       | Date          | Last update time                      |

### Product Rules

* Product must belong to a valid category.
* Price must not be negative.
* Stock cannot be negative.
* Inactive products should not be available for normal customer purchase.
* Out-of-stock products cannot be purchased.
* Low-stock products should be clearly identified.
* Product information can be changed by administrators.

---

# 5. Category Collection

The `categories` collection stores the category hierarchy used to organize products.

Each category is stored as an individual document. A category can either be a **top-level (parent) category** or a **child category**.

### Examples

```text
Electronics
├── Mobile Phones
├── Laptops
├── Headphones
└── Smart Watches

Gaming
├── Gaming Consoles
├── Gaming Accessories
└── Gaming Chairs
```

### Fields

| Field            | Type            | Purpose                                                   |
| ---------------- | --------------- | --------------------------------------------------------- |
| `_id`            | ObjectId        | Category identifier                                       |
| `name`           | String          | Category name                                             |
| `normalizedName` | String          | Normalized category name for consistent comparison/search |
| `parent`         | ObjectId | null | Reference to the parent category                          |
| `active`         | Boolean         | Indicates whether the category is active                  |
| `createdAt`      | Date            | Creation time                                             |
| `updatedAt`      | Date            | Last update time                                          |

### Parent Category

A top-level category does not have a parent, so its `parent` field is `null`.

```json
{
  "_id": "100",
  "name": "Electronics",
  "normalizedName": "electronics",
  "parent": null,
  "active": true
}
```

### Child Category

A child category stores the `_id` of its parent category in the `parent` field.

```json
{
  "_id": "200",
  "name": "Mobile Phones",
  "normalizedName": "mobile phones",
  "parent": "100",
  "active": true
}
```

### Relationship

```text
Category
   │
   ├── Parent Category
   │      │
   │      ├── Child Category
   │      ├── Child Category
   │      └── Child Category
   │
   └── Product
```

The category relationship is **self-referencing** because a category can reference another document from the same `categories` collection.

```text
Electronics
_id: 100
parent: null
     ↑
     │
     │ parent
     │
Mobile Phones
_id: 200
parent: 100

Laptops
_id: 300
parent: 100
```

A product stores the category's `ObjectId` rather than duplicating the complete category document.

```text
Category
   ↓
ObjectId
   ↓
Product
```

This design supports a one-to-many relationship where one parent category can have multiple child categories.

It also allows deeper category hierarchies in the future without changing the schema.

```text
Electronics
└── Mobile Phones
    └── Android Phones
        └── Samsung
```
---

# 6. Cart Collection

Each customer has a cart containing products they intend to purchase.

### Structure

```text
Cart
 ├── user
 └── items[]
       ├── product
       └── quantity
```

### Fields

| Field            | Type     | Purpose              |
| ---------------- | -------- | -------------------- |
| `_id`            | ObjectId | Cart identifier      |
| `user`           | ObjectId | Customer reference   |
| `items`          | Array    | Products in the cart |
| `items.product`  | ObjectId | Product reference    |
| `items.quantity` | Number   | Selected quantity    |
| `createdAt`      | Date     | Creation time        |
| `updatedAt`      | Date     | Last update time     |

### Rules

* A cart belongs to one customer.
* A customer can access only their own cart.
* A product should not appear multiple times as separate cart items.
* Quantity must be greater than zero.
* Quantity cannot exceed available stock.
* Inactive products should not be added.
* Cart price should be calculated from current product data when required.

### Important

The cart is **not the order**.

```text
Cart
 ↓
Checkout
 ↓
Order
```

The cart represents the customer's current shopping intention.

The order represents a completed purchase.

---

# 7. Order Collection

The `orders` collection stores completed purchases.

Orders are designed to preserve important information about the purchase at the time it occurred.

### Structure

```text
Order
 ├── user
 ├── items[]
 ├── deliveryAddress
 ├── payment
 ├── totalAmount
 └── status
```

### Main Fields

| Field             | Type          | Purpose              |
| ----------------- | ------------- | -------------------- |
| `_id`             | ObjectId      | Order identifier     |
| `user`            | ObjectId      | Customer reference   |
| `items`           | Array         | Purchased products   |
| `deliveryAddress` | Object/Object | Address snapshot     |
| `payment`         | Object/Object | Payment information  |
| `totalAmount`     | Number        | Final amount paid    |
| `status`          | String        | Current order status |
| `createdAt`       | Date          | Order creation time  |
| `updatedAt`       | Date          | Last update time     |

---

# 8. Order Item Design

Order items should preserve the information relevant to the purchase.

Example:

```json id="4g9c2x"
{
  "productId": "product_object_id",
  "name": "Wireless Headphones",
  "quantity": 2,
  "priceAtPurchase": 2499
}
```

### Why store product information in the order?

Product information can change after an order is placed.

For example:

```text
Today:
Headphones = ₹2,499

Later:
Headphones = ₹2,999
```

The old order must still show:

```text
Purchased price = ₹2,499
```

Therefore, orders store the **price at purchase time** instead of depending only on the current product price.

This is an example of intentionally storing a snapshot of historical data.

---

# 9. Delivery Address Snapshot

The order stores the delivery address used during checkout.

Example:

```json id="c9xv7m"
{
  "fullName": "Nitesh Kumar",
  "mobile": "8668056231",
  "addressLine": "Example Street",
  "city": "Bengaluru",
  "state": "Karnataka",
  "pincode": "560001"
}
```

### Why store a snapshot?

A customer's profile information may change after the order is placed.

The order should continue to contain the address that was used for that particular purchase.

Therefore:

```text
Current User Address
        ≠
Historical Order Address
```

---

# 10. Order Status

Orders follow controlled status transitions.

Planned statuses:

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

Cancellation may be allowed from eligible statuses.

Example:

```text
Pending
  ↓
Cancelled
```

### Rules

* Customers cannot freely change order status.
* Customers cannot cancel an order after the defined cancellation point.
* Admins can perform permitted order-management actions.
* Invalid status transitions must be rejected by the backend.

The exact transition rules will be finalized during order implementation.

---

# 11. Payment Information

TechNest V1 uses simulated payment and Cash on Delivery.

Payment information may contain:

| Field           | Type   | Purpose                         |
| --------------- | ------ | ------------------------------- |
| `method`        | String | Payment method                  |
| `status`        | String | Payment status                  |
| `transactionId` | String | Simulated transaction reference |

Example:

```text
Payment Method:
- COD
- Simulated Online Payment
```

No real payment gateway is required for V1.

Sensitive payment information should never be stored unnecessarily.

---

# 12. Review Collection

The `reviews` collection stores customer reviews for products.

### Fields

| Field       | Type     | Purpose            |
| ----------- | -------- | ------------------ |
| `_id`       | ObjectId | Review identifier  |
| `product`   | ObjectId | Product reference  |
| `user`      | ObjectId | Customer reference |
| `rating`    | Number   | Rating             |
| `comment`   | String   | Review text        |
| `createdAt` | Date     | Creation time      |
| `updatedAt` | Date     | Last update time   |

### Rules

* Only authenticated customers can create reviews.
* Customer must have purchased the product.
* Customer can modify only their own review.
* Rating must be within the allowed range.
* Review text must pass validation.

### Relationship

```text
User
  ↓
Review
  ↓
Product
```

---

# 13. Entity Relationships

High-level relationship:

```text
                 ┌──────────────┐
                 │    User      │
                 └──────┬───────┘
                        │
          ┌─────────────┼──────────────┐
          ↓             ↓              ↓
        Cart          Orders        Reviews
                        │              │
                        ↓              ↓
                    Products ←─────────┘
                        │
                        ↓
                    Category
```

---

# 14. Reference vs Snapshot

TechNest uses both references and snapshots depending on the business requirement.

### Reference

Used when we need the current related entity.

Example:

```text
Product
   ↓
categoryId
   ↓
Category
```

The product references the category.

### Snapshot

Used when historical information must remain unchanged.

Examples:

```text
Order
 ├── priceAtPurchase
 └── deliveryAddress
```

This prevents future changes from altering historical order information.

---

# 15. Data Ownership

Some data belongs specifically to a customer.

Examples:

```text
User
 ↓
Cart
 ↓
Orders
 ↓
Reviews
```

The backend must verify ownership before allowing access.

For example:

```text
Customer A
   ↓
GET /orders/:orderId
   ↓
Does this order belong to Customer A?
   ↓
Yes → Allow
No  → Reject
```

Ownership checks are a security requirement and must not rely only on frontend restrictions.

---

# 16. Stock Management

Product stock is maintained in the `products` collection.

Example:

```text
Product stock = 10
```

Customer purchases:

```text
Quantity = 2
```

After successful purchase:

```text
Stock = 8
```

### Rules

* Stock cannot become negative.
* Requested quantity cannot exceed available stock.
* Stock should be reduced only after successful payment/order confirmation according to the final checkout flow.
* Failed payment should not incorrectly reduce permanent stock.
* Concurrent purchases must be considered during implementation to avoid overselling.

---

# 17. Indexing Considerations

Indexes will be added where they provide meaningful performance benefits.

Potential indexes include:

### Users

```text
email
```

Because email is used for login and must be unique.

### Products

Potential indexes:

```text
category
brand
price
active
```

Search-related indexing will be considered based on the final search implementation.

### Orders

Potential indexes:

```text
user
status
createdAt
```

These can help with customer order history and admin order management.

Indexes should be added based on actual query patterns rather than adding indexes to every field.

---

# 18. Data Validation

Validation happens at multiple levels.

```text
Frontend Validation
        ↓
Backend Request Validation
        ↓
Business Rule Validation
        ↓
Mongoose Schema Validation
        ↓
MongoDB
```

The frontend improves user experience, but backend validation remains mandatory because clients cannot be trusted.

---

# 19. Data Security

The database design follows these security principles:

* Passwords are stored only as hashes.
* Password fields are excluded from normal queries where appropriate.
* JWT secrets are stored in environment variables.
* Database credentials are stored in environment variables.
* Sensitive information is not returned unnecessarily through APIs.
* User ownership is checked before accessing private resources.
* Role-based authorization protects admin data.
* Historical order information is preserved without exposing unnecessary user data.

---

# 20. Current Database Implementation Status

| Collection / Area     | Status        |
| --------------------- | ------------- |
| Users                 | ✅ Implemented |
| Authentication fields | ✅ Implemented |
| Products              | ⏳ Planned     |
| Categories            | ⏳ Planned     |
| Cart                  | ⏳ Planned     |
| Orders                | ⏳ Planned     |
| Reviews               | ⏳ Planned     |
| Payment data          | ⏳ Planned     |
| Index optimization    | ⏳ As required |

---

# 21. Database Design Principles

The TechNest database should follow these principles:

1. Store data according to business requirements.
2. Use references when current related data is required.
3. Use snapshots when historical data must remain unchanged.
4. Keep sensitive data protected.
5. Enforce ownership at the backend.
6. Avoid unnecessary data duplication.
7. Allow intentional duplication when it preserves historical business information.
8. Use indexes based on actual query requirements.
9. Keep database validation and business validation separate.
10. Design collections around real business entities and workflows.
