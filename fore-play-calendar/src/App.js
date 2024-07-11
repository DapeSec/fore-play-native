import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CalendarPage from './components/CalendarPage';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
