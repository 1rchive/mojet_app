import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StatusBar, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import "../global.css";
import { supabase } from "./lib/supabase";

type RevenueCatExtra = {
  revenueCatAppleApiKey?: string;
  revenueCatGoogleApiKey?: string;
};
const NEW_USER_ONBOARDING_KEY = "new_user_pending_onboarding";

const getRevenueCatApiKey = () => {
  const extra = (Constants.expoConfig?.extra ?? {}) as RevenueCatExtra;

  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY ?? extra.revenueCatAppleApiKey ?? null;
  }

  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY ?? extra.revenueCatGoogleApiKey ?? null;
  }

  return null;
};

const isLikelyValidRevenueCatPublicKey = (key: string, platform: "ios" | "android") => {
  if (platform === "ios") {
    return key.startsWith("appl_");
  }

  return key.startsWith("goog_");
};

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      return;
    }

    if (Constants.executionEnvironment === "storeClient") {
      console.warn(
        "Running in Expo Go (Preview API Mode). Real purchases require a development build or production build."
      );
    }

    const apiKey = getRevenueCatApiKey();

    if (!apiKey) {
      console.error("RevenueCat API key is missing. Set EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY or EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY.");
      return;
    }

    if (
      (Platform.OS === "ios" || Platform.OS === "android") &&
      !isLikelyValidRevenueCatPublicKey(apiKey, Platform.OS)
    ) {
      console.warn(
        `RevenueCat key format looks unexpected for ${Platform.OS}. Use the platform public SDK key (ios: appl_*, android: goog_*).`
      );
    }

    if (__DEV__) {
      void Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    }

    Purchases.configure({ apiKey });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(currentSession);
      setSessionChecked(true);
    };

    void bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionChecked(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionChecked) {
      return;
    }

    const first = segments[0];
    const second = segments[1];
    const onAuthScreen = first === "components" && second === "Auth";
    const onPublicTos = first === "core" && second === "Tos";

    if (!session && !onAuthScreen && !onPublicTos) {
      router.replace("/components/Auth");
      return;
    }

    if (session && onAuthScreen) {
      void (async () => {
        const shouldStartOnboarding = await AsyncStorage.getItem(NEW_USER_ONBOARDING_KEY);
        if (shouldStartOnboarding === "true") {
          await AsyncStorage.removeItem(NEW_USER_ONBOARDING_KEY);
          router.replace("/onboarding/onboarding-intro");
          return;
        }
        router.replace("/core/home");
      })();
    }
  }, [session, sessionChecked, segments, router]);

  if (!sessionChecked) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center px-8">
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="small" color="#ffffff" />
        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[3px] mt-4">
          Checking Account
        </Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
