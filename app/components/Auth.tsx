import React, { useEffect, useState } from 'react'
import { Alert, View, Text, Keyboard, TouchableWithoutFeedback, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

type SupabaseErrorLike = {
  message: string;
  status?: number;
  code?: string;
  name?: string;
};

const formatAuthError = (error: SupabaseErrorLike) => {
  const code = error.code ? `Code: ${error.code}` : null;
  const status = typeof error.status === "number" ? `Status: ${error.status}` : null;
  return [error.message, code, status].filter(Boolean).join("\n");
};

const NEW_USER_ONBOARDING_KEY = 'new_user_pending_onboarding';

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("Supabase sign-in error:", error);
      Alert.alert("Access Denied", formatAuthError(error));
      setLoading(false)
      return;
    }

    router.replace('/')
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)

    const username = email.includes("@") ? email.split("@")[0] : email;
    const emailRedirectTo = Linking.createURL('/components/Auth');

    const { data: { session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          username,
        },
      },
    })

    if (error) {
      console.error("Supabase sign-up error:", error);
      Alert.alert("Registration Failed", formatAuthError(error));
      setLoading(false)
      return;
    }

    if (!session) {
      await AsyncStorage.setItem(NEW_USER_ONBOARDING_KEY, 'true');
      Alert.alert(
        'Verification Pending',
        'Account created. Verify your email, then log in to continue onboarding.'
      )
      setActiveTab("signin")
      setLoading(false)
      return;
    }

    await AsyncStorage.setItem(NEW_USER_ONBOARDING_KEY, 'true');
    router.replace('/')
    setLoading(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-gray-950 px-8 justify-center">
        
        {/* Brand Header */}
        <View className="mb-12 items-start">
          <Text className="text-white text-6xl font-black italic tracking-tighter leading-[55px]">
            MOJET
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="h-[2px] w-6 bg-white mr-3" />
            <Text className="text-gray-500 text-[10px] font-bold tracking-[4px] uppercase">
              Don&apos;t think just do
            </Text>
          </View>
        </View>

        {/* Auth Tabs */}
        <View className="flex-row mb-10 border-b border-gray-900">
          <TouchableOpacity 
            onPress={() => setActiveTab("signin")}
            className={`pb-4 mr-10 ${activeTab === "signin" ? "border-b-2 border-white" : ""}`}
          >
            <Text className={`text-sm font-bold uppercase tracking-widest ${activeTab === "signin" ? "text-white" : "text-gray-600"}`}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab("signup")}
            className={`pb-4 ${activeTab === "signup" ? "border-b-2 border-white" : ""}`}
          >
            <Text className={`text-sm font-bold uppercase tracking-widest ${activeTab === "signup" ? "text-white" : "text-gray-600"}`}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View className="mb-8">
          <View className="mb-6">
            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">
              Email Address
            </Text>
            <View className="bg-gray-900 rounded-xl border border-gray-800 flex-row items-center px-4 h-16">
              <Ionicons name="mail-outline" size={20} color="#4b5563" />
              <TextInput
                onChangeText={setEmail}
                value={email}
                placeholder="user@email.com"
                placeholderTextColor="#374151"
                autoCapitalize="none"
                className="flex-1 text-white ml-3 font-medium text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">
              Password
            </Text>
            <View className="bg-gray-900 rounded-xl border border-gray-800 flex-row items-center px-4 h-16">
              <Ionicons name="lock-closed-outline" size={20} color="#4b5563" />
              <TextInput
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="********"
                placeholderTextColor="#374151"
                autoCapitalize="none"
                className="flex-1 text-white ml-3 font-medium text-base"
              />
            </View>
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          onPress={activeTab === "signin" ? signInWithEmail : signUpWithEmail}
          disabled={loading}
          activeOpacity={0.8}
          className="bg-white h-16 rounded-xl flex-row items-center justify-center shadow-xl shadow-white/5"
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <>
              <Text className="text-black text-xl font-black italic uppercase tracking-tight mr-2">
                {activeTab === "signin" ? "Login" : "Register"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="black" />
            </>
          )}
        </TouchableOpacity>

        {/* Legal Acknowledgement */}
        <View className="mt-8 px-4">
          <Text className="text-gray-600 text-[10px] leading-4 text-center uppercase tracking-widest font-bold">
            By {activeTab === "signin" ? "Logging In" : "Registering"}, you accept our{"\n"}
            <Text 
              onPress={() => router.push('/core/Tos')}
              className="text-white underline"
            >
              Terms and Services
            </Text>
          </Text>
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
