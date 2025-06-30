// Navbar.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminAuthenticated');
    navigate('/login');
  };

  const handleAdminLogin = () => {
    if (adminEmail === 'admin@gmail.com' && adminPassword === 'Admin123') {
      localStorage.setItem('adminAuthenticated', 'true');
      setShowAdminLogin(false);
      navigate('/admin');
    } else {
      toast.error('❌ Invalid admin credentials');
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-20 w-full text-white shadow-lg bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
          <div onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 cursor-pointer group">
            <span className="text-2xl font-bold tracking-tighter text-transparent transition-all duration-300 bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-purple-500 group-hover:to-blue-400">
              TaskFlow
            </span>
            <span className="text-xl animate-bounce">🚀</span>
          </div>
          <div className="absolute flex space-x-8 font-medium transform -translate-x-1/2 left-1/2">
            <button onClick={() => navigate('/dashboard')} className="px-3 py-1 transition-all duration-300 rounded-lg hover:bg-white/10 hover:shadow-sm hover:scale-105">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Dashboard
              </span>
            </button>
            <button onClick={() => setShowAdminLogin(true)} className="px-3 py-1 transition-all duration-300 rounded-lg hover:bg-white/10 hover:shadow-sm hover:scale-105">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
                Admin Panel
              </span>
            </button>
          </div>
          <div className="relative flex items-center space-x-4 group">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm hidden md:inline truncate max-w-[120px] font-medium">
                  {user.name || 'User'}
                </span>
              </div>
            )}
            <button onClick={handleLogout} className="px-3 py-1 text-sm font-medium transition-all duration-300 transform rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:shadow-md hover:scale-105 active:scale-95">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-center text-indigo-600">🔐 Admin Login</h2>
            <input
              type="email"
              placeholder="Admin Email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3 py-2 mb-3 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded"
            />
            <div className="flex justify-between">
              <button onClick={handleAdminLogin} className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                Login
              </button>
              <button onClick={() => setShowAdminLogin(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;