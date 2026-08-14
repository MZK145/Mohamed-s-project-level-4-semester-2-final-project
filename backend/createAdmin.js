// createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Admin.deleteMany({ email: 'admin@metro.com' });
    const admin = new Admin({ email: 'admin@metro.com', password: 'admin123' });
    await admin.save();
    console.log('✅ Admin created: admin@metro.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();