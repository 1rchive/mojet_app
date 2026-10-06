import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { supabase } from "./lib/supabase";
const NEW_USER_ONBOARDING_KEY = "new_user_pending_onboarding";

export default function Index() {
  useEffect(() => {
    let isMounted = true;

    const redirectFromSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!session) {
        router.replace("/components/Auth");
        return;
      }

      const shouldStartOnboarding = await AsyncStorage.getItem(NEW_USER_ONBOARDING_KEY);
      if (shouldStartOnboarding === "true") {
        await AsyncStorage.removeItem(NEW_USER_ONBOARDING_KEY);
        router.replace("/onboarding/onboarding-intro");
        return;
      }

      router.replace("/core/home");
    };

    void redirectFromSession();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-gray-950 items-center justify-center px-8">
      <StatusBar barStyle="light-content" />
      <ActivityIndicator size="small" color="#ffffff" />
      <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[3px] mt-4">
        Redirecting
      </Text>
    </View>
  );
}
