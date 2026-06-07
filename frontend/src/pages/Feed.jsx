import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import Post from '../components/Post';
import StoriesBar from '../components/StoriesBar';
import SuggestedUsers from '../components/SuggestedUsers';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Setup Socket.IO connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    if (user) {
      newSocket.emit('join', user.id);
    }

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get('/posts/feed');
        setPosts(res.data);
      } catch (error) {
        console.error('Failed to fetch feed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return <div className="loading-screen" style={{ height: '100%' }}>Loading Feed...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <StoriesBar />
        
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
            No posts to show. Follow some users or create a post!
          </div>
        ) : (
          posts.map(post => (
            <Post key={post.id} post={post} socket={socket} />
          ))
        )}
      </div>
      
      <SuggestedUsers />
    </div>
  );
};

export default Feed;
