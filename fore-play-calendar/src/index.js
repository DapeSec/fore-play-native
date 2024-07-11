import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import LoginPage from './components/LoginPage';
import CalendarPage from './components/CalendarPage';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<CalendarPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
