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
    "Nunito-Black": require('../assets/fonts/Nunito-Black.ttf'),
    "Nunito-BlackItalic": require('../assets/fonts/Nunito-BlackItalic.ttf'),
    "Nunito-Bold": require('../assets/fonts/Nunito-Bold.ttf'),
    "Nunito-BoldItalic": require('../assets/fonts/Nunito-BoldItalic.ttf'),
    "Nunito-ExtraBold": require('../assets/fonts/Nunito-ExtraBold.ttf'),
    "Nunito-ExtraBoldItalic": require('../assets/fonts/Nunito-ExtraBoldItalic.ttf'),
    "Nunito-ExtraLight": require('../assets/fonts/Nunito-ExtraLight.ttf'),
    "Nunito-ExtraLightItalic": require('../assets/fonts/Nunito-ExtraLightItalic.ttf'),
    "Nunito-Italic": require('../assets/fonts/Nunito-Italic.ttf'),
    "Nunito-Light": require('../assets/fonts/Nunito-Light.ttf'),
    "Nunito-LightItalic": require('../assets/fonts/Nunito-LightItalic.ttf'),
    "Nunito-Medium": require('../assets/fonts/Nunito-Medium.ttf'),
    "Nunito-MediumItalic": require('../assets/fonts/Nunito-MediumItalic.ttf'),
    "Nunito-Regular": require('../assets/fonts/Nunito-Regular.ttf'),
    "Nunito-SemiBold": require('../assets/fonts/Nunito-SemiBold.ttf'),
    "Nunito-SemiBoldItalic": require('../assets/fonts/Nunito-SemiBoldItalic.ttf'),

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
