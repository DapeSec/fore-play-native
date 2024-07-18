import { Button, Image, StyleSheet, FlatList, Platform} from 'react-native';
import React, { useState } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';

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

const ResultsList = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const { loading, error, data } = useQuery(GET_PROPOSALS);

  const handleApprove = (itemId) => {
    // Implement your approval logic here
    // This could involve making a mutation to update the data
    // Ensure proper authorization and security measures are in place
    console.log('Approved item:', itemId);
    setSelectedItems((prevItems) => prevItems.filter((item) => item !== itemId));
  };

  const handleDeny = (itemId) => {
    // Implement your denial logic here
    // This could involve making a mutation to update the data
    // Ensure proper authorization and security measures are in place
    console.log('Denied item:', itemId);
    setSelectedItems((prevItems) => prevItems.filter((item) => item !== itemId));
  };

  const renderItem = ({ item }) => (
    <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
      <ThemedText>{item.proposalDate}</ThemedText>
      <ThemedView style={{ flexDirection: 'row' }}>
        <Button title="Approve" onPress={() => handleApprove(item.id)} disabled={selectedItems.includes(item.id)} />
        <Button title="Deny" onPress={() => handleDeny(item.id)} disabled={selectedItems.includes(item.id)} style={{ marginLeft: 10 }} />
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
    <ApolloProvider client={client}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
      </ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Confirm Availability</ThemedText>
        </ThemedView>
      <ResultsList/>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  availabilityContainer: {
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