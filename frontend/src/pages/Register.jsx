import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-logo">Instagram</h1>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
          Sign up to see photos and videos from your friends.
        </p>

        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="auth-input" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button type="submit" className="auth-button">Sign up</button>
        </form>
        
        <div className="auth-link">
          Have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
