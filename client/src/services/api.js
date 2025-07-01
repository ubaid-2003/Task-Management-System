// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if your server runs on a different port or domain
  withCredentials: true,
});

export default api;
