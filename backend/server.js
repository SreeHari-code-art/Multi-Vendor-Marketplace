const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db'); // Assuming you have your DB config here
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();

const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount Authentication Routes
app.use('/api/auth', authRoutes);

// Basic error handler or root route
app.get('/', (req, res) => {
  res.send('E-commerce API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});