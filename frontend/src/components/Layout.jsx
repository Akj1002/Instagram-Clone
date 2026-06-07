import React, { useState, useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, Menu, LogOut, Film } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePostCreated = (newPost) => {
    // Navigate to the new post, or just home
    navigate('/');
    // Could also trigger a reload of the feed, but refreshing home will fetch it
    window.location.reload(); 
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <h1>Instagram</h1>
        </div>
        
        <div className="sidebar-links">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Home size={28} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/search" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Search size={28} />
            <span>Search</span>
          </NavLink>
          <NavLink to="/explore" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Compass size={28} />
            <span>Explore</span>
          </NavLink>
          <NavLink to="/reels" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Film size={28} />
            <span>Reels</span>
          </NavLink>
          <NavLink to="/messages" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <MessageCircle size={28} />
            <span>Messages</span>
          </NavLink>
          <NavLink to="/notifications" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Heart size={28} />
            <span>Notifications</span>
          </NavLink>
          <div className="nav-link" onClick={() => setIsCreateModalOpen(true)}>
            <PlusSquare size={28} />
            <span>Create</span>
          </div>
          <NavLink to={`/profile/${user?.username}`} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <img src={user?.avatar} alt="Profile" className="nav-profile-pic" />
            <span>Profile</span>
          </NavLink>
        </div>

        <div className="sidebar-bottom">
          <button className="nav-link logout-btn" onClick={logout}>
            <LogOut size={28} />
            <span>Log out</span>
          </button>
          <div className="nav-link">
            <Menu size={28} />
            <span>More</span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Layout;
