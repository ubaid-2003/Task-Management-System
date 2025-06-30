import express from 'express';
import {
  getAllUsers,
  getPlatformStats,
  getUserTasks,
  createTaskForUser,
  updateUserTask,
  deleteUserTask,
  toggleUserTask
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);
router.get('/users/:id/tasks', getUserTasks);
router.post('/users/:id/tasks', createTaskForUser);
router.put('/users/:id/tasks/:taskId', updateUserTask);
router.delete('/users/:id/tasks/:taskId', deleteUserTask);
router.patch('/users/:id/tasks/:taskId/toggle', toggleUserTask);

export default router;