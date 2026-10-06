import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function Goals() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (goal: string) => {
    setSelected(goal);
    setTimeout(() => {
      router.push("/onboarding/paywall");
    }, 250);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-8 py-12">
        
        {/* Nav & Progress */}
        <View className="flex-row items-center justify-between mb-10">
          <TouchableOpacity 
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            className="w-12 h-12 items-center justify-center border border-white/10 rounded-xl bg-gray-900/50"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View className="flex-1 ml-6 h-[1px] bg-gray-900">
            <View className="h-[1px] bg-white w-[90%]" />
          </View>
        </View>

        {/* Header */}
        <View className="mb-4">
          <Text className="text-gray-600 text-[10px] font-bold tracking-[4px] uppercase mb-1">
            Baseline 05
          </Text>
          <Text className="text-white text-5xl font-black italic uppercase tracking-tighter">
            Objective.
          </Text>
        </View>

        {/* Selection Area - Scaled Down & Centered */}
        <View className="flex-1 justify-center">
          <View className="relative py-12 px-4">
            
            {/* Viewfinder Brackets - Now tighter to the buttons */}
            <View className="absolute top-0 left-0 w-10 h-[1.5px] bg-white/20" />
            <View className="absolute top-0 left-0 w-[1.5px] h-10 bg-white/20" />
            <View className="absolute bottom-0 right-0 w-10 h-[1.5px] bg-white/20" />
            <View className="absolute bottom-0 right-0 w-[1.5px] h-10 bg-white/20" />

            <View className="space-y-5">
              {/* Option: Lean */}
              <TouchableOpacity
                onPress={() => handleSelect("Weight Loss")}
                activeOpacity={0.9}
                className={`w-full py-7 px-8 rounded-2xl border ${
                  selected === "Weight Loss" ? 'bg-white border-white' : 'bg-gray-900/40 border-white/10'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className={`text-3xl font-black italic uppercase tracking-tight ${
                      selected === "Weight Loss" ? 'text-black' : 'text-white'
                    }`}>
                      Lean
                    </Text>
                    <Text className={`text-[10px] font-bold uppercase tracking-[2px] mt-1 ${
                      selected === "Weight Loss" ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      Metabolic Efficiency
                    </Text>
                  </View>
                  <Ionicons 
                    name="flame-outline" 
                    size={24} 
                    color={selected === "Weight Loss" ? "black" : "#4b5563"} 
                  />
                </View>
              </TouchableOpacity>

              {/* Option: Power */}
              <TouchableOpacity
                onPress={() => handleSelect("Gain Muscle")}
                activeOpacity={0.9}
                className={`w-full py-7 px-8 rounded-2xl border ${
                  selected === "Gain Muscle" ? 'bg-white border-white' : 'bg-gray-900/40 border-white/10'
                }`}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className={`text-3xl font-black italic uppercase tracking-tight ${
                      selected === "Gain Muscle" ? 'text-black' : 'text-white'
                    }`}>
                      Power
                    </Text>
                    <Text className={`text-[10px] font-bold uppercase tracking-[2px] mt-1 ${
                      selected === "Gain Muscle" ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      Hypertrophy & Force
                    </Text>
                  </View>
                  <Ionicons 
                    name="flash-outline" 
                    size={24} 
                    color={selected === "Gain Muscle" ? "black" : "#4b5563"} 
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-auto pt-6">
          <Text className="text-gray-700 text-center text-[10px] font-bold uppercase tracking-[4px] opacity-60">
            System Logic Finalized.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

