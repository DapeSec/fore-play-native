import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const profilePicture = localStorage.getItem('profilePicture');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profilePicture');
    navigate('/login');
  };

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: '10px 20px',
    flexWrap: 'wrap' // Ensure items wrap to new lines if needed
  };

  const navbarBrandStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    marginRight: 'auto' // Ensure it stays on the left
  };

  const navbarMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap' // Allow menu items to wrap
  };

  const linkButtonStyle = {
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const profilePictureStyle = {
    borderRadius: '50%',
    width: '40px',
    height: '40px'
  };

  return (
    <nav style={navbarStyle}>
      <div style={navbarBrandStyle}>
        <Link to="/calendar" style={{ color: 'white', textDecoration: 'none' }}>Fore Play</Link>
      </div>
      <div style={navbarMenuStyle}>
        {token && (
          <>
            <Link to="/profile" style={linkButtonStyle}>Profile</Link>
            <button onClick={handleLogout} style={linkButtonStyle}>Logout</button>
            {profilePicture && (
              <img src={`http://localhost:5000/${profilePicture}`} alt="Profile" style={profilePictureStyle} />
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
