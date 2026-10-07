# 🛒 Full Stack E-Commerce Application

A frontend-focused e-commerce application built using React, Redux, Chakra UI, and json-server to simulate backend APIs.

This project demonstrates real-world frontend architecture, API handling, authentication flow, and state management using mock REST APIs.

---
### 🚀 Live Demo

Frontend: https://nitesh01.netlify.app/signup
Backend API: https://project-1-ecommerce-website-backend.onrender.com/api/products

--- 

### 🧩 Features
- 👤 Authentication
- User signup and login (json-server based)
- Redux-managed authentication state
- Auto redirect after login/signup

### 📦 Address Management
- Add, fetch, and manage delivery addresses
- Maximum of 3 addresses per user
- Conditional UI rendering based on address count
- Cancel option while adding address

### 🛍️ Checkout Flow
- Payment method selection
- Default payment method handling
- Global checkout state using Redux

### ⚙️ API & Networking
- REST-like API using json-server
- Axios for API communication
- CORS configured on backend
- Environment-based API URLs
---

### 🏗️ Tech Stack
#### Frontend
- React
- Redux & Redux Thunk
- Chakra UI
- Axios
- React Router DOM

#### Backend
- Node.js
- json-server
- CORS
--- 
### 📁 Project Structure
```js 

├── frontend
│   ├── components
│   ├── pages
│   ├── redux
│   │   ├── actions
│   │   ├── reducers
│   │   └── store.js
│   ├── api
│   │   └── api.js
│   └── App.js
│
├── backend
│   ├── images
│   ├── db.json
│   └── server.js

```
--- 

### 🔧 Setup Instructions
#### 1️⃣ Clone the repository
```js
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
--- 

#### 2️⃣ Start json-server
```js
npm install -g json-server
json-server --watch db.json --port 5000
```
Mock API will be available at:
`http://localhost:3050 `

---
 #### 3️⃣ Start the Frontend
```js 
npm install
npm start
```
Frontend runs on:
`http://localhost:5173`

--- 

### 🗃️ Sample API Endpoints (json-server)
```js 
GET    /users
POST   /users
GET    /addresses
POST   /addresses
GET    /products
```

--- 

### 🌱 Future Enhancements
- Replace json-server with Node.js & Express backend
- Add image uploads
- Role-based access (Admin/User)
- Payment gateway integration
- Pagination & filters
--- 
### 📌 Learning Outcomes
- Built a scalable React application
- Hands-on Redux state management
- API integration using Axios
- Real-world conditional UI logic
- Experience with mock REST APIs
---

### 👨‍💻 Author

Nitesh Kumar
Frontend / Aspiring Full Stack Developer

- GitHub: https://github.com/Nitu2610/Projects-Hub/tree/main/project-1-ecommerce_website

--- 

### ⭐ Feedback

If you find this project useful, feel free to star the repository ⭐
