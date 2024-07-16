import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlashList } from "@shopify/flash-list"

export default function AvailabilityScreen() {
  const DATA = [
    {
      title: "Proposal: 8/4/24",
    },
    {
      title: "Proposal: 8/11/24",
    },
  ];

  return (
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
        <FlashList
          data={DATA}
          renderItem={({ item }) => <ThemedText>{item.title}</ThemedText>}
          estimatedItemSize={10}
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