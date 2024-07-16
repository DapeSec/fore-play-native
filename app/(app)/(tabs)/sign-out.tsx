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
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute'
  },
});