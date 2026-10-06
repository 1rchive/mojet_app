import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function Weight() {
  const [weight, setWeight] = useState("150");

  // Generate options from 50 to 450 lbs
  const weightOptions = Array.from({ length: 401 }, (_, i) => (i + 50).toString());

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-8 py-12 justify-between">
        
        {/* Top: Nav & Progress */}
        <View>
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity 
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
              className="w-12 h-12 items-center justify-center border border-white/10 rounded-xl"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View className="flex-1 ml-6 h-[1px] bg-white/10">
              <View className="h-[1px] bg-white w-[62%]" />
            </View>
          </View>

          <View>
            <Text className="text-gray-600 text-[10px] font-bold tracking-[4px] uppercase mb-1">
              Metric 03
            </Text>
            <Text className="text-white text-5xl font-black italic uppercase tracking-tighter">
              Weight.
            </Text>
          </View>
        </View>

        {/* Center: Large Digital Scale Readout */}
        <View className="relative items-center justify-center py-20">
          {/* Viewfinder Brackets */}
          <View className="absolute top-0 left-0 w-12 h-[2px] bg-white/20" />
          <View className="absolute top-0 left-0 w-[2px] h-12 bg-white/20" />
          <View className="absolute bottom-0 right-0 w-12 h-[2px] bg-white/20" />
          <View className="absolute bottom-0 right-0 w-[2px] h-12 bg-white/20" />

          {/* Value Display */}
          <View className="flex-row items-baseline mb-4">
            <Text className="text-white text-8xl font-black italic tracking-tighter">
              {weight}
            </Text>
            <Text className="text-gray-600 text-3xl font-black italic ml-3 uppercase">
              lbs
            </Text>
          </View>

          {/* Minimal Picker Overlay */}
          <View className="w-full h-32 opacity-80">
            <Picker
              selectedValue={weight}
              onValueChange={(v) => setWeight(v)}
              itemStyle={{ color: "white", fontSize: 24, height: 120 }}
            >
              {weightOptions.map((w) => (
                <Picker.Item key={w} label={w} value={w} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Bottom: Action */}
        <View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/onboarding/user-experience")}
            className="bg-white h-20 rounded-xl flex-row items-center justify-between px-8 mb-6 shadow-xl shadow-white/5"
          >
            <Text className="text-black text-2xl font-black italic uppercase tracking-tighter">
              Confirm
            </Text>
            <Ionicons name="chevron-forward" size={28} color="black" />
          </TouchableOpacity>
          
          <Text className="text-gray-700 text-center text-[10px] font-bold uppercase tracking-[3px] opacity-60">
            Baseline mass required for force calculation.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
