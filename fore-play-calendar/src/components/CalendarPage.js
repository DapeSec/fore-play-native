import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css'; // Import the custom CSS file

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState({});

  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const toggleAvailability = (date) => {
    setAvailability((prev) => ({
      ...prev,
      [date]: prev[date] === 'available' ? 'busy' : 'available',
    }));
  };

  const renderAvailability = (date) => {
    const status = availability[date.toDateString()];
    return (
      <div className={`availability ${status}`}>
        {status === 'available' ? 'Available' : status === 'busy' ? 'Busy' : ''}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="overlay"></div>
      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="title">Fore Play Boys Availability</h2>
        </div>
        <div className="calendar-wrapper">
          <Calendar
            onChange={onDateChange}
            value={date}
            tileContent={({ date }) => renderAvailability(date)}
            onClickDay={(value) => toggleAvailability(value)}
            className="custom-calendar"
            locale="en-US" // Add this line to set the calendar locale to US (starts week on Sunday)
          />
        </div>
      </div>
    </>
  );
};

const Navbar = () => {
  const handleLogout = () => {
    // Implement your logout logic here
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">Fore Play</a>
        <ul className="navbar-menu">
          <li className="navbar-item"><a href="/profile" className="navbar-link">Profile</a></li>
          <li className="navbar-item"><button className="navbar-link navbar-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default CalendarPage;
