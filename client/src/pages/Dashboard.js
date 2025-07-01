import React, { useState, useEffect, useContext } from 'react';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  createTaskAPI,
  getTasksAPI,
  updateTaskAPI,
  deleteTaskAPI,
  toggleTaskCompletion,
} from '../services/task';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [readTimeout, setReadTimeout] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getTasksAPI(token);
        setTasks(data.tasks);
      } catch (err) {
        toast.error('Failed to load tasks');
      }
    };

    if (user) fetchTasks();
  }, [user]);

  const handleCreateTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const created = await createTaskAPI(newTask, token);
      setTasks((prev) => [...prev, created.task]);
      setShowForm(false);
      toast.success('✨ Task created successfully!');
    } catch {
      toast.error('❌ Failed to create task');
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const res = await updateTaskAPI(updatedTask._id, updatedTask, token);
      setTasks((prev) =>
        prev.map((t) => (t._id === res.task._id ? res.task : t))
      );
      setShowForm(false);
      setEditingTask(null);
      toast.success('🔄 Task updated successfully!');
    } catch {
      toast.error('❌ Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deleteTaskAPI(id, token);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('🗑️ Task deleted successfully!');
    } catch {
      toast.error('❌ Delete failed');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCardClick = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const res = await updateTaskAPI(task._id, { read: true }, token);
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.task : t))
      );
      setActiveTask(res.task);

      const timeout = setTimeout(() => {
        handleComplete(task._id);
        setActiveTask(null);
      }, 15000);
      setReadTimeout(timeout);
    } catch {
      toast.error('❌ Failed to open task');
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await toggleTaskCompletion(taskId, token);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.task : t))
      );
    } catch {
      toast.error('❌ Toggle failed');
    }
  };

  useEffect(() => {
    return () => {
      if (readTimeout) clearTimeout(readTimeout);
    };
  }, [readTimeout]);

  const filteredTasks = tasks.filter((task) =>
    filter === 'Completed' ? task.completed :
      filter === 'Pending' ? !task.completed : true
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === 'Priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="p-6 pt-24">
        {/* 🌟 Dashboard Header with Animated Emoji */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">📊</div>
          <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            Your Task Dashboard
          </h1>
          <p className="mt-2 text-gray-600">✨ Manage your tasks efficiently</p>
        </div>

        {/* 📊 Stats Cards with Emoji Icons */}
        <section className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 mr-4 text-white bg-blue-500 rounded-full">📋</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <h2 className="text-2xl font-bold">{tasks.length}</h2>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 mr-4 text-white bg-green-500 rounded-full">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <h2 className="text-2xl font-bold">
                  {tasks.filter((t) => t.completed).length}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 mr-4 text-white bg-yellow-500 rounded-full">⏳</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <h2 className="text-2xl font-bold">
                  {tasks.filter((t) => !t.completed).length}
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ Controls Section */}
        <div className="flex flex-col justify-between p-6 mb-8 bg-white rounded-xl shadow-md sm:flex-row">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">🔍</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Tasks</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">📊</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Priority (High-Low)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="flex items-center px-6 py-3 mt-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 sm:mt-0"
          >
            <span className="mr-2 text-xl">➕</span> Create New Task
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            ></div>
            <div className="relative z-50 flex items-center justify-center w-full h-full">
              <TaskForm
                task={editingTask}
                onCreate={handleCreateTask}
                onUpdate={handleUpdateTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}


        {/* 🗂️ Task List */}
        {sortedTasks.length > 0 ? (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={handleCardClick}
                onEdit={handleEditTask}
                onDelete={handleDelete}
              />
            ))}
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-700">No tasks found</h3>
            <p className="mt-2 text-gray-500">Create your first task to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 mt-6 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700"
            >
              <span className="mr-2">➕</span> Create Task
            </button>
          </div>
        )}

        {/* 🪟 Task Modal */}
        {activeTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl p-8 mx-4 bg-white rounded-2xl shadow-2xl">
              <button
                onClick={() => {
                  setActiveTask(null);
                  if (readTimeout) clearTimeout(readTimeout);
                }}
                className="absolute p-2 text-gray-500 rounded-full top-4 right-4 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>

              <div className="flex items-start mb-6">
                <div className="flex items-center justify-center p-3 mr-4 text-3xl bg-blue-100 rounded-full">
                  {activeTask.priority === 'High' ? '🔥' :
                    activeTask.priority === 'Medium' ? '⚠️' : '🐢'}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">{activeTask.title}</h2>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span>📅 {activeTask.dueDate?.slice(0, 10) || 'No due date'}</span>
                    <span>🕒 Created: {new Date(activeTask.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 mb-6 bg-gray-50 rounded-xl">
                <p className="text-lg text-gray-700 whitespace-pre-wrap">
                  {activeTask.description || 'No description provided'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="px-4 py-2 rounded-full bg-gray-100">
                  {activeTask.completed ? (
                    <span className="flex items-center text-green-600">
                      <span className="mr-2">✅</span> Completed
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600">
                      <span className="mr-2">⏳</span> Pending
                    </span>
                  )}
                </div>

                <div className="flex space-x-3">

                  <button
                    onClick={() => handleComplete(activeTask._id)}
                    className="flex items-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    <span className="mr-2">✅</span> {activeTask.completed ? 'Undo' : 'Complete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;