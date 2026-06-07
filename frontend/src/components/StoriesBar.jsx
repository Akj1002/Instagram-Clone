import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, X } from 'lucide-react';
import './StoriesBar.css';

const StoriesBar = () => {
  const { user } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get('/stories/feed');
        setStories(res.data);
      } catch (error) {
        console.error('Failed to fetch stories', error);
      }
    };
    fetchStories();
  }, []);

  const handleAddStory = async (e) => {
    // In a real app we would upload an image file
    // For this mock, we'll prompt for an image URL
    const imageUrl = window.prompt("Enter image URL for your story:");
    if (!imageUrl) return;

    try {
      const res = await axios.post('/stories', { imageUrl });
      setStories([res.data, ...stories]);
    } catch (error) {
      console.error('Failed to add story', error);
      alert('Error uploading story');
    }
  };

  const hasUserStory = stories.some(s => s.user.username === user.username);

  return (
    <>
      <div className="stories-bar">
        {!hasUserStory && (
          <div className="story-item add-story" onClick={handleAddStory}>
            <div className="story-avatar-container my-story">
              <img src={user?.avatar || 'https://via.placeholder.com/150'} alt="Add story" />
              <div className="add-icon">
                <Plus size={14} color="white" />
              </div>
            </div>
            <span className="story-username">Your story</span>
          </div>
        )}
        
        {stories.map(story => (
          <div key={story.id} className="story-item" onClick={() => setActiveStory(story)}>
            <div className="story-avatar-container active-border">
              <img src={story.user.avatar || 'https://via.placeholder.com/150'} alt={story.user.username} />
            </div>
            <span className="story-username">{story.user.username === user.username ? 'Your story' : story.user.username}</span>
          </div>
        ))}
      </div>

      {activeStory && (
        <div className="story-viewer-overlay">
          <button className="close-story-btn" onClick={() => setActiveStory(null)}>
            <X size={30} />
          </button>
          <div className="story-viewer-content">
            <div className="story-viewer-header">
              <img src={activeStory.user.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="story-viewer-avatar" />
              <span>{activeStory.user.username}</span>
            </div>
            <img src={activeStory.imageUrl.startsWith('http') ? activeStory.imageUrl : `http://localhost:5000${activeStory.imageUrl}`} alt="Story" className="story-viewer-image" />
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesBar;
