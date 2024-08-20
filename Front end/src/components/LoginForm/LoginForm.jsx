import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from 'react-icons/fa'; // Assuming you're using react-icons

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    console.log('Login attempt with:', username, password);
    // You can add your login API call here
    // For now, let's just simulate an error for demonstration
    setError('Invalid username or password');
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>
        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <a href="#">Register</a></p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;