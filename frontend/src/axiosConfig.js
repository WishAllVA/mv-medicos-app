import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Add the backend host here
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url !== '/api/login') {
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

export default axiosInstance;
