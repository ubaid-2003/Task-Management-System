import Task from '../models/Task.js';
import User from '../models/User.js';

// GET all users with their tasks (for admin panel)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('tasks'); // this will now work with virtual

    res.status(200).json(users); // send directly for frontend
  } catch (error) {
    console.error('Error fetching users with tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// GET platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    res.status(200).json({ userCount, taskCount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET tasks for a specific user
export const getUserTasks = async (req, res) => {
  try {
    const userTasks = await Task.find({ user: req.params.id });
    res.status(200).json(userTasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE task for a specific user
export const createTaskForUser = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  try {
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

// UPDATE a task for a specific user
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

// DELETE a task for a specific user
export const deleteUserTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, user: req.params.id });

    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

// TOGGLE task completion for a user's task
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