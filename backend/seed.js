const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('The MONGO_URI/MONGODB_URI environment variable is not defined.');
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully for the seeding process...');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  try {
    // 1. Clear all existing collections to avoid duplicates
    await Order.deleteMany();
    await Product.deleteMany();
    await Shop.deleteMany();
    await User.deleteMany();

    console.log('Database cleaned successfully.');

    // 2. Create test users (admin, customer and sellers)
    // Note: Passwords are automatically encrypted through the User model pre-save hook
    const adminUser = await User.create({
      name: 'General Administrator',
      email: 'admin@marketplace.com',
      password: 'Password123!',
      role: 'admin',
    });


    // 3. Create stores for sellers (status: approved to publish products immediately)
   

    // Link created stores to seller user documents
    
    // 4. Create initial products for each store
   

    console.log('Sample data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

importData();