import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css';
import Navbar from './Navbar';
import axios from 'axios';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        setProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.log('Failed to fetch profile:', error);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, []);

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
      <Navbar profilePicture={profilePicture} />
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
            locale="en-US"
          />
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
