import { Alert, Button, FlatList, Image, RefreshControl, StyleSheet, Platform} from 'react-native';
import React, { useRef, useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { forePlayClient, GET_PROPOSALS, CREATE_APPROVAL} from '@/components/ForePlayAPI'
import { deserializeEpochTime, deserializeEpochTimeCalendar } from '@/components/SerializeDateTime'

import { Colors } from '@/constants/Colors';

import { ApolloProvider, useQuery, useMutation } from '@apollo/client';

import { useSession } from '@/components/OktaLogin';
import { jwtDecode } from "jwt-decode";

const ResultsList = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_PROPOSALS);
  const [submitApprove] = useMutation(CREATE_APPROVAL);
  const [submitDeny] = useMutation(CREATE_APPROVAL);

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

  const createApproveAlert = (approverId, golfDate) =>
    Alert.alert('Approve Availability', 'Approve availability for selected date?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleApprove(approverId, golfDate)},
    ]);

  const createDenyAlert = (approverId, golfDate) =>
    Alert.alert('Deny Availability', 'Deny availability for selected date?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => handleDeny(approverId, golfDate)},
    ]);

  const handleApprove = async (approverId, golfDate) => {

    const createApprovalConfirmationAlert = () =>
      Alert.alert('Approval Submitted', 'Approval succesfully submitted.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);

    try {
      // Execute the mutation with item data
      const { data } = await submitApprove({
        variables: {
          userId: approverId,
          approvalDate: golfDate,
          approval: true,
        },
      });

      console.log('Approval successful:', data);
      createApprovalConfirmationAlert();
      // Update selected items state to reflect approval
      setSelectedItems((prevItems) => prevItems.filter((item) => item !== golfDate));
    } catch (error) {
      console.error('Error approving item:', error);
      // Handle errors appropriately (e.g., display an error message)
    }
  };

  const handleDeny = async (approverId, golfDate) => {

    const createDenyConfirmationAlert = () =>
      Alert.alert('Deny Submitted', 'Deny succesfully submitted.', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);

    try {
      // Execute the mutation with item data
      const { data } = await submitDeny({
        variables: {
          userId: approverId,
          approvalDate: golfDate,
          approval: false,
        },
      });

      console.log('Deny successful:', data);
      createDenyConfirmationAlert();
      // Update selected items state to reflect deny
      setSelectedItems((prevItems) => prevItems.filter((item) => item !== golfDate));
    } catch (error) {
      console.error('Error denying item:', error);
      // Handle errors appropriately (e.g., display an error message)
    }
  };

  const renderItem = ({ item }) => (
    <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
      <ThemedText>{deserializeEpochTime(item.proposalDate)}</ThemedText>
      <ThemedView style={{ flexDirection: 'row' }}>
        <Button title="Approve" onPress={() => createApproveAlert(userID, item.proposalDate)} disabled={false} />
        <Button title="Deny" onPress={() => createDenyAlert(userID, item.proposalDate)} disabled={false} />
      </ThemedView>
    </ThemedView>
  );

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

  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

   // Filter proposals first
   const filteredProposals = data.proposals.filter(
    (proposal) => deserializeEpochTimeCalendar(proposal.proposalDate) >= today
  );

  // Then sort the filtered proposals
  const sortedProposals = filteredProposals.sort((a, b) => {
    return a.proposalDate - b.proposalDate;
  });

  return (
    <FlatList
      data={sortedProposals}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

export default function AvailabilityScreen() {

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
      </ParallaxScrollView>
      <ResultsList/>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({

  availabilityContainer: {
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