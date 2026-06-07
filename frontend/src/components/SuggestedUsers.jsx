import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './SuggestedUsers.css';

const SuggestedUsers = () => {
  const { user } = useContext(AuthContext);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await axios.get('/users/suggested');
        setSuggested(res.data);
      } catch (error) {
        console.error('Failed to fetch suggested users', error);
      }
    };
    fetchSuggested();
  }, []);

  const handleFollow = async (userId, idx) => {
    try {
      await axios.post(`/users/${userId}/follow`);
      // Optimistically remove from list or show 'Following'
      setSuggested(prev => prev.filter((_, i) => i !== idx));
    } catch (error) {
      console.error('Follow error', error);
    }
  };

  if (suggested.length === 0) return null;

  return (
    <div className="suggested-users-container">
      <div className="suggested-header">
        <span className="suggested-title">Suggested for you</span>
        <span className="suggested-see-all">See All</span>
      </div>
      <div className="suggested-list">
        {suggested.map((sUser, idx) => (
          <div key={sUser.id} className="suggested-item">
            <Link to={`/profile/${sUser.username}`} className="suggested-user-info">
              <img src={sUser.avatar || 'https://via.placeholder.com/150'} alt={sUser.username} className="suggested-avatar" />
              <div className="suggested-text">
                <span className="suggested-username">{sUser.username}</span>
                <span className="suggested-subtext">New to Instagram</span>
              </div>
            </Link>
            <button className="suggested-follow-btn" onClick={() => handleFollow(sUser.id, idx)}>
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
