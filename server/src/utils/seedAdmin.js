import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const ensureAdminExists = async () => {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'Admin123';

  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashed,
      isAdmin: true,
    });
    console.log('✅ Admin user created.');
  } else if (!admin.isAdmin) {
    admin.isAdmin = true;
    await admin.save();
    console.log('✅ Existing user promoted to Admin.');
  } else {
    console.log('✅ Admin user already exists.');
  }
};
