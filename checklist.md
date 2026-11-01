## **Day 01: Project Initialization & Database Design**

### **Milestone 1.1: Repository Setup & Workspace**

- [ ] Initialize the monorepo or separate folders for `backend` and `frontend`
- [ ] Configure environment variables (Ports, MongoDB connection strings, JWT secrets)

### **Milestone 1.2: Database Schema Architecture (MongoDB & Mongoose)**

- [ ] **User Model**: Handle customer, seller, and admin roles
- [ ] **Shop Model**: Store vendor profile information and verification status
- [ ] **Product Model**: Link products to specific shops, including stock, pricing, and categories
- [ ] **Order Model**: Store items, shipping address, and order status (e.g., Pending, Processing, Delivered)

---

## **Day 02: Backend Core & Authentication**

### **Milestone 2.1: Authentication System**

- [ ] Build user registration, and login
- [ ] Implement role-based authorization middleware (Customer vs. Seller vs. Admin)

### **Milestone 2.2: Product & Shop Management APIs**

- [ ] Create CRUD endpoints for vendors to add, update, and delete their products
- [ ] Implement public endpoints for users to search, filter, and view products

---

## **Day 03: Frontend Setup & Customer Core Features**

### **Milestone 3.1: Frontend Core Configuration**

- [ ] Initialize React project
- [ ] Install and configure Tailwind CSS

### **Milestone 3.2: Customer Shopping Flow**

- [ ] Build the homepage
- [ ] Build the product catalog
- [ ] Implement search filtering
- [ ] Build individual product details pages
- [ ] Implement Add-to-Cart functionality
- [ ] Implement Wishlist functionality

---

## **Day 04: Checkout & Order Placement (No Payment Gateway)**

### **Milestone 4.1: Multi-Step Checkout UI**

- [ ] Build shipping address collection step
- [ ] Build order review step

### **Milestone 4.2: Simulated Payment & Order Placement**

- [ ] Create a "Cash on Delivery" or "Simulated Checkout" option instead of Stripe/Razorpay
- [ ] Write the backend order creation logic that decreases product stock
- [ ] Save the order to the database

---

## **Day 05: Seller & Admin Dashboards**

### **Milestone 5.1: Seller Dashboard**

- [ ] Build views for vendors to view incoming orders from customers
- [ ] Implement order status updates (e.g., from Processing to Shipped)
- [ ] Build inventory management features

### **Milestone 5.2: Admin Dashboard**

- [ ] Create an admin panel overview to manage and monitor registered users, shops, and platform-wide orders
