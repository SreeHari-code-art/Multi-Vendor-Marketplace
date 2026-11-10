## **Day 01: Project Initialization & Database Design**

### **Milestone 1.1: Repository Setup & Workspace**

- [x] Initialize the monorepo or separate folders for `backend` and `frontend`
- [x] Configure environment variables (Ports, MongoDB connection strings, JWT secrets)

### **Milestone 1.2: Database Schema Architecture (MongoDB & Mongoose)**

- [x] **User Model**: Handle customer, seller, and admin roles
- [x] **Shop Model**: Store vendor profile information and verification status
- [x] **Product Model**: Link products to specific shops, including stock, pricing, and categories
- [x] **Order Model**: Store items, shipping address, and order status (e.g., Pending, Processing, Delivered)

---

## **Day 02: Backend Core & Authentication**

### **Milestone 2.1: Authentication System**

- [x] Build user registration, and login
- [x] Implement role-based authorization middleware (Customer vs. Seller vs. Admin)

### **Milestone 2.2: Product & Shop Management APIs**

- [x] Create CRUD endpoints for vendors to add, update, and delete their products
- [x] Implement public endpoints for users to search, filter, and view products

---

## **Day 03: Frontend Setup & Customer Core Features**

### **Milestone 3.1: Frontend Core Configuration**

- [x] Initialize React project
- [x] Install and configure Tailwind CSS

### **Milestone 3.2: Customer Shopping Flow**

- [x] Build the homepage
- [x] Build the product catalog
- [x] Implement search filtering
- [x] Build individual product details pages
- [x] Implement Add-to-Cart functionality
- [x] Implement Wishlist functionality

---

## **Day 04: Checkout & Order Placement (No Payment Gateway)**

### **Milestone 4.1: Multi-Step Checkout UI**

- [x] Build shipping address collection step
- [x] Build order review step

### **Milestone 4.2: Simulated Payment & Order Placement**

- [x] Create a "Cash on Delivery" or "Simulated Checkout" option instead of Stripe/Razorpay
- [x] Write the backend order creation logic that decreases product stock
- [x] Save the order to the database

---

## **Day 05: Seller & Admin Dashboards**

### **Milestone 5.1: Seller Dashboard**

- [x] Build views for vendors to view incoming orders from customers
- [x] Implement order status updates (e.g., from Processing to Shipped)
- [x] Build inventory management features

### **Milestone 5.2: Admin Dashboard**

- [x] Create an admin panel overview to manage and monitor registered users, shops, and platform-wide orders
