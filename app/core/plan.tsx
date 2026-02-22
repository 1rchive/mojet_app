import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function plan() {
  return (
    <View className="flex-1 bg-gray-950 pt-16 px-6">
      {/* Scrollable content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Top Header with App Name and Settings */}
        <View className="flex-row justify-between items-center mb-6">
          {/* App Name */}
          <Text className="text-white text-2xl font-bold">Mojet</Text>
          
        </View>
        <View>
          <Text className="text-white text-xl font-semibold">Generate Workout</Text>
        </View>
        

        {/* Add any more scrollable content here in the future */}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View className="absolute bottom-6 left-8 right-8 bg-gray-900 rounded-full flex-row justify-around items-center py-5 px-12 shadow-lg shadow-black">
        {/* Home Button */}
        <TouchableOpacity
          onPress={() => router.push('/core/home')}
          className="flex-1 items-center"
        >
          <FontAwesome name="home" size={27} color="white" className="right-[45%]" />
        </TouchableOpacity>

        {/* Plan Button */}
        <TouchableOpacity
          onPress={() => router.push('/core/plan')}
          className="flex-1 items-center"
        >
         <MaterialCommunityIcons name="chart-bar" size={27} color="white" className="right-[45%]" />
        </TouchableOpacity>

<TouchableOpacity
          onPress={() => router.push('/core/settings')}
          className="flex-1 items-center"
        >
          <Ionicons name="settings-sharp" size={27} color="white" className="right-[45%]" />
        </TouchableOpacity>

      </View>

      {/* Floating Plus Button */}
      <TouchableOpacity
        onPress={() => router.push('/core/test')}
        className="absolute right-4 bottom-6 bg-green-500 w-[20%] h-[9%] rounded-full justify-center items-center shadow-xl"
      >
        <Text className="text-white text-3xl font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
}
