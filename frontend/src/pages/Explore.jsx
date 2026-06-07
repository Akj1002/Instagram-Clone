import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await axios.get('/posts/explore');
        setPosts(res.data);
      } catch (error) {
        console.error('Fetch explore error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExplore();
  }, []);

  if (loading) return <div className="loading-screen" style={{ height: '100%' }}>Loading Explore...</div>;

  return (
    <div className="explore-page">
      <div className="explore-grid">
        {posts.map((post, index) => {
          // Make every 5th item larger for masonry effect
          const isLarge = index % 5 === 0;
          return (
            <Link 
              to={`/post/${post.id}`} 
              key={post.id} 
              className={`explore-item ${isLarge ? 'large' : ''}`}
            >
              <img src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5000${post.imageUrl}`} alt="Explore post" />
              <div className="explore-item-overlay">
                <span>❤️ {post._count.likes}</span>
                <span>💬 {post._count.comments}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
