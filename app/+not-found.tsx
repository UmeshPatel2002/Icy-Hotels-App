import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <View style={styles.linkContainer}>
          <Link href="/" asChild>
            <Text style={styles.linkText}>
              Go to home screen!
            </Text>
          </Link>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  linkContainer: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    color: '#007AFF', // Use a link-like color
    fontSize: 16,
    textDecorationLine: 'underline', // Make it visually distinct as a link
  },
});
