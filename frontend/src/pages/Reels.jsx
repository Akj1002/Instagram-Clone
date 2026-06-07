import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Music, Plus } from 'lucide-react';
import './Reels.css';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get('/reels');
        setReels(res.data);
      } catch (error) {
        console.error('Fetch reels error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  const handleCreateReel = async () => {
    const videoUrl = window.prompt("Enter a video/image URL for your new Reel:");
    if (!videoUrl) return;
    
    const description = window.prompt("Enter a description:");
    
    try {
      const res = await axios.post('/reels', { videoUrl, description });
      setReels(prev => [res.data, ...prev]);
    } catch (error) {
      console.error('Create reel error', error);
      alert('Error creating reel');
    }
  };

  if (loading) return <div className="loading-screen">Loading Reels...</div>;

  return (
    <div className="reels-container">
      <button className="create-reel-btn" onClick={handleCreateReel}>
        <Plus size={24} /> Create Reel
      </button>
      
      <div className="reels-scroll-container">
        {reels.length === 0 ? (
          <div className="no-reels">No Reels yet. Be the first to create one!</div>
        ) : (
          reels.map((reel) => (
            <ReelItem key={reel.id} reel={reel} />
          ))
        )}
      </div>
    </div>
  );
};

const ReelItem = ({ reel }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="reel-item">
      {/* We use an image here to mock the video for simplicity, but in a real app this would be a <video> element */}
      <img src={reel.url} alt="Reel" className="reel-video" />
      
      <div className="reel-overlay">
        <div className="reel-info">
          <div className="reel-user">
            <img src={reel.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="reel-avatar" />
            <span className="reel-username">{reel.user}</span>
            <button className="reel-follow-btn">Follow</button>
          </div>
          <p className="reel-description">{reel.description}</p>
          <div className="reel-song">
            <Music size={14} className="music-icon" />
            <marquee>{reel.song}</marquee>
          </div>
        </div>

        <div className="reel-actions">
          <button className="reel-action-btn" onClick={() => setIsLiked(!isLiked)}>
            <Heart size={28} fill={isLiked ? "var(--danger-color)" : "none"} color={isLiked ? "var(--danger-color)" : "white"} />
            <span>{isLiked ? reel.likes + 1 : reel.likes}</span>
          </button>
          <button className="reel-action-btn">
            <MessageCircle size={28} color="white" />
            <span>{reel.comments}</span>
          </button>
          <button className="reel-action-btn">
            <Send size={28} color="white" />
          </button>
          <button className="reel-action-btn">
            <Bookmark size={28} color="white" />
          </button>
          <button className="reel-action-btn">
            <MoreHorizontal size={28} color="white" />
          </button>
          <div className="reel-audio-track">
            <img src={reel.avatar || 'https://via.placeholder.com/150'} alt="Audio" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reels;
