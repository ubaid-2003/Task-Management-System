// ✅ AdminPanel.js
import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { getAllUsersAPI, deleteUserAPI } from '../services/admin';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.email !== 'admin@gmail.com') {
      navigate('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const data = await getAllUsersAPI(token);
        setUsers(data);
      } catch (err) {
        console.error('❌ Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user and all their tasks?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await deleteUserAPI(userId, token);
      setUsers(users.filter((u) => u._id !== userId));
      if (selectedUser?._id === userId) setSelectedUser(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('❌ Failed to delete user.');
    }
  };

  const stats = {
    totalUsers: users.length,
    totalTasks: users.reduce((acc, u) => acc + (u.tasks?.length || 0), 0),
    completed: users.reduce((acc, u) => acc + (u.tasks?.filter(t => t.completed).length || 0), 0),
    pending: users.reduce((acc, u) => acc + (u.tasks?.filter(t => !t.completed).length || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-500">
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container px-4 py-6 pt-24 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-center">Admin Panel</h1>

        <div className="grid grid-cols-1 gap-4 mb-8 text-center md:grid-cols-4">
          <StatCard label="Total Users" value={stats.totalUsers} color="text-blue-600" />
          <StatCard label="Total Tasks" value={stats.totalTasks} color="text-indigo-600" />
          <StatCard label="Completed" value={stats.completed} color="text-green-600" />
          <StatCard label="Pending" value={stats.pending} color="text-yellow-500" />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <UserList
            users={users}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            onDelete={handleDeleteUser}
          />
          <TaskList selectedUser={selectedUser} setSelectedTask={setSelectedTask} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

const StatCard = ({ label, value, color }) => (
  <div className="p-4 bg-white rounded shadow">
    <h3 className="text-sm text-gray-500">{label}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const UserList = ({ users, selectedUser, setSelectedUser, onDelete }) => (
  <div className="w-full p-4 bg-white rounded shadow md:w-1/3">
    <h2 className="mb-2 text-lg font-bold">All Users</h2>
    <p className="mb-4 text-sm text-gray-500">Select a user to view tasks</p>
    <div className="space-y-3">
      {users.map(user => (
        <div
          key={user._id}
          className={`p-3 border rounded transition-colors cursor-pointer hover:bg-blue-50 ${
            selectedUser?._id === user._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div onClick={() => setSelectedUser(user)} className="flex-1 overflow-hidden cursor-pointer">
              <div className="font-semibold truncate">
                {user.name} <span className="text-sm text-gray-500">({user.email})</span>
              </div>
              <div className="mt-1 text-sm truncate">
                Tasks: {user.tasks?.length || 0} | Completed: {user.tasks?.filter(t => t.completed).length || 0}
              </div>
            </div>
            <button
              onClick={() => onDelete(user._id)}
              className="ml-2 text-xs text-red-600 hover:underline"
              title="Delete User"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TaskList = ({ selectedUser, setSelectedTask }) => (
  <div className="w-full md:w-2/3">
    {selectedUser ? (
      <div className="p-4 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tasks for {selectedUser.name}</h2>
          <div className="text-sm text-gray-500">
            {selectedUser.tasks?.filter(t => t.completed).length || 0} / {selectedUser.tasks?.length || 0} Completed
          </div>
        </div>
        <div className="space-y-2">
          {selectedUser.tasks?.map(task => (
            <div
              key={task._id}
              onClick={() => setSelectedTask(task)}
              className={`p-3 border rounded cursor-pointer flex justify-between items-center ${
                task.completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-500">
                  {task.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded shadow">
        <h3 className="text-lg font-medium text-gray-500">No User Selected</h3>
        <p className="mt-1 text-gray-400">Click a user on the left to view their tasks</p>
      </div>
    )}
  </div>
);
