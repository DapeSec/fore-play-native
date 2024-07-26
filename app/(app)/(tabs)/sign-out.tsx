import { Button, Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';

import { Colors } from '@/constants/Colors';

import { useSession } from '../../../components/OktaLogin';

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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    backgroundColor: Colors.dark.background,
  },
});