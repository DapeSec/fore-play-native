import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profilePicture, setProfilePicture] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        console.log('Fetched profile:', response.data);
        if (response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
          localStorage.setItem('profilePicture', response.data.profilePicture); // Ensure the profile picture is saved in local storage
        }
      } catch (error) {
        console.log('Failed to fetch profile:', error);
        setMessage('Failed to fetch profile');
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', userId);

      try {
        const response = await axios.post('http://localhost:5000/upload-profile-picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Profile picture upload response:', response.data);
        if (response.data.profilePicture) {
          localStorage.setItem('profilePicture', response.data.profilePicture);
          setProfilePicture(response.data.profilePicture);
        }

        setMessage('Profile picture updated successfully');
      } catch (error) {
        setMessage(error.response?.data?.error || 'An error occurred');
      }
    } else {
      setMessage('File size should be less than 5MB');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/reset-password', { userId, newPassword });
      setMessage(response.data.message || 'Password updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleCancelPasswordChange = () => {
    setIsEditingPassword(false);
    setNewPassword('');
    setMessage('');
  };

  return (
    <div className="profile-container">
      <div className="profile-panel">
        <h2>Profile Page</h2>
        <p>{localStorage.getItem('username')}</p>
        {profilePicture ? (
          <>
            <img src={`http://localhost:5000/${profilePicture}`} alt="Profile" className="profile-picture" />
            <button className="update-button" onClick={() => setProfilePicture('')}>Change Photo</button>
          </>
        ) : (
          <div className="input-group">
            <label>Profile Picture</label>
            <input type="file" onChange={handlePictureChange} />
          </div>
        )}
        <div className="input-group">
          {isEditingPassword ? (
            <>
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <div className="password-buttons">
                <button className="cancel-button" onClick={handleCancelPasswordChange}>Cancel</button>
                <button className="update-button" onClick={handlePasswordChange}>Update Password</button>
              </div>
            </>
          ) : (
            <button className="update-button" onClick={() => setIsEditingPassword(true)}>Update Password</button>
          )}
        </div>
        {message && <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>}
        <button className="return-button" onClick={() => window.location.href = '/calendar'}>Return to Calendar</button>
      </div>
    </div>
  );
};

export default ProfilePage;
