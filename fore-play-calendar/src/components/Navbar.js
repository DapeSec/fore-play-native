import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const profilePicture = localStorage.getItem('profilePicture');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePicture');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/calendar">Fore Play</Link>
      </div>
      <div className="navbar-menu">
        {token && (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
            {profilePicture && (
              <img src={`http://localhost:5000/${profilePicture}`} alt="Profile" className="profile-picture" />
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
