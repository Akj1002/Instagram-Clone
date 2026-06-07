import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostDetails from './pages/PostDetails';
import Search from './pages/Search';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Reels from './pages/Reels';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Loading Instagram...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Feed />} />
          <Route path="reels" element={<Reels />} />
          <Route path="search" element={<Search />} />
          <Route path="explore" element={<Explore />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="post/:id" element={<PostDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
