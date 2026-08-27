# Frontend State Architecture

### State and Query Management
- RTK Query → Server state: products, orders, cart, reviews, profile, categories

- Redux Toolkit → Application/client state: authenticated user, role, etc.

- React local state → Component-specific UI state

### Authentication Architecture
#### Login
  → Backend verifies credentials
  → JWT
  → HTTP-only cookie
  → Browser automatically sends cookie
  → Backend verifies JWT
  → /auth/me provides current user information

> Redux is used by the frontend to know the current authenticated user, but the backend remains responsible for authentication and authorization.


