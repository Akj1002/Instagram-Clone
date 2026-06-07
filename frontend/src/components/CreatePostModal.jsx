import React, { useState, useRef } from 'react';
import axios from 'axios';
import { X, Image as ImageIcon } from 'lucide-react';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      const res = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onPostCreated(res.data);
      handleClose();
    } catch (error) {
      console.error('Error creating post', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewUrl(null);
    setCaption('');
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <button className="modal-close-btn" onClick={handleClose}>
        <X size={28} color="white" />
      </button>

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create new post</h3>
          {file && (
            <button className="modal-share-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sharing...' : 'Share'}
            </button>
          )}
        </div>

        <div className="modal-body">
          {!file ? (
            <div className="modal-upload-area">
              <ImageIcon size={64} style={{ marginBottom: '16px', color: 'var(--text-primary)' }} />
              <h2>Drag photos and videos here</h2>
              <button 
                className="modal-select-btn"
                onClick={() => fileInputRef.current.click()}
              >
                Select from computer
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/jpeg,image/png,image/jpg" 
                style={{ display: 'none' }} 
              />
            </div>
          ) : (
            <div className="modal-preview-area">
              <div className="modal-image-container">
                <img src={previewUrl} alt="Preview" className="modal-preview-image" />
              </div>
              <div className="modal-caption-container">
                <textarea 
                  placeholder="Write a caption..." 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="modal-caption-input"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
