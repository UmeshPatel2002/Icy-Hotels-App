
import { Stack } from 'expo-router';

import 'react-native-reanimated';

export default function RootLayout() {


  return (
  
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="booking" />
       
      </Stack>
     

  );
}
