import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        setUsername(response.data.username);
        setProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', userId);

      try {
        const response = await axios.post('http://localhost:5000/upload-profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setProfilePicture(response.data.profilePicture);
        setMessage('Profile picture updated successfully.');
      } catch (error) {
        setMessage('An error occurred while updating your profile.');
        console.error('Profile picture upload error:', error);
      }
    } else {
      setMessage('File size exceeds the limit of 5MB.');
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/reset-password', { userId, newPassword });
      setMessage('Password updated successfully.');
    } catch (error) {
      setMessage('An error occurred while updating your password.');
      console.error('Password update error:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-panel">
        <h2>Profile Page</h2>
        <p>{username}</p>
        {profilePicture ? (
          <>
            <img src={`http://localhost:5000/${profilePicture}`} alt="Profile" className="profile-preview" />
            <button className="update-button" onClick={() => document.getElementById('file-input').click()}>Change Photo</button>
          </>
        ) : (
          <div className="input-group">
            <label>Profile Picture</label>
            <input type="file" id="file-input" onChange={handlePictureChange} />
          </div>
        )}
        <div className="centered-button">
          <button className="update-button" onClick={() => setIsUpdatingPassword(true)}>Update Password</button>
        </div>
        {isUpdatingPassword && (
          <>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="password-buttons">
              <button className="cancel-button" onClick={() => setIsUpdatingPassword(false)}>Cancel</button>
              <button className="update-button" onClick={handlePasswordUpdate}>Update Password</button>
            </div>
          </>
        )}
        <p>{message}</p>
        <button className="return-button" onClick={() => window.location.href = '/calendar'}>Return to Calendar</button>
      </div>
    </div>
  );
};

export default ProfilePage;
