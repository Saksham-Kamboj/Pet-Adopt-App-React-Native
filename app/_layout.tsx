import React from 'react'
import * as SecureStore from 'expo-secure-store'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { ClerkProvider } from '@clerk/clerk-expo'

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (error) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

function RootLayout() {
  const [fontsLoaded] = useFonts({
    "outfit": require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  })

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set the appropriate EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    )
  }

  if (!fontsLoaded) {
    return null
  }
  console.log("Using key:", publishableKey);

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  )
}

export default RootLayout
