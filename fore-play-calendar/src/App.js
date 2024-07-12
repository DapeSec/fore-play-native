import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CalendarPage from './components/CalendarPage';
import ProfilePage from './components/ProfilePage';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("Token at initial load:", storedToken);
    setToken(storedToken);
  }, []);

  console.log("Token during render:", token);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={token ? <CalendarPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/calendar" : "/login"} />} />
        <Route path="*" element={<Navigate to={token ? "/calendar" : "/login"} />} />
      </Routes>
    </>
  );
};

export default App;
