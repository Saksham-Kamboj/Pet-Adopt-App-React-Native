import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";

function Index() {
  const { user } = useUser();

  return (
    <View style={{ flex: 1 }}>
      {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />}
    </View>
  );
}

export default Index;
