import { Image, RefreshControl, StyleSheet, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { forePlayClient, GET_APPROVED } from '@/components/ForePlayAPI';
import { deserializeEpochTimeCalendar } from '@/components/SerializeDateTime';

import { Colors } from '@/constants/Colors';

import { Calendar, DateObject } from 'react-native-calendars';
import { ApolloProvider, useQuery } from '@apollo/client';

const ResultsList = () => {
  const [selectedDate, setSelectedDate] = useState<DateObject>({});
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error , data, refetch } = useQuery(GET_APPROVED);
  const [availableDatesMap, setAvailableDatesMap] = useState({});

  useEffect(() => {
    if (data) {
      const datesMap = {};
      data.approvalsApproved.forEach((approvalsApproved) => {
        const approvalDate = approvalsApproved.approvalDate; // Access date property

        // Check if epoch time or formatted string (adjust logic based on API)
        const formattedDate = typeof approvalDate === 'number'
          ? deserializeEpochTimeCalendar(approvalDate)
          : approvalDate;

        datesMap[formattedDate] = (datesMap[formattedDate] || 0) + 1;
      });

      // Filter dates with 4 or more approvals
      const filteredDatesMap = Object.keys(datesMap)
        .filter(date => datesMap[date] >= 4)
        .reduce((acc, date) => ({ ...acc, [date]: { selected: true } }), {});

      setAvailableDatesMap(filteredDatesMap);
    }
  }, [data]);

   // Calendar
   //const handleDayPress = (day) => setSelectedDate({ [day.dateString]: { selected: true } });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch(); // Call refetch on pull down
      console.log('Data refreshed successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors appropriately (e.g., display an error message)
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <ThemedText>Loading...</ThemedText>;
  if (error) return <ThemedText>Error: {error.message}</ThemedText>;

  return (
    <Calendar 
      current={new Date()}
      markedDates={availableDatesMap} // Use the mapped available dates object
      onDayPress={handleRefresh}
      onMonthChange={handleRefresh}
      //style={styles.calendarContainer}
      theme={{
        backgroundColor: Colors.dark.background,
        calendarBackground: Colors.light.background,
        todayTextColor: Colors.light.text,
        todayBackgroundColor: Colors.light.secondary,
        selectedDayTextColor: Colors.light.text,
        selectedDayBackgroundColor: Colors.light.tint,
        arrowColor: Colors.light.primary,
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
      </ParallaxScrollView>
      <ThemedView style={styles.calendarContainer}>
          <ResultsList/>
      </ThemedView>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
    height: '100%',
    flex: 2,
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