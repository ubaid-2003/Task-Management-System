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

  // ⬇️ Fetch tasks on user load
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

  // ✅ Create task
  const handleCreateTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const created = await createTaskAPI(newTask, token);
      setTasks((prev) => [...prev, created.task]);
      setShowForm(false);
      toast.success('✅ Task created!');
    } catch {
      toast.error('Failed to create task');
    }
  };

  // ✅ Update task
  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const res = await updateTaskAPI(updatedTask._id, updatedTask, token);
      setTasks((prev) =>
        prev.map((t) => (t._id === res.task._id ? res.task : t))
      );
      setShowForm(false);
      setEditingTask(null);
      toast.success('Task updated');
    } catch {
      toast.error('Update failed');
    }
  };

  // ✅ Delete task
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deleteTaskAPI(id, token);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  // ✅ Edit task button
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // ✅ On TaskCard click: mark as read + auto-complete
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
      toast.error('Failed to open task');
    }
  };

  // ✅ Mark task as complete
  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await toggleTaskCompletion(taskId, token);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.task : t))
      );
    } catch {
      toast.error('Toggle failed');
    }
  };

  // ✅ Cleanup read timeout
  useEffect(() => {
    return () => {
      if (readTimeout) clearTimeout(readTimeout);
    };
  }, [readTimeout]);

  // ✅ Filters & Sorting
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

  // ✅ Render
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6 pt-24">

        {/* ✅ Stats Section */}
        <section className="grid grid-cols-1 gap-4 mb-6 text-center sm:grid-cols-3">
          <div className="p-4 bg-green-100 rounded shadow">
            <p className="text-sm text-gray-700">📦 Total Tasks</p>
            <h2 className="text-2xl font-bold">{tasks.length}</h2>
          </div>
          <div className="p-4 bg-blue-100 rounded shadow">
            <p className="text-sm text-gray-700">✅ Completed</p>
            <h2 className="text-2xl font-bold">
              {tasks.filter((t) => t.completed).length}
            </h2>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow">
            <p className="text-sm text-gray-700">⏳ Pending</p>
            <h2 className="text-2xl font-bold">
              {tasks.filter((t) => !t.completed).length}
            </h2>
          </div>
        </section>

        {/* ✅ Filters & Add Button */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex space-x-4">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-2 py-1 border rounded">
              <option>All</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-2 py-1 border rounded">
              <option>Newest</option>
              <option>Oldest</option>
              <option>Priority</option>
            </select>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            + Add Task
          </button>
        </div>

        {/* ✅ Task Form */}
        {showForm && (
          <TaskForm
            task={editingTask}
            onCreate={handleCreateTask}
            onUpdate={handleUpdateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            isAdmin={true}
            userEmail={user?.email}
          />
        )}

        {/* ✅ Task List */}
        <section className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={handleCardClick}
                onEdit={handleEditTask}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="py-12 text-center col-span-full">
              <p className="text-gray-500">No tasks found. Create your first task!</p>
            </div>
          )}
        </section>

        {/* ✅ Modal */}
        {activeTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-6 mx-4 bg-white shadow-lg rounded-xl sm:mx-0">
              <button
                onClick={() => {
                  setActiveTask(null);
                  if (readTimeout) clearTimeout(readTimeout);
                }}
                className="absolute text-xl text-gray-500 top-3 right-3 hover:text-gray-700"
              >
                ❌
              </button>

              <h2 className="mb-2 text-2xl font-bold text-gray-800">{activeTask.title}</h2>
              <p className="mb-4 text-gray-600 whitespace-pre-wrap">
                {activeTask.description}
              </p>

              <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                <span>🚦 Priority: <strong>{activeTask.priority}</strong></span>
                <span>📅 Due: <strong>{activeTask.dueDate?.slice(0, 10)}</strong></span>
              </div>

              {activeTask.completed ? (
                <div className="font-semibold text-green-600">✅ Completed</div>
              ) : (
                <div className="font-semibold text-yellow-600">🕒 Pending</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
