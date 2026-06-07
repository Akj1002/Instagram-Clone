import React, { useState, useContext } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './EditProfileModal.css';

const EditProfileModal = ({ isOpen, onClose, profile, onProfileUpdated }) => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatar, setAvatar] = useState(profile?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.put('/users/profile', { username, bio, avatar });
      onProfileUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-profile-modal">
        <button className="close-modal-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Edit Profile</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Profile Picture URL</label>
            <input 
              type="text" 
              value={avatar} 
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a bio..."
              rows={4}
            />
          </div>
          <button type="submit" className="save-profile-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
