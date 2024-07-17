import { Image, StyleSheet, Text, Platform } from 'react-native';

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

function GetProposals() {
  const { loading, error, data } = useQuery(GET_PROPOSALS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    data.proposals.map((proposal) => (
      <Text>{proposal.proposalDate}</Text>
    ))
  );
}

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
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Confirm Your Availability</ThemedText>
        </ThemedView>
        <ThemedView style={styles.availabilityContainer}>
          <Text>
            <GetProposals />
          </Text>
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