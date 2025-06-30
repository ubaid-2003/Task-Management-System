import api from './api'; // axios instance with baseURL


export const registerUser = async (userData) => {
  const res = await api.post('/auth/register', userData); // ✅ Correct
  return res.data;
};


export const loginUser = async (userData) => {
  const res = await api.post('/auth/login', userData);
  return res.data; // this must include `token`
};
