
import { Stack } from 'expo-router';

import 'react-native-reanimated';




export default function RootLayout() {
  console.log("booking layout");

  return (
  
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="hotelDescription" />
        <Stack.Screen name="setDatesAvailable" />
        <Stack.Screen name="bookingPayment" />


     


       
      </Stack>
     

  );
}
