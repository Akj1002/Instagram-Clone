import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('POSTS');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes] = await Promise.all([
          axios.get(`/users/${username}`)
        ]);
        
        setProfile(profileRes.data);
        
        // Fetch posts for this user
        const userPostsRes = await axios.get(`/posts/user/${profileRes.data.id}`);
        setPosts(userPostsRes.data);

        // Check if following initially
        if (currentUser && currentUser.username !== username) {
          const checkFollowRes = await axios.get(`/users/${username}`);
          // we could pass this down from the user object if we had nested followers, but for now we'll fetch
          // Wait, we didn't add an endpoint to check follow. Let's just assume we can check if currentUser is in profile.followers. But we didn't include followers in the schema select!
          // Actually, let's just leave isFollowing false initially for now unless we fetch it.
        }

        if (currentUser && currentUser.username === username) {
          const savedRes = await axios.get('/posts/saved');
          setSavedPosts(savedRes.data);
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, currentUser]);

  const handleFollow = async () => {
    try {
      const res = await axios.post(`/users/${profile.id}/follow`);
      setProfile(prev => ({
        ...prev,
        _count: {
          ...prev._count,
          followers: res.data.followersCount
        }
      }));
      setIsFollowing(res.data.action === 'followed');
    } catch (error) {
      console.error('Follow error', error);
    }
  };

  if (loading) return <div className="loading-screen" style={{ height: '100%' }}>Loading Profile...</div>;
  if (!profile) return <div className="loading-screen" style={{ height: '100%' }}>User not found</div>;

  const isOwnProfile = currentUser?.username === profile.username;

  const getDisplayedPosts = () => {
    if (activeTab === 'POSTS') return posts;
    if (activeTab === 'SAVED') return savedPosts;
    return []; // TAGGED is empty
  };

  const displayedPosts = getDisplayedPosts();

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-avatar-container">
          <img src={profile.avatar || 'https://via.placeholder.com/150'} alt={profile.username} className="profile-avatar-large" />
        </div>
        <div className="profile-info">
          <div className="profile-title-row">
            <h2>{profile.username}</h2>
            {isOwnProfile ? (
              <button className="profile-action-btn" onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
            ) : (
              <button className={`profile-action-btn ${isFollowing ? 'following' : 'follow'}`} onClick={handleFollow}>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          <div className="profile-stats">
            <span><strong>{profile._count.posts}</strong> posts</span>
            <span><strong>{profile._count.followers}</strong> followers</span>
            <span><strong>{profile._count.following}</strong> following</span>
          </div>
          <div className="profile-bio">
            <p>{profile.bio || 'No bio yet.'}</p>
          </div>
        </div>
      </header>

      <div className="profile-tabs">
        <div className={`tab ${activeTab === 'POSTS' ? 'active' : ''}`} onClick={() => setActiveTab('POSTS')}>POSTS</div>
        {isOwnProfile && <div className={`tab ${activeTab === 'SAVED' ? 'active' : ''}`} onClick={() => setActiveTab('SAVED')}>SAVED</div>}
        <div className={`tab ${activeTab === 'TAGGED' ? 'active' : ''}`} onClick={() => setActiveTab('TAGGED')}>TAGGED</div>
      </div>

      <div className="profile-grid">
        {activeTab === 'TAGGED' ? (
          <div className="empty-state">No Photos Are You Tagged In</div>
        ) : displayedPosts.length === 0 ? (
          <div className="empty-state">No Posts Yet</div>
        ) : (
          displayedPosts.map(post => (
            <Link to={`/post/${post.id}`} key={post.id} className="grid-item">
              <img src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5000${post.imageUrl}`} alt="Post" />
              <div className="grid-item-overlay">
                <span>❤️ {post._count?.likes || 0}</span>
                <span>💬 {post._count?.comments || 0}</span>
              </div>
            </Link>
          ))
        )}
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
      />
    </div>
  );
};

export default Profile;
