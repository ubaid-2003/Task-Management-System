import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminAuthenticated');
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 z-20 w-full text-white shadow-lg bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
          {/* Left Logo */}
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <span className="text-2xl font-bold tracking-tighter text-transparent transition-all duration-300 bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-purple-500 group-hover:to-blue-400">
              TaskFlow
            </span>
            <span className="text-xl animate-bounce">🚀</span>
          </div>

          {/* Right User Info & Logout */}
          <div className="relative flex items-center space-x-4 group">
            {user && (
              <div className="flex items-center space-x-3">
                {/* Avatar with initials only */}
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white uppercase rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  {user.name?.charAt(0) || 'U'}
                </div>

                {/* User name + email */}
                <div className="hidden md:block text-left leading-tight max-w-[160px] truncate">
                  <div className="text-sm font-semibold truncate">{user.name || 'User'}</div>
                  <div className="text-xs text-gray-300 truncate">{user.email}</div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm font-medium transition-all duration-300 transform rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 hover:shadow-md hover:scale-105 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
