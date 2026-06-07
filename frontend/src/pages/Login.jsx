import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-logo">Instagram</h1>
        
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            className="auth-input" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            className="auth-input" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Log in</button>
        </form>
        
        <div className="auth-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
