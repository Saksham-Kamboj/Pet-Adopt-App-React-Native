import { View, Text, Image, Pressable } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Colors from '@/constants/Colors';
import * as WebBrowser from 'expo-web-browser'
import { useAuth, useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router';

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
      void WebBrowser.warmUpAsync();
      return () => {
        void WebBrowser.coolDownAsync();
      };
    }, [])
  }
  
WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)/home');
    }
  }, [isSignedIn]);

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
      })

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  if (isSignedIn) {
    return null; // or a loading indicator
  }

  return (
    <View style={{ backgroundColor: Colors.WHITE, height: "100%" }}>
      <Image
        source={require("../../assets/images/dogsimg/login.png")}
        style={{ width: "100%", height: 500 }}
      />

      <View style={{ padding: 20, display: "flex", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 30,
            fontFamily: "outfit-bold",
            textAlign: "center",
          }}
        >
          Ready to make a new friend
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "outfit",
            textAlign: "center",
            marginTop: 10,
            color: Colors.GRAY,
          }}
        >
          Let's adopt the pet which you like and make their life happy again.
        </Text>
        <Pressable
          style={{
            padding: 14,
            marginTop: 100,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 14,
            width: "100%",
          }}
          onPress={onPress}
        >
          <Text
            style={{
              fontFamily: "outfit-medium",
              fontSize: 20,
              textAlign: "center",
              color: Colors.WHITE,
            }}
          >
            Get started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
