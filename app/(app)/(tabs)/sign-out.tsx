import { Button, Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';

import { useSession } from '../../../ctx';

export default function SignOutScreen() {
  const { signOut } = useSession();
  
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/gemini-golf.png')}
            style={styles.golfBackground}
          />
        }>
        <ThemedView style={styles.signoutContainer}>
          <Button
            title="Sign Out"
            onPress={() => {
              signOut();
            }}
          />
        </ThemedView>
      </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  signoutContainer: {
    gap: 8,
    marginBottom: 8,
  },
  golfBackground: {
    width: '100%', // Set image width to 100% of the container
    height: '100%', // Set image height to 100% of the container
    resizeMode: 'cover', // Scale image to cover the entire container
    position: 'absolute',
    top: 50,
  },
});