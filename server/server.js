import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/dataBase.js';
import taskRoutes from './src/routes/tasks.js';
import authRoutes from './src/routes/auth.js';
import adminRoutes from './src/routes/admin.js';
import { ensureAdminExists } from './src/utils/seedAdmin.js';

dotenv.config();
const app = express();

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminExists();

    app.use(
      cors({
        origin: "http://localhost:3000", // Adjust this to your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );
    app.use(express.json());

    app.use('/api/auth', authRoutes);
    app.use('/api/tasks', taskRoutes);
    app.use('/api/admin', adminRoutes);

    app.get('/', (req, res) => res.send('Task Management API Running'));

    app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();
