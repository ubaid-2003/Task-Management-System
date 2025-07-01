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

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getTasksAPI(token);
      setTasks(data.tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
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

      if (!task.read) {
        const readRes = await updateTaskAPI(task._id, { read: true }, token);
        setTasks(prev => prev.map(t => t._id === task._id ? readRes.task : t));
        setActiveTask(readRes.task);
      } else {
        setActiveTask(task);
      }

      if (readTimeout) clearTimeout(readTimeout);

    } catch (err) {
      toast.error('Failed to open task');
      console.error(err);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await toggleTaskCompletion(taskId, token);

      setTasks(prev => prev.map(t => t._id === taskId ? res.task : t));

      if (activeTask?._id === taskId) {
        setActiveTask(res.task);
      }

      toast.success(res.task.completed ? '✅ Task completed!' : '⏳ Task marked incomplete');
    } catch (err) {
      toast.error('Failed to toggle completion');
      console.error(err);
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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="p-6 pt-24">

        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 text-6xl animate-bounce">📊</div>
          <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            Your Task Dashboard
          </h1>
          <p className="mt-2 text-gray-600">✨ Manage your tasks efficiently</p>
        </div>

        <section className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <StatCard icon="📋" label="Total Tasks" count={totalTasks} color="blue" />
          <StatCard icon="✅" label="Completed" count={completedTasks} color="green" />
          <StatCard icon="⏳" label="Pending" count={pendingTasks} color="yellow" />
        </section>

        <div className="flex flex-col justify-between p-6 mb-8 bg-white shadow-md rounded-xl sm:flex-row">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <SelectBox label="🔍" value={filter} onChange={setFilter} options={["All", "Completed", "Pending"]} />
            <SelectBox label="📊" value={sort} onChange={setSort} options={["Newest", "Oldest", "Priority"]} />
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="flex items-center px-6 py-3 mt-4 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 sm:mt-0"
          >
            <span className="mr-2 text-xl">➕</span> Create New Task
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => {
                setShowForm(false);
                setEditingTask(null);
              }}></div>
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
          <EmptyState onCreate={() => setShowForm(true)} />
        )}

        {activeTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl p-8 mx-4 bg-white shadow-2xl rounded-2xl">
              <button
                onClick={() => {
                  setActiveTask(null);
                  if (readTimeout) clearTimeout(readTimeout);
                  setTasks([...tasks]); 
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
                <div className="px-4 py-2 bg-gray-100 rounded-full">
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
                    onClick={() => {
                      handleComplete(activeTask._id);
                      if (readTimeout) clearTimeout(readTimeout);
                    }}
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

const StatCard = ({ icon, label, count, color }) => (
  <div className={`p-6 transition-all transform bg-white shadow-lg rounded-xl hover:scale-105`}>
    <div className="flex items-center">
      <div className={`p-3 mr-4 text-white bg-${color}-500 rounded-full`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <h2 className="text-2xl font-bold">{count}</h2>
      </div>
    </div>
  </div>
);

const SelectBox = ({ label, value, onChange, options }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt} Tasks</option>
      ))}
    </select>
  </div>
);

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-white shadow-sm rounded-xl">
    <div className="mb-4 text-6xl">📭</div>
    <h3 className="text-xl font-medium text-gray-700">No tasks found</h3>
    <p className="mt-2 text-gray-500">Create your first task to get started!</p>
    <button
      onClick={onCreate}
      className="flex items-center px-6 py-3 mt-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
    >
      <span className="mr-2">➕</span> Create Task
    </button>
  </div>
);

export default Dashboard;
