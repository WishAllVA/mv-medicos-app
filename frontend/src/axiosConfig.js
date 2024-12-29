import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Add the backend host here
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url !== '/api/auth/login') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await axiosInstance.post('/api/auth/logout');
      } catch (logoutError) {
        console.error('Logout failed:', logoutError);
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
