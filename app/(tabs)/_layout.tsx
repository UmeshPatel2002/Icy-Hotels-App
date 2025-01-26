import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '@/constants/server';
import { setHotels, setSearchLoader } from '@/redux/reducers/hotelSlice';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch=useDispatch();
 

   const fetchHotelsSearch = async () => {
      dispatch(setSearchLoader(true));
      try {
        const res = await axios.get(`${baseUrl}/hotels/hotels-by-city`, {
          params: { qs: "Agra" },
        });
        if (res.status === 200) {
          dispatch(setHotels(res.data));

        }
      } catch (error) {
        dispatch(setHotels([]));

        console.error("Error fetching hotels without:", error);
      } finally {
        dispatch(setSearchLoader(false));

      }
    };

  const handleHomeTabPress = () => {
    console.log('Navigating to Home');
    router.push('/home'); // Navigate to the Home screen
  };

  const handleExploreTabPress = () => {
    console.log('Navigating to Explore');
    fetchHotelsSearch();
    setTimeout(()=>{
      router.push('/explore'); 
    },100)
   // Navigate to the Explore screen
  };

  const handleProfileTabPress = () => {
    console.log('Navigating to Profile');
    router.push('/profile'); // Navigate to the Profile screen
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#bdbdbd',
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="home" color={color} />,
          tabBarButton: (props) => (
            <HapticTab {...props} customOnPress={handleHomeTabPress} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="explore" color={color} />,
          tabBarButton: (props) => (
            <HapticTab {...props} customOnPress={handleExploreTabPress} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="user" color={color} />,
          tabBarButton: (props) => (
            <HapticTab {...props} customOnPress={handleProfileTabPress} />
          ),
        }}
      />
    </Tabs>
  );
}
