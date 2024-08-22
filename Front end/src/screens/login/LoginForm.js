import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Library from '../library/library';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      if (rememberMe) {
        localStorage.setItem('username', username);
      } else {
        localStorage.removeItem('username');
      }
      navigate('/library'); // Redirect to library page after successful login
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <div className='input-box'>
          <input 
            type='text' 
            placeholder='Username' 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className='icon'/>
        </div>

        <div className='input-box'>
          <input 
            type='password' 
            placeholder='Password' 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className='icon'/>
        </div>

        <div className='remember-forgot'>
          <label>
            <input 
              type='checkbox' 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            /> Remember me 
          </label>
          <a href="#"> Forgot Password?</a>
        </div>

        <button type="submit">Login</button>

        <div className='register-link'>
          <p>Don't have an account? <a href='#'>Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;