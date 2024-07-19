import { router } from 'expo-router';

import { Button, Image, StyleSheet, Text, View, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';

import { useSession } from '../ctx';


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
              // Navigate after signing in. You may want to tweak this to ensure sign-in is
              // successful before navigating.
              router.replace('/tee-times');   
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
    width: '100%', // Set image width to 100% of the container
    height: '100%', // Set image height to 100% of the container
    resizeMode: 'cover', // Scale image to cover the entire container
    position: 'absolute',
    top: 50,
  },
});
