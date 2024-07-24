import { Button, Image, StyleSheet, FlatList, Platform} from 'react-native';
import React, { useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { forePlayClient, GET_PROPOSALS, CREATE_APPROVAL} from '@/components/ForePlayAPI'
import { deserializeEpochTime } from '@/components/SerializeDateTime'

import { Colors } from '@/constants/Colors';

import { ApolloProvider, useQuery, useMutation } from '@apollo/client';

const ResultsList = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const { loading, error, data } = useQuery(GET_PROPOSALS);
  const [submitApprove] = useMutation(CREATE_APPROVAL);
  const [submitDeny] = useMutation(CREATE_APPROVAL);

  const handleApprove = async (approverId, golfDate) => {

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
      // Update selected items state to reflect approval
      setSelectedItems((prevItems) => prevItems.filter((item) => item !== golfDate));
    } catch (error) {
      console.error('Error approving item:', error);
      // Handle errors appropriately (e.g., display an error message)
    }
  };

  const handleDeny = async (approverId, golfDate) => {

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
        <Button title="Approve" onPress={() => handleApprove("1", item.proposalDate)} disabled={selectedItems.includes(item.id)} />
        <Button title="Deny" onPress={() => handleDeny("1", item.proposalDate)} disabled={selectedItems.includes(item.id)} style={{ marginLeft: 10 }} />
      </ThemedView>
    </ThemedView>
  );

  if (loading) return <ThemedText>Loading...</ThemedText>;
  if (error) return <ThemedText>Error: {error.message}</ThemedText>;

  return (
    <FlatList
      data={data.proposals}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
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