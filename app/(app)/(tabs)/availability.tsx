import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlashList } from "@shopify/flash-list"

export default function HomeScreen() {
  const DATA = [
    {
      title: "First Item",
    },
    {
      title: "Second Item",
    },
  ];
  
  const MyList = () => {
    return (
      <FlashList
        data={DATA}
        renderItem={({ item }) => <ThemedText>{item.title}</ThemedText>}
        estimatedItemSize={10}
      />
    );
  };

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
        <ThemedText type="title">Confirm Your Availability</ThemedText>
      </ThemedView>
      <ThemedView style={styles.availabilityContainer}>
        <ThemedText>TODO</ThemedText>
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