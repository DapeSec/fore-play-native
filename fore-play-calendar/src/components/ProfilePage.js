import React, { useState } from 'react';

const ProfilePage = () => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Add your password update logic here
    alert('Password updated!');
  };

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} disabled />
      </div>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>New Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ProfilePage;
