import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import './Post.css';

const Post = ({ post, socket }) => {
  const { user } = useContext(AuthContext);
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => like.userId === user.id) || false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaved, setIsSaved] = useState(post.savedBy?.length > 0 || false);

  const handleLike = async () => {
    try {
      // Optimistic UI update
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      const res = await axios.post(`/interactions/${post.id}/like`);
      
      // Update with actual server data to be safe
      setLikesCount(res.data.likesCount);
      setIsLiked(res.data.action === 'liked');
    } catch (error) {
      console.error('Like error', error);
      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaved(!isSaved); // Optimistic
      const res = await axios.post(`/posts/${post.id}/save`);
      setIsSaved(res.data.isSaved);
    } catch (error) {
      console.error('Save error', error);
      setIsSaved(!isSaved); // Revert
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user.username}`} className="post-user-info">
          <img src={post.user.avatar || 'https://via.placeholder.com/150'} alt={post.user.username} className="post-avatar" />
          <span className="post-username">{post.user.username}</span>
        </Link>
        <span className="post-time">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
      </div>

      <div className="post-image-container" onDoubleClick={handleDoubleTap}>
        <img 
          src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5000${post.imageUrl}`} 
          alt="Post content" 
          className="post-image" 
        />
        {/* Like animation overlay could go here */}
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button onClick={handleLike} className={`action-btn ${isAnimating ? 'pop' : ''}`}>
            <Heart size={24} fill={isLiked ? "var(--danger-color)" : "none"} color={isLiked ? "var(--danger-color)" : "currentColor"} />
          </button>
          <Link to={`/post/${post.id}`} className="action-btn">
            <MessageCircle size={24} />
          </Link>
          <button className="action-btn">
            <Send size={24} />
          </button>
        </div>
        <div className="post-actions-right">
          <button className="action-btn" onClick={handleSave}>
            <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="post-likes">
        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
      </div>

      {post.caption && (
        <div className="post-caption">
          <Link to={`/profile/${post.user.username}`} className="caption-username">
            {post.user.username}
          </Link>{' '}
          {post.caption}
        </div>
      )}

      {post._count?.comments > 0 && (
        <Link to={`/post/${post.id}`} className="view-comments">
          View all {post._count.comments} comments
        </Link>
      )}
    </div>
  );
};

export default Post;
