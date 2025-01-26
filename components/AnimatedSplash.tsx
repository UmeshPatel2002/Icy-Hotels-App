import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

const { width } = Dimensions.get("window");

SplashScreen.preventAutoHideAsync();

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onAnimationFinish,
}) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) });
      scale.value = withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.ease) });

      setTimeout(() => {
        SplashScreen.hideAsync();
        onAnimationFinish();
      }, 1000);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/icon.png")} // Replace with your icon path
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Match splash background color
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
  },
});

export default AnimatedSplashScreen;
