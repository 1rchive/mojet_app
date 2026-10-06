import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function AllSet() {
  return (
    <View className="flex-1 bg-gray-950 px-6 pt-20 justify-center items-center">
      
      {/* Progress bar - 100% Complete */}
      <View className="absolute top-16 left-6 right-6 h-2 bg-gray-800 rounded-full">
        <View className="h-2 bg-white rounded-full w-[100%]" />
      </View>

      {/* Back Button - Positioned lower than the bar */}
      <TouchableOpacity 
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        className="absolute top-24 left-6 p-2 z-10"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Header Text */}
      <Text className="text-white text-4xl font-bold mb-9 text-center tracking-tight">
        You Are All Set
      </Text>

      {/* Success Indicator */}
      <View className="flex-row items-center mb-10 bg-gray-900 px-6 py-3 rounded-2xl border border-gray-800">
        <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center mr-3">
            <Text className="text-black font-bold text-xs">✓</Text>
        </View>
        <Text className="text-white text-lg font-medium">
          No payment due now
        </Text>
      </View>

      {/* Main Action Button */}
      <TouchableOpacity 
        onPress={() => router.push("/core/test")}
        activeOpacity={0.8}
        className="bg-white rounded-full py-5 w-full items-center mb-4 shadow-xl"
      >
        <Text className="text-black text-xl font-bold">Try Now</Text>
      </TouchableOpacity>

      {/* Price Text Below Button */}
      <Text className="text-gray-500 text-center text-sm font-medium">
        Just $2.00 per week
      </Text>
    </View>
  );
}

