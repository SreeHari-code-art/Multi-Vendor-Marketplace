const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('The MONGO_URI/MONGODB_URI environment variable is not defined.');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Critical error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;