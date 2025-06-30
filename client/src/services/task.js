import api from './api';

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getTasksAPI = async (token) => {
  const res = await api.get('/tasks', authHeader(token));
  return res.data;
};
// services/task.js


export const createTaskAPI = async (task, token, userId = null) => {
  try {
    const url = userId
      ? `/admin/users/${userId}/tasks`
      : `/tasks`;

    const res = await api.post(url, task, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    console.error('❌ Task creation failed:', err.response?.data || err.message);
    throw err;
  }
};



export const updateTaskAPI = async (id, updates, token) => {
  const res = await api.put(`/tasks/${id}`, updates, authHeader(token));
  return res.data;
};

export const deleteTaskAPI = async (id, token) => {
  const res = await api.delete(`/tasks/${id}`, authHeader(token));
  return res.data;
};

export const toggleTaskCompletion = async (id, token) => {
  const res = await api.patch(`/tasks/${id}/toggle`, {}, authHeader(token));
  return res.data;
};
