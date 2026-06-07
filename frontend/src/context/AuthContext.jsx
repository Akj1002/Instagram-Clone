import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Setup axios default
  axios.defaults.baseURL = 'http://localhost:5000';

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    const res = await axios.post('/auth/register', { username, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
