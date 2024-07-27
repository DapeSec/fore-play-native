import { Alert, Button, Image, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { forePlayClient, ADD_PROPOSAL } from '@/components/ForePlayAPI'
import { serializeDateToEpoch } from '@/components/SerializeDateTime';

import { Colors } from '@/constants/Colors';

import DateTimePicker from '@react-native-community/datetimepicker';
import { ApolloProvider, useMutation } from '@apollo/client';

import { useSession } from '@/components/OktaLogin';
import { jwtDecode } from "jwt-decode";

function AddProposal() {
  const [mutateFunction, { loading, error, data }] = useMutation(ADD_PROPOSAL);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showAddDateButton, setShowAddDateButton] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showSelectedDate, setShowSelectedDate] = useState(false);

  const { session } = useSession();
  const userID = extractUsernameFromIdToken(session);

  function extractUsernameFromIdToken(idToken) {
    try {
      const decodedToken = jwtDecode(idToken);
      const userID = decodedToken.sub;
      return userID;
    } catch (error) {
      console.error('Error extracting username from ID token:', error);
      return null; // Or handle the error appropriately
    }
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Only show on iOS after picking a date
    setDate(currentDate);
    setShowSubmitButton(true); // Show submit button after selecting a date
    setShowSelectedDate(true); // Show selected date on Android
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    setShowAddDateButton(false); // Hide the button after first click
  };

  const handleDatePress = () => {
    setShow(true); // Show date picker on Android when selected date is pressed
  };


  const handleSubmit = async () => {
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    if (date < sevenDaysLater) {
      Alert.alert('Invalid Date', 'Please select a date at least 7 days in the future.');
      return;
    }

    try {
      const { data } = await mutateFunction({ variables: { userId: userID, proposalDate: serializeDateToEpoch(date) } });
      console.log('Mutation successful:', data);
      createSubmitConfirmationAlert();
      // Handle successful mutation, e.g., clear form, show success message
    } catch (error) {
      console.error('Mutation error:', error);
      // Handle mutation errors, e.g., display error message to the user
    }
  };

  const createProposalAlert = () =>
    Alert.alert('Submit Proposal', 'Create proposal for selected date?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleSubmit()},
    ]);
  
  const createSubmitConfirmationAlert = () =>
    Alert.alert('Proposal Submitted', 'Please confirm your availability.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

    return (
      <ThemedView style={styles.eventContainer}>
        {showAddDateButton && (
          <Button
            title="Add Date"
            onPress={showDatepicker}
          />
        )}
        {show ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            //mode={mode}
            is24Hour={true} // Or false if you want 12-hour format
            display="default"
            onChange={onChange}
          />
        ) : showSelectedDate ? (
          <Button
            title={date.toLocaleDateString()}
            onPress={handleDatePress}
          />
        ) : null}
        {showSubmitButton && (
          <Button
            title="Submit"
            onPress={() => {
              createProposalAlert();
            }}
          />
        )}
      </ThemedView>
    );
  }
  
  

export default function EventScreen() {

  return (
    <ApolloProvider client={forePlayClient}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/gemini-golf.png')}
            style={styles.golfBackground}
          />
        }>
        <AddProposal/>
      </ParallaxScrollView>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  golfBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    backgroundColor: Colors.dark.background,
  },
});