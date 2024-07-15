import { Button, Image, StyleSheet, View, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';

import { Calendar, DateObject } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';


WebBrowser.maybeCompleteAuthSession();


export default function HomeScreen() {
  // Endpoint
  const discovery = useAutoDiscovery('https://dev-21624059.okta.com/oauth2/default');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '0oai9j6z6wJowU9QQ5d7',
      scopes: ['openid', 'profile'],
      redirectUri: makeRedirectUri({
        native: 'http://localhost:8081/',
      }),
    },
    discovery
  );
  // Calendar
  const [selectedDate, setSelectedDate] = useState<DateObject>({});
  const handleDateChange = (event, date) => {
     if (date) {
       setSelectedDate({ [date.toISOString().split('T')[0]]: { selected: true } });
     }
   };

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/golf-banner.jpeg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Fore Play</ThemedText>
      </ThemedView>
      <ThemedView style={styles.loginContainer}>
        <Button
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync();
          }}
        />
      </ThemedView>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginContainer: {
    gap: 8,
    marginBottom: 8,
  },
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
