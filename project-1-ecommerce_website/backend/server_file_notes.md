## Backend Server Notes for JSON Server Project

### 1. Required Imports in server.js

```js
const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
```

* `jsonServer`: Creates the JSON server and router.
* `cors`: Middleware to allow cross-origin JS requests.
* `path`: To construct correct file paths regardless of OS.

---

### 2. Creating the server

```js
const server = jsonServer.create();
```

* Creates a new JSON Server instance.

---

### 3. Router for db.json

```js
const router = jsonServer.router(path.join(__dirname, 'db.json'));
```

* `router` reads `db.json`.

* Automatically exposes **CRUD REST APIs** for all keys in db.json.

* Example: db.json key `products` → API endpoints:

  * GET /products
  * GET /products/:id
  * POST /products
  * PUT /products/:id
  * DELETE /products/:id

* Using `path.join(__dirname, 'db.json')` ensures the correct absolute path to db.json.

* `__dirname` is the current folder of server.js.

---

### 4. Default Middlewares

```js
const middlewares = jsonServer.defaults();
server.use(middlewares);
```

* Provides default middlewares (logger, static, CORS, etc.).
* Ensures JSON Server works out of the box.

---

### 5. CORS middleware

```js
server.use(cors());
```

* Ensures browser JS can **read responses from different origins**.
* **Only affects JS fetch/XHR requests**, not `<img>` or `<video>`.
* Adds headers like:

```
Access-Control-Allow-Origin: *
```

* Without it, browser blocks JS from accessing API data due to **same-origin policy**.

---

### 6. Serving Static Images

```js
server.use('/images', jsonServer.defaults({ static: path.join(__dirname, 'images') }));
```

* Tells server: requests starting with `/images` should serve files from `backend/images` folder.
* **Images/videos** are requested separately by the browser; `db.json` only contains the path.
* Example: `db.json` has `"image": "/images/shoes.jpg"`

  * Browser sees `/images/shoes.jpg`
  * Browser adds **origin** automatically if relative (dev server URL, e.g., 5173)
  * Proxy or absolute URL ensures backend receives the request
* CORS is **not involved** for images/videos because browser can render them without JS access.

---

### 7. Connecting router under /api

```js
server.use('/api', router);
```

* Any request starting with `/api` is handled by `router`.
* Exposes CRUD APIs for db.json keys under `/api` path.
* Separates API endpoints from static routes (`/images`).
* Example:

  * GET /api/products → returns all products
  * GET /api/categories → returns all categories

---

### 8. Starting the Server

```js
const PORT = 3050;
server.listen(PORT, () => {
  console.log(`backend is running on port ${PORT}`);
});
```

* Server listens on desired port (3050).
* Console logs confirm server is live.

---

### 9. Frontend & Browser Interaction

1. **Images/Videos**

   * Browser sees `<img src='/images/shoes.jpg'>`
   * Requests go to **frontend dev server (5173)**
   * If proxy is configured (`/images` → 3050), dev server forwards request to backend
   * Backend static middleware serves file
   * Browser renders image
   * **CORS not involved**

2. **API Requests (JS fetch)**

   * Browser JS fetches `/api/products` from backend
   * **Different origin (5173 → 3050)** triggers same-origin policy
   * Backend CORS headers allow JS to read response
   * Without CORS → browser blocks JS access, even though request reached backend

---

### 10. Key Takeaways

* `server.use()` attaches middleware to handle specific routes
* `router` handles CRUD automatically for db.json
* Static middleware serves files from folders (images, videos)
* Frontend dev server proxy helps forward requests from frontend port → backend port in dev
* CORS is **only a browser permission mechanism** for JS to read cross-origin responses
* Images/videos do not require CORS, only API JS calls do
* All URLs in db.json are paths; frontend + proxy + static middleware together make them accessible

---

This summary **covers the server.js, JSON server behavior, images/videos routing, CORS, frontend interaction, and proxy**.
