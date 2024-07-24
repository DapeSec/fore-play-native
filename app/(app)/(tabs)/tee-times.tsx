import { Image, StyleSheet, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { forePlayClient, GET_PROPOSALS } from '@/components/ForePlayAPI';
import { deserializeEpochTimeCalendar } from '@/components/SerializeDateTime';

import { Colors } from '@/constants/Colors';

import { Calendar, DateObject } from 'react-native-calendars';
import { ApolloProvider, useQuery } from '@apollo/client';

const ResultsList = () => {
  const [selectedDate, setSelectedDate] = useState<DateObject>({});
  const { loading, error, data } = useQuery(GET_PROPOSALS);
  const [availableDatesMap, setAvailableDatesMap] = useState({});

  useEffect(() => {
    if (data) {
      const datesMap = {};
      data.proposals.forEach((proposal) => {
        const proposalDate = proposal.proposalDate; // Access date property

        // Check if epoch time or formatted string (adjust logic based on API)
        if (typeof proposalDate === 'number') {
          const formattedDate = deserializeEpochTimeCalendar(proposalDate);
          datesMap[formattedDate] = { marked: true }; // Use formatted date
        } else {
          datesMap[proposalDate] = { marked: true }; // Use date string directly
        }
      });
      setAvailableDatesMap(datesMap);
    }
  }, [data]);

   // Calendar
   const handleDayPress = (day) => setSelectedDate({ [day.dateString]: { selected: true } });

  if (loading) return <ThemedText>Loading...</ThemedText>;
  if (error) return <ThemedText>Error: {error.message}</ThemedText>;

  return (
    <Calendar 
      current={new Date()}
      markedDates={availableDatesMap} // Use the mapped available dates object
      onDayPress={handleDayPress}
      //style={styles.calendarContainer}
      theme={{
        backgroundColor: Colors.dark.background,
        calendarBackground: Colors.light.background,
        todayTextColor: Colors.light.text,
        todayBackgroundColor: Colors.light.secondary,
        selectedDayTextColor: Colors.light.text,
        selectedDayBackgroundColor: Colors.light.secondary,
        dotColor: Colors.light.primary,
        selectedDotColor: Colors.light.secondary,
        arrowColor: Colors.light.primary
      }}
    />
  );
};

export default function TeeTimesScreen() {

  return (
    <ApolloProvider client={forePlayClient}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/gemini-golf.png')}
            style={styles.golfBackground}
          />}
      >
        <ThemedView style={styles.calendarContainer}>
          <ResultsList/>
        </ThemedView>
      </ParallaxScrollView>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: Colors.light.background,
  },  
  golfBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    backgroundColor: Colors.dark.background,
  },
});