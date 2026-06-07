import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import './PostDetails.css';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching post', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/interactions/${id}/comment`, { text: commentText });
      setPost(prev => ({
        ...prev,
        comments: [res.data, ...prev.comments]
      }));
      setCommentText('');
    } catch (error) {
      console.error('Comment error', error);
    }
  };

  if (loading) return <div className="loading-screen" style={{ height: '100%' }}>Loading Post...</div>;
  if (!post) return <div className="loading-screen" style={{ height: '100%' }}>Post not found</div>;

  const isLiked = post.likes.some(like => like.userId === user.id);

  return (
    <div className="post-details-container">
      <div className="post-details-box">
        <div className="post-details-image">
          <img src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5000${post.imageUrl}`} alt="Post" />
        </div>
        <div className="post-details-sidebar">
          <div className="pd-header">
            <Link to={`/profile/${post.user.username}`} className="post-user-info">
              <img src={post.user.avatar} alt="Avatar" className="post-avatar" />
              <span className="post-username">{post.user.username}</span>
            </Link>
          </div>
          
          <div className="pd-comments">
            {post.caption && (
              <div className="pd-comment">
                <img src={post.user.avatar} alt="Avatar" className="post-avatar" />
                <div className="pd-comment-content">
                  <span className="caption-username">{post.user.username}</span>
                  <span>{post.caption}</span>
                </div>
              </div>
            )}
            
            {post.comments.map(comment => (
              <div key={comment.id} className="pd-comment">
                <img src={comment.user.avatar} alt="Avatar" className="post-avatar" />
                <div className="pd-comment-content">
                  <Link to={`/profile/${comment.user.username}`} className="caption-username">
                    {comment.user.username}
                  </Link>
                  <span>{comment.text}</span>
                  <div className="pd-comment-time">
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pd-actions-box">
            <div className="post-actions-left" style={{ padding: '12px 16px' }}>
              <button className="action-btn">
                <Heart size={24} fill={isLiked ? "var(--danger-color)" : "none"} color={isLiked ? "var(--danger-color)" : "currentColor"} />
              </button>
              <button className="action-btn"><MessageCircle size={24} /></button>
              <button className="action-btn"><Send size={24} /></button>
            </div>
            <div className="post-likes" style={{ padding: '0 16px', marginBottom: '8px' }}>
              {post.likes.length} likes
            </div>
            <div className="post-time" style={{ padding: '0 16px', marginBottom: '12px' }}>
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </div>
          </div>

          <form className="pd-add-comment" onSubmit={handleAddComment}>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" disabled={!commentText.trim()}>Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
