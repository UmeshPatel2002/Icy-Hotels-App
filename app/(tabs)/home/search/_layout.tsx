
import { Stack } from 'expo-router';

import 'react-native-reanimated';




export default function RootLayout() {


  return (
  
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="setDates" />
        <Stack.Screen name="setDestination" />
        <Stack.Screen name="booking" />

      </Stack>
     

  );
}
