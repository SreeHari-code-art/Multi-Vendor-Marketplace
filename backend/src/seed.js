// Usage: npm run seed  — creates an admin, a demo customer, 3 verified shops and 12 products.
// Safe to re-run: existing users/shops/products are left untouched.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Shop = require('./models/Shop');
const Product = require('./models/Product');

const findOrCreateUser = async (data) => (await User.findOne({ email: data.email })) || User.create(data);

const sellers = [
  {
    user: { name: 'Tech Haven Owner', email: 'techhaven@example.com', password: 'Seller@123', role: 'seller' },
    shop: { shopName: 'Tech Haven', description: 'Gadgets and accessories for everyday use.' },
    products: [
      ['Wireless Earbuds', 2499, 40, 'Electronics', 'Bluetooth 5.3 earbuds with 24h battery life.'],
      ['Mechanical Keyboard', 3999, 25, 'Electronics', 'Hot-swappable switches, RGB backlight.'],
      ['USB-C Hub 7-in-1', 1499, 60, 'Electronics', 'HDMI, USB 3.0, SD card reader and PD charging.'],
      ['Smart Watch', 5999, 15, 'Electronics', 'Heart-rate, sleep tracking and 7-day battery.'],
    ],
  },
  {
    user: { name: 'Urban Threads Owner', email: 'urbanthreads@example.com', password: 'Seller@123', role: 'seller' },
    shop: { shopName: 'Urban Threads', description: 'Everyday fashion basics.' },
    products: [
      ['Cotton T-Shirt', 599, 100, 'Fashion', '100% organic cotton, regular fit.'],
      ['Denim Jacket', 2499, 20, 'Fashion', 'Classic mid-wash denim jacket.'],
      ['Canvas Sneakers', 1799, 35, 'Fashion', 'Lightweight sneakers with cushioned insole.'],
      ['Leather Wallet', 899, 50, 'Fashion', 'Slim bifold wallet with RFID protection.'],
    ],
  },
  {
    user: { name: 'Home Nest Owner', email: 'homenest@example.com', password: 'Seller@123', role: 'seller' },
    shop: { shopName: 'Home Nest', description: 'Cozy touches for your home.' },
    products: [
      ['Ceramic Mug Set (4)', 699, 45, 'Home', 'Hand-glazed 300ml mugs.'],
      ['Scented Candle', 399, 80, 'Home', 'Soy wax candle, 40h burn time.'],
      ['LED Desk Lamp', 1299, 30, 'Home', 'Dimmable, 3 colour modes, USB powered.'],
      ['Throw Blanket', 1099, 5, 'Home', 'Soft knitted blanket, 130x170cm.'],
    ],
  },
];

(async () => {
  await connectDB();

  await findOrCreateUser({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
  });
  await findOrCreateUser({ name: 'Demo Customer', email: 'customer@example.com', password: 'Customer@123' });

  for (const s of sellers) {
    const owner = await findOrCreateUser(s.user);
    const shop = (await Shop.findOne({ ownerId: owner._id })) || (await Shop.create({ ownerId: owner._id, ...s.shop, isVerified: true }));
    if (!(await Product.countDocuments({ shopId: shop._id }))) {
      await Product.insertMany(
        s.products.map(([title, price, stock, category, description]) => ({
          shopId: shop._id,
          title,
          price,
          stock,
          category,
          description,
          image: `https://picsum.photos/seed/${encodeURIComponent(title)}/600/450`,
        }))
      );
    }
  }

  console.log('Seed complete.');
  console.log(`  Admin:    ${process.env.ADMIN_EMAIL || 'admin@example.com'} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  console.log('  Seller:   techhaven@example.com / Seller@123  (also urbanthreads@, homenest@)');
  console.log('  Customer: customer@example.com / Customer@123');
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
