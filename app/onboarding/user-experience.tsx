import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function Experience() {
  const [selected, setSelected] = useState<string | null>(null);

  const levels = [
    { title: "Base", desc: "No established training history." },
    { title: "Standard", desc: "Occasional/Inconsistent training." },
    { title: "Active", desc: "Consistent weekly output." },
    { title: "Elite", desc: "High-intensity performance history." },
  ];

  const handleSelect = (title: string) => {
    setSelected(title);
    setTimeout(() => {
      router.push("/onboarding/user-goal");
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
          
          <View className="flex-1 ml-6 h-[1.5px] bg-gray-900">
            <View className="h-[1.5px] bg-white w-[75%]" />
          </View>
        </View>

        {/* Header */}
        <View className="mb-8">
          <Text className="text-gray-600 text-[10px] font-bold tracking-[4px] uppercase mb-1">
            Baseline 04
          </Text>
          <Text className="text-white text-5xl font-black italic uppercase tracking-tighter">
            Experience.
          </Text>
        </View>

        {/* Selection Area */}
        <View className="flex-1 relative">
          {/* Viewfinder Brackets */}
          <View className="absolute -top-4 -left-2 w-10 h-[2px] bg-white/20" />
          <View className="absolute -top-4 -left-2 w-[2px] h-10 bg-white/20" />
          <View className="absolute -bottom-4 -right-2 w-10 h-[2px] bg-white/20" />
          <View className="absolute -bottom-4 -right-2 w-[2px] h-10 bg-white/20" />

          <ScrollView showsVerticalScrollIndicator={false} className="py-2">
            {levels.map((level, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(level.title)}
                activeOpacity={0.9}
                className={`w-full py-6 px-8 mb-4 rounded-2xl border-2 flex-row items-center justify-between ${
                  selected === level.title ? 'bg-white border-white' : 'bg-gray-900 border-white/5'
                }`}
              >
                <View className="flex-1">
                  <Text className={`text-2xl font-black italic uppercase tracking-tight ${
                    selected === level.title ? 'text-black' : 'text-white'
                  }`}>
                    {level.title}
                  </Text>
                  <Text className={`text-[11px] font-bold uppercase tracking-wide mt-1 ${
                    selected === level.title ? 'text-gray-600' : 'text-gray-500'
                  }`}>
                    {level.desc}
                  </Text>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={selected === level.title ? 'black' : '#374151'} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View className="mt-6">
          <Text className="text-gray-700 text-center text-[10px] font-bold uppercase tracking-[3px] opacity-60">
            Output complexity scales with proficiency.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
