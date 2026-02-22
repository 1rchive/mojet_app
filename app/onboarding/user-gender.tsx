import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function UserGenderOnboarding() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (gender: string) => {
    setSelected(gender);
    // Visual pause for the selection state before transitioning
    setTimeout(() => {
      router.push("/onboarding/height");
    }, 250);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-8 py-12">
        
        {/* Navigation & Progress */}
        <View className="flex-row items-center justify-between mb-12">
          <TouchableOpacity 
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            activeOpacity={0.7}
            className="w-12 h-12 bg-gray-900 rounded-xl items-center justify-center border border-white/10"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-1 ml-6 h-[1.5px] bg-gray-900">
            <View className="h-[1.5px] bg-white w-[25%]" />
          </View>
        </View>

        {/* Header Section */}
        <View className="mb-4">
          <Text className="text-gray-600 text-[10px] font-bold tracking-[4px] uppercase mb-2">
            Step 01
          </Text>
          <Text className="text-white text-5xl font-black italic uppercase tracking-tighter">
            Gender.
          </Text>
        </View>

        {/* Centered Large Selection Grid */}
        <View className="flex-1 justify-center items-center">
          <View className="relative w-full aspect-square max-h-[420px] justify-center p-6">
            
            {/* Viewfinder Brackets */}
            <View className="absolute top-0 left-0 w-12 h-[2px] bg-white/30" />
            <View className="absolute top-0 left-0 w-[2px] h-12 bg-white/30" />
            <View className="absolute bottom-0 right-0 w-12 h-[2px] bg-white/30" />
            <View className="absolute bottom-0 right-0 w-[2px] h-12 bg-white/30" />

            {/* Side-by-Side Large Targets */}
            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                onPress={() => handleSelect('Male')}
                activeOpacity={0.9}
                className={`w-[47%] aspect-[3/4] rounded-3xl items-center justify-center border-2 ${
                  selected === 'Male' ? 'bg-white border-white' : 'bg-gray-900 border-white/5'
                }`}
              >
                <Ionicons 
                  name="male-sharp" 
                  size={54} 
                  color={selected === 'Male' ? 'black' : 'white'} 
                />
                <Text className={`text-xl font-black italic uppercase mt-6 tracking-tighter ${
                  selected === 'Male' ? 'text-black' : 'text-white'
                }`}>
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelect('Female')}
                activeOpacity={0.9}
                className={`w-[47%] aspect-[3/4] rounded-3xl items-center justify-center border-2 ${
                  selected === 'Female' ? 'bg-white border-white' : 'bg-gray-900 border-white/5'
                }`}
              >
                <Ionicons 
                  name="female-sharp" 
                  size={54} 
                  color={selected === 'Female' ? 'black' : 'white'} 
                />
                <Text className={`text-xl font-black italic uppercase mt-6 tracking-tighter ${
                  selected === 'Female' ? 'text-black' : 'text-white'
                }`}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* Technical Bottom Label */}
        <View className="mt-8">
          <Text className="text-gray-700 text-center text-[10px] font-bold uppercase tracking-[3px] leading-4 opacity-70">
            Calibration requires biological baseline.{"\n"}
            Select a profile to continue.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
