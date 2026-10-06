import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function HeightInput() {
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");

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
              <View className="h-[1px] bg-white w-[50%]" />
            </View>
          </View>

          <View>
            <Text className="text-gray-600 text-[10px] font-bold tracking-[4px] uppercase mb-1">
              Metric 02
            </Text>
            <Text className="text-white text-5xl font-black italic uppercase tracking-tighter">
              Height.
            </Text>
          </View>
        </View>

        {/* Center: Large Readout & Subtle Picker */}
        <View className="relative items-center justify-center py-20">
          {/* Large Corner Brackets framing the readout */}
          <View className="absolute top-0 left-0 w-12 h-[2px] bg-white/20" />
          <View className="absolute top-0 left-0 w-[2px] h-12 bg-white/20" />
          <View className="absolute bottom-0 right-0 w-12 h-[2px] bg-white/20" />
          <View className="absolute bottom-0 right-0 w-[2px] h-12 bg-white/20" />

          {/* Digital Readout */}
          <View className="flex-row items-baseline mb-4">
            <Text className="text-white text-8xl font-black italic tracking-tighter">
              {feet}
            </Text>
            <Text className="text-gray-600 text-4xl font-black italic ml-2 mr-4">'</Text>
            <Text className="text-white text-8xl font-black italic tracking-tighter">
              {inches}
            </Text>
            <Text className="text-gray-600 text-4xl font-black italic ml-2">"</Text>
          </View>

          {/* Hidden/Minimal Picker Overlay */}
          <View className="flex-row w-full h-32 opacity-80">
            <Picker
              style={{ flex: 1 }}
              selectedValue={feet}
              onValueChange={(v) => setFeet(v)}
              itemStyle={{ color: "white", fontSize: 20 }}
            >
              {[3, 4, 5, 6, 7, 8].map((f) => (
                <Picker.Item key={f} label={`${f} FT`} value={f.toString()} />
              ))}
            </Picker>
            <Picker
              style={{ flex: 1 }}
              selectedValue={inches}
              onValueChange={(v) => setInches(v)}
              itemStyle={{ color: "white", fontSize: 20 }}
            >
              {[...Array(12).keys()].map((i) => (
                <Picker.Item key={i} label={`${i} IN`} value={i.toString()} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Bottom: Action */}
        <View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/onboarding/weight")}
            className="bg-white h-20 rounded-xl flex-row items-center justify-between px-8 mb-6"
          >
            <Text className="text-black text-2xl font-black italic uppercase tracking-tighter">
              Confirm
            </Text>
            <Ionicons name="chevron-forward" size={28} color="black" />
          </TouchableOpacity>
          
          <Text className="text-gray-700 text-center text-[10px] font-bold uppercase tracking-[3px]">
            Data used for silhouette generation.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
