import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ profilePicture }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/calendar" className="navbar-logo">Fore Play</Link>
        {token && (
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/profile" className="navbar-link">Profile</Link>
            </li>
            <li className="navbar-item">
              <button className="navbar-link navbar-button" onClick={handleLogout}>Logout</button>
            </li>
            {profilePicture && (
              <li className="navbar-item">
                <img src={`http://localhost:5000/${profilePicture}`} alt="Profile" className="navbar-profile-picture" />
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
