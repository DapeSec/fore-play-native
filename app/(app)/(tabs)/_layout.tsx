import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].secondary,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="tee-times"
        options={{
          title: 'Tee Times',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Add Date',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add' : 'add-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="availability"
        options={{
          title: 'Availability',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'thumbs-up' : 'thumbs-up-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sign-out"
        options={{
          title: 'Sign Out',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'close' : 'close-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
