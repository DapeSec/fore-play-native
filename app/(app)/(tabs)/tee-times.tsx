import { Image, StyleSheet, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Calendar, DateObject } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';

export default function TeeTimesScreen() {
  // Calendar
  const [selectedDate, setSelectedDate] = useState<DateObject>({});
  const handleDateChange = (event, date) => {
     if (date) {
       setSelectedDate({ [date.toISOString().split('T')[0]]: { selected: true } });
     }
   };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.calendarContainer}>
        <Calendar
          current={new Date()}
          markedDates={selectedDate}
          onDayPress={(day) => setSelectedDate({ [day.dateString]: { selected: true } })}
        />
        <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute'
  },
});
