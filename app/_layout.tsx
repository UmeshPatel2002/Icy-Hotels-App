import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useColorScheme } from "@/hooks/useColorScheme";
import store, { persistor } from "@/redux/store";
import AnimatedSplashScreen from "@/components/AnimatedSplash";


// Prevent the static splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isSplashVisible, setSplashVisible] = useState(true);

  const [loaded] = useFonts({
    "Poppins-Black": require('../assets/fonts/Poppins-Black.ttf'),
    "Poppins-BlackItalic": require('../assets/fonts/Poppins-BlackItalic.ttf'),
    "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
    "Poppins-BoldItalic": require('../assets/fonts/Poppins-BoldItalic.ttf'),
    "Poppins-ExtraBold": require('../assets/fonts/Poppins-ExtraBold.ttf'),
    "Poppins-ExtraBoldItalic": require('../assets/fonts/Poppins-ExtraBoldItalic.ttf'),
    "Poppins-ExtraLight": require('../assets/fonts/Poppins-ExtraLight.ttf'),
    "Poppins-ExtraLightItalic": require('../assets/fonts/Poppins-ExtraLightItalic.ttf'),
    "Poppins-Italic": require('../assets/fonts/Poppins-Italic.ttf'),
    "Poppins-Light": require('../assets/fonts/Poppins-Light.ttf'),
    "Poppins-LightItalic": require('../assets/fonts/Poppins-LightItalic.ttf'),
    "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
    "Poppins-MediumItalic": require('../assets/fonts/Poppins-MediumItalic.ttf'),
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
    "Poppins-SemiBold": require('../assets/fonts/Poppins-SemiBold.ttf'),
    "Poppins-SemiBoldItalic": require('../assets/fonts/Poppins-SemiBoldItalic.ttf'),
    "Poppins-Thin": require('../assets/fonts/Poppins-Thin.ttf'),
    "Poppins-ThinItalic": require('../assets/fonts/Poppins-ThinItalic.ttf'),

  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hides the native splash screen after fonts are loaded
    }
  }, [loaded]);

  const handleAnimationFinish = () => {
    setSplashVisible(false); // Hides the animated splash screen
  };

  if (!loaded || isSplashVisible) {
    return <AnimatedSplashScreen onAnimationFinish={handleAnimationFinish} />;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar backgroundColor="#ffb000" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
