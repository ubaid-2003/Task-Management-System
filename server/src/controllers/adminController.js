import Task from '../models/Task.js';
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    console.log('🔐 Admin:', req.user.email);
    const users = await User.find({ email: { $ne: 'admin@gmail.com' } })
      .select('-password')
      .populate('tasks');
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users with tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUserAndTasks = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email === 'admin@gmail.com') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await Task.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User and their tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting user and tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ email: { $ne: 'admin@gmail.com' } });
    const taskCount = await Task.countDocuments();
    res.status(200).json({ userCount, taskCount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const userTasks = await Task.find({ user: req.params.id });
    res.status(200).json(userTasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTaskForUser = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user.email === 'admin@gmail.com') {
      return res.status(403).json({ message: 'Cannot create tasks for admin' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      completed: false,
      user: req.params.id
    });
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateUserTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, user: req.params.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};

export const deleteUserTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, user: req.params.id });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

export const toggleUserTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, user: req.params.id });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Toggle failed' });
  }
};
