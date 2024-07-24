import { Alert, Button, Image, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { forePlayClient, ADD_PROPOSAL } from '@/components/ForePlayAPI'
import { serializeDateToEpoch } from '@/components/SerializeDateTime';

import { Colors } from '@/constants/Colors';

import DateTimePicker from '@react-native-community/datetimepicker';
import { ApolloProvider, useMutation } from '@apollo/client';

function AddProposal() {
  const [mutateFunction, { loading, error, data }] = useMutation(ADD_PROPOSAL);

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

  const handleSubmit = async () => {
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    if (date < sevenDaysLater) {
      Alert.alert('Invalid Date', 'Please select a date at least 7 days in the future.');
      return;
    }

    try {
      const { data } = await mutateFunction({ variables: { userId: "1", proposalDate: serializeDateToEpoch(date) } });
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