// src/services/admin.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Only for fetching all users with tasks
export const getAllUsersAPI = async (token) => {
  const res = await API.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // if API returns an array of users directly
};
