import api from './api';

export const getAllUsersAPI = async (token) => {
  const res = await api.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("🚀 Fetched users:", res.data);
  return res.data;
};

export const deleteUserAPI = async (userId, token) => {
  const res = await api.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
