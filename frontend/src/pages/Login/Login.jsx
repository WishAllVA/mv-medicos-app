import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import './Login.css';

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = event.target.elements;

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        username: username.value,
        password: password.value,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/inventory');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>MV Medicos</h1>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button className='login-button' type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
