// 🛠 controllers/taskController.js
import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createTask = async (req, res) => {
const { title, description, priority, dueDate } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      completed: false,
      user: req.user._id,
    });


    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

// TOGGLE task completion
export const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Toggle failed' });
  }
};
