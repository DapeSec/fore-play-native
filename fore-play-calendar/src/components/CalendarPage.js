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
  const [activeStartDate, setActiveStartDate] = useState(new Date());

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

    const fetchAvailability = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-availability');
        const availabilityData = response.data.reduce((acc, item) => {
          acc[item.date] = item.users.length === 4 ? 'available' : item.users;
          return acc;
        }, {});
        setAvailability(availabilityData);
      } catch (error) {
        console.log('Failed to fetch availability:', error);
      }
    };

    if (userId) {
      fetchProfile();
    }
    fetchAvailability();
  }, []);

  const onDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const onActiveStartDateChange = ({ activeStartDate }) => {
    setActiveStartDate(activeStartDate);
  };

  const handleDayClick = async (value) => {
    const userId = localStorage.getItem('userId');
    const dateKey = value.toDateString();
    const updatedAvailability = { ...availability };

    // If the date is marked as "Book Me!", do nothing
    if (updatedAvailability[dateKey] === 'available') {
      return;
    }

    if (!updatedAvailability[dateKey]) {
      updatedAvailability[dateKey] = [];
    }

    if (updatedAvailability[dateKey].some(user => user._id === userId)) {
      updatedAvailability[dateKey] = updatedAvailability[dateKey].filter(user => user._id !== userId);
    } else {
      if (updatedAvailability[dateKey].length < 4) {
        updatedAvailability[dateKey].push({ _id: userId, profilePicture });
        // Add splash animation
        const dayElement = document.querySelector(`[aria-label="${dateKey}"]`);
        if (dayElement) {
          dayElement.classList.add('splash');
          // Remove splash animation after it finishes
          setTimeout(() => {
            dayElement.classList.remove('splash');
          }, 600);
        }
      }
    }

    // Highlight the day if four users have selected it
    if (updatedAvailability[dateKey].length === 4) {
      updatedAvailability[dateKey] = 'available';
    }

    setAvailability(updatedAvailability);

    // Save the updated availability to the server
    try {
      await axios.post('http://localhost:5000/select-date', { userId, date: dateKey, availability: updatedAvailability[dateKey] });
    } catch (error) {
      console.log('Failed to update date selection:', error);
    }
  };

  const renderAvailability = (date) => {
    const dateKey = date.toDateString();
    const users = availability[dateKey];

    if (users === 'available') {
      return <div className="availability green">Book Me!</div>;
    }

    return (
      <>
        <div className={`date-number ${users && users.length > 0 ? 'with-pictures' : ''}`}>
          {date.getDate()}
        </div>
        {users && users !== 'available' && users.map((user, index) => (
          <img
            key={user._id}
            src={`http://localhost:5000/${user.profilePicture}`}
            alt="Profile"
            className={`profile-picture corner-${index + 1}`}
          />
        ))}
      </>
    );
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return date.getMonth() !== activeStartDate.getMonth() || date.getFullYear() !== activeStartDate.getFullYear();
    }
    return false;
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
            onClickDay={handleDayClick}
            tileDisabled={tileDisabled}
            onActiveStartDateChange={onActiveStartDateChange}
            className="custom-calendar"
            locale="en-US"
            tileClassName={({ date, view }) => {
              const dateKey = date.toDateString();
              if (view === 'month' && availability[dateKey] === 'available') {
                return 'react-calendar__tile--highlighted';
              }
              return null;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
