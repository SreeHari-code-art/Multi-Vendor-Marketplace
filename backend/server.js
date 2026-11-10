const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const corsOptions = require('./src/config/corsOptions');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const shopRoutes = require('./src/routes/shopRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Health check endpoints
// ==========================================
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'The marketplace server is running correctly',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// API route registration
// ==========================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/shops', shopRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

// ==========================================
// Error handling middleware
// ==========================================
// 1. Catch requests to non-existent routes (404)
app.use(notFound);

// 2. Global application error handler
app.use(errorHandler);

// ==========================================
// MongoDB connection and server startup
// ==========================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: The MONGO_URI/MONGODB_URI environment variable is not defined.');
  process.exit(1);
}

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log(`Connected successfully to MongoDB: ${mongoose.connection.host}`);

    // Start the Express server only after confirming the database connection
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Stop the application if the database is unavailable
  }
};

startServer();