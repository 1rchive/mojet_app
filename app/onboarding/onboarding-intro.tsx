import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-8 py-12 justify-between">
        
        {/* Top Header: Identity */}
        <View className="items-start">
          <Text className="text-white text-6xl font-black italic tracking-tighter leading-[50px]">
            MOJET
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="h-[2px] w-6 bg-white mr-3" />
            <Text className="text-gray-500 text-[10px] font-bold tracking-[5px] uppercase">
              Don't think just do
            </Text>
          </View>
        </View>

        {/* Center: The Core Message */}
        <View className="relative py-10">
          {/* Viewfinder Accents - Kept subtle and mechanical */}
          <View className="absolute top-0 left-0 w-8 h-[1px] bg-white/30" />
          <View className="absolute top-0 left-0 w-[1px] h-8 bg-white/30" />
          <View className="absolute bottom-0 right-0 w-8 h-[1px] bg-white/30" />
          <View className="absolute bottom-0 right-0 w-[1px] h-8 bg-white/30" />

          <View className="space-y-6">
            <Text className="text-white text-5xl font-black tracking-tighter leading-[50px] uppercase">
              Engineered{"\n"}Around{"\n"}Your Form.
            </Text>
            
            <View className="w-16 h-1.5 bg-white my-4" />
            
            <Text className="text-gray-400 text-xl font-medium leading-7">
              Skip the manual entry. We use visual calibration to map your current state and generate a custom-built output.
            </Text>
          </View>
        </View>

        {/* Bottom Section: Clear Action */}
        <View className="w-full">
          <View className="flex-row justify-between mb-4 px-1">
            <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-[2px]">
              Ready for Input
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-white h-20 rounded-xl flex-row items-center justify-between px-8"
            onPress={() => router.push("/onboarding/user-gender")}
          >
            <Text className="text-black text-2xl font-black italic tracking-tight uppercase">
              Calibrate
            </Text>
            <Ionicons name="chevron-forward" size={28} color="black" />
          </TouchableOpacity>
          
          <Text className="text-gray-700 text-center text-[10px] mt-6 leading-4 font-bold uppercase tracking-widest opacity-60">
            Visual data processed for training generation.{"\n"}
            Non-diagnostic software.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}