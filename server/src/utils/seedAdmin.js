import User from '../models/User.js';

export const ensureAdminExists = async () => {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'Admin123';

  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    const adminUser = new User({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      isAdmin: true
    });

    await adminUser.save(); 
    console.log('✅ Admin user created');
  } else if (!admin.isAdmin) {
    admin.isAdmin = true;
    await admin.save();
    console.log('✅ Existing user promoted to admin');
  } else {
    console.log('✅ Admin user already exists');
  }
};
