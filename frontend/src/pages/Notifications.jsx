import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/users/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error('Fetch notifications error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="loading-screen" style={{ height: '100%' }}>Loading...</div>;

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      
      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif.id} className="notification-item">
              <Link to={`/profile/${notif.triggerBy.username}`} className="notif-avatar-link">
                <img src={notif.triggerBy.avatar} alt="Avatar" className="notif-avatar" />
              </Link>
              
              <div className="notif-content">
                <Link to={`/profile/${notif.triggerBy.username}`} className="notif-username">
                  {notif.triggerBy.username}
                </Link>{' '}
                {notif.type === 'LIKE' && 'liked your post.'}
                {notif.type === 'COMMENT' && `commented: "${notif.text}"`}
                {notif.type === 'FOLLOW' && 'started following you.'}
                <span className="notif-time">
                  {formatDistanceToNow(new Date(notif.createdAt))} ago
                </span>
              </div>

              {notif.post && (
                <Link to={`/post/${notif.post.id}`} className="notif-post-link">
                  <img 
                    src={notif.post.imageUrl.startsWith('http') ? notif.post.imageUrl : `http://localhost:5000${notif.post.imageUrl}`} 
                    alt="Post" 
                    className="notif-post-img" 
                  />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
