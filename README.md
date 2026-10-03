# 👟 KICKLAB — Full-Stack E-Commerce Platform

KICKLAB is a modern full-stack footwear e-commerce platform built with **React, Node.js, Express, and MongoDB**.

The project includes product browsing, authentication, cart management, checkout, order management, admin controls, responsive design, and Cloudinary-powered product image uploads.

## 🚀 Live Demo

**Live Website:**
https://kicklab-rho.vercel.app

**GitHub Repository:**
https://github.com/rohitkarnawal/KICKLAB

---

## ✨ Features

### 🛍️ Shopping Experience

* Browse products dynamically from MongoDB
* Product details page
* Product images hosted on Cloudinary
* Product categories
* Product pricing and discounts
* Size selection
* Add to cart
* Update cart quantity
* Remove items from cart
* Wishlist
* Responsive product slider
* Mobile-friendly shopping experience

### 🔐 Authentication

* User signup
* User login
* Password hashing with bcrypt
* JWT-based authentication
* Login modal
* Logout functionality
* Protected order routes
* Role-based authentication

### 🛒 Cart & Checkout

* Persistent cart using LocalStorage
* Cart quantity management
* Dynamic order total
* Delivery information form
* Guest checkout protection
* Login popup when an unauthenticated user tries to place an order
* Order creation through backend API

### 📦 Order Management

Users can:

* Place orders
* View their orders
* Track order status

Admins can:

* View all orders
* Update order status
* Delete orders

Supported order statuses:

* Pending
* Confirmed
* Shipped
* Delivered
* Cancelled

### 👨‍💼 Admin Dashboard

Admin functionality includes:

* View products
* Add products
* Upload product images
* Edit product information
* Update stock
* Delete products
* View customer orders
* Update order status
* Delete orders

### ☁️ Cloudinary Integration

Product images are uploaded to **Cloudinary** instead of being stored directly on the server.

This allows:

* Cloud-based image storage
* Secure image URLs
* Multiple product image uploads
* Better production deployment support

### 📱 Responsive Design

KICKLAB is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The interface includes responsive navigation, product grids, sliders, cart, checkout, and admin pages.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS
* LocalStorage

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

### Cloud & Deployment

* MongoDB Atlas
* Cloudinary
* Render
* Vercel
* GitHub

---

## 🏗️ Project Architecture

```text
KICKLAB
│
├── Backend
│   ├── config
│   │   └── cloudinary.js
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── upload.js
│   │
│   ├── models
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   │
│   ├── data
│   │   └── products.js
│   │
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend
│   ├── public
│   │   └── media
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.jsx
│   │
│   ├── package.json
│   ├── vercel.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 🔄 Application Flow

```text
React Frontend
      │
      │ Axios API Requests
      ▼
Node.js + Express Backend
      │
      ├──────────────► MongoDB Atlas
      │
      └──────────────► Cloudinary
```

### Authentication Flow

```text
User
 │
 ▼
Login / Signup
 │
 ▼
Backend
 │
 ├── bcrypt password verification
 │
 └── JWT generation
       │
       ▼
   LocalStorage
```

### Order Flow

```text
Product
   ↓
Add to Cart
   ↓
Checkout
   ↓
Authentication Check
   ↓
Shipping Information
   ↓
POST /api/orders
   ↓
MongoDB Atlas
   ↓
Order Created
```

---

## 🔑 Environment Variables

### Backend

Create a `.env` file inside the `Backend` folder:

```env
MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend

Create a `.env` file inside the `Frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

> Never commit `.env` files or API secrets to GitHub.

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/rohitkarnawal/KICKLAB.git
```

```bash
cd KICKLAB
```

### 2. Setup Backend

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create the `.env` file and add your environment variables.

Start the backend:

```bash
node server.js
```

Backend will run locally on:

```text
http://localhost:5000
```

### 3. Setup Frontend

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The frontend will run on the Vite development URL shown in the terminal.

---

## 🌐 Deployment

### Backend

The backend is deployed using **Render**.

Production backend:

```text
https://kicklab-backend.onrender.com
```

### Database

MongoDB is hosted using **MongoDB Atlas**.

### Image Storage

Product images are stored using **Cloudinary**.

### Frontend

The React frontend is deployed using **Vercel**.

Production frontend:

```text
https://kicklab-rho.vercel.app
```

---

## 🔒 Security

The project uses:

* JWT authentication
* Password hashing with bcrypt
* Protected backend routes
* Admin role authorization
* Environment variables for secrets
* MongoDB Atlas
* Cloudinary authentication

Sensitive credentials are excluded from version control using `.gitignore`.

---

## 📸 Screenshots

Add screenshots of the following sections here:

* Home Page
* Products Page
* Product Details
* Cart
* Checkout
* Orders
* Admin Dashboard
* Mobile Responsive View

Example:

```text
screenshots/
├── home.png
├── products.png
├── product-details.png
├── cart.png
├── checkout.png
├── orders.png
└── admin.png
```

---

## 📌 Future Improvements

Possible future improvements include:

* Payment gateway integration
* Product reviews and ratings
* Advanced product filtering
* Search improvements
* Coupon/discount system
* Email order confirmation
* Product pagination
* Order tracking
* Analytics dashboard
* Improved admin management

---

## 👨‍💻 Author

**Rohit Karnawal**

GitHub:
https://github.com/rohitkarnawal

LinkedIn:
https://www.linkedin.com/in/rohitdev3315/

---

## ⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

**Built with React + Node.js + Express + MongoDB**
