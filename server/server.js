import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/dataBase.js';
import taskRoutes from './src/routes/tasks.js';
import authRoutes from './src/routes/auth.js';
import adminRoutes from './src/routes/admin.js';
import { ensureAdminExists } from './src/utils/seedAdmin.js'; // ✅ Correct path

dotenv.config();

const app = express();

// ✅ Start server after DB + admin user check
const startServer = async () => {
  try {
    await connectDB();

    // ✅ Ensure admin account exists
    await ensureAdminExists();

    app.use(cors());
    app.use(express.json());

    // ✅ Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/admin', adminRoutes);

    // ✅ Root route
    app.get('/', (req, res) => res.send('✅ Task Management API is running...'));

    // ✅ 404 Handler
    app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

    // ✅ Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer(); // ✅ Init the whole app
