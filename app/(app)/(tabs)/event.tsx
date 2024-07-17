import { Alert, Button, Image, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://fore-play-api-1eac9c288716.herokuapp.com/graphql',
  cache: new InMemoryCache()
});

const GET_PROPOSALS = gql`
  query GetProposals {
    proposals {
      id
      proposalDate
      userId
    }
  }
`;

export default function EventScreen() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    //setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    //setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  async function fetchAddEvent() {
    const response = await fetch('/add-event');
    const data = await response.json();
    createSubmitConfirmationAlert();
  }

  const createProposalAlert = () =>
    Alert.alert('Submit Proposal', 'Create proposal for selected date?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      //{text: 'OK', onPress: () => fetchAddEvent()},
      {text: 'OK', onPress: () => createSubmitConfirmationAlert()},
    ]);

  const createSubmitConfirmationAlert = () =>
    Alert.alert('Proposal Submitted', 'Please confirm your availability.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  return (
    <ApolloProvider client={client}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Propose Tee Time</ThemedText>
        </ThemedView>
        <ThemedView style={styles.eventContainer}>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              //mode={mode}
              display="spinner"
              onChange={onChange}
            />
          )}
          <Button
            title="Submit"
            onPress={() => {
              createProposalAlert();
            }}
          />
        </ThemedView>
      </ParallaxScrollView>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});