import { Button, Image, StyleSheet, Text, View, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView'

import { Colors } from '@/constants/Colors';

import { useSession } from '../components/OktaLogin';


export default function HomeScreen() {
  const { signIn } = useSession();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/gemini-golf.png')}
          style={styles.golfBackground}
        />
      }>
      <ThemedView style={styles.loginContainer}>
        <Button
          title="Sign In"
          onPress={() => {
            signIn();   
        }}/>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
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
