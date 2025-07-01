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
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-xl font-medium text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container px-4 py-6 pt-24 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="mt-2 text-gray-500">Manage users and their tasks efficiently</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Total Users" 
            value={stats.totalUsers} 
            icon="👥" 
            bgColor="bg-blue-100" 
            textColor="text-blue-600" 
          />
          <StatCard 
            label="Total Tasks" 
            value={stats.totalTasks} 
            icon="📝" 
            bgColor="bg-indigo-100" 
            textColor="text-indigo-600" 
          />
          <StatCard 
            label="Completed" 
            value={stats.completed} 
            icon="✅" 
            bgColor="bg-green-100" 
            textColor="text-green-600" 
          />
          <StatCard 
            label="Pending" 
            value={stats.pending} 
            icon="⏳" 
            bgColor="bg-yellow-100" 
            textColor="text-yellow-600" 
          />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
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

const StatCard = ({ label, value, icon, bgColor, textColor }) => (
  <div className={`p-6 rounded-xl shadow-sm ${bgColor} transition-all hover:shadow-md`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`mt-1 text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

const UserList = ({ users, selectedUser, setSelectedUser, onDelete }) => (
  <div className="w-full p-5 bg-white shadow-sm rounded-xl lg:w-1/3">
    <div className="mb-5">
      <h2 className="text-xl font-bold text-gray-800">User Management</h2>
      <p className="text-sm text-gray-500">Select a user to view their tasks</p>
    </div>
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
      {users.map(user => (
        <div
          key={user._id}
          className={`p-4 rounded-lg transition-all cursor-pointer ${
            selectedUser?._id === user._id 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => setSelectedUser(user)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 mr-3 text-lg font-bold text-white bg-blue-500 rounded-full">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 truncate">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex mt-2 space-x-3 text-xs">
                <span className="px-2 py-1 text-blue-800 bg-blue-100 rounded-full">
                  Tasks: {user.tasks?.length || 0}
                </span>
                <span className="px-2 py-1 text-green-800 bg-green-100 rounded-full">
                  Completed: {user.tasks?.filter(t => t.completed).length || 0}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(user._id);
              }}
              className="p-2 text-red-500 rounded-full hover:bg-red-50"
              title="Delete User"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TaskList = ({ selectedUser, setSelectedTask }) => (
  <div className="w-full lg:w-2/3">
    {selectedUser ? (
      <div className="p-5 bg-white shadow-sm rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{selectedUser.name}'s Tasks</h2>
            <p className="text-sm text-gray-500">{selectedUser.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
              {selectedUser.tasks?.filter(t => t.completed).length || 0} Completed
            </span>
            <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
              {selectedUser.tasks?.filter(t => !t.completed).length || 0} Pending
            </span>
          </div>
        </div>
        
        {selectedUser.tasks?.length > 0 ? (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {selectedUser.tasks?.map(task => (
              <div
                key={task._id}
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                  task.completed 
                    ? 'bg-green-50 hover:bg-green-100 border-l-4 border-green-500' 
                    : 'bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500'
                }`}
              >
                <div className="flex items-center">
                  <div className={`mr-3 p-2 rounded-lg ${
                    task.completed ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {task.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      {task.completed ? 'Completed' : 'Pending'} • {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-500">No Tasks Found</h3>
            <p className="mt-1 text-gray-400">This user hasn't created any tasks yet</p>
          </div>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white shadow-sm rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-500">Select a User</h3>
        <p className="mt-1 text-gray-400">Choose a user from the list to view their tasks</p>
      </div>
    )}
  </div>
);