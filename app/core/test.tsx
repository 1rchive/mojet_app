import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, StatusBar } from "react-native";
import { router } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export default function BodyScan() {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [uploading, setUploading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // --- LOGIC PRESERVED PER REQUEST ---
  async function takePicture() {
    if (!cameraRef.current) return;
    try {
      setUploading(true);
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo.uri) throw new Error("No photo URI returned!");
      const arraybuffer = await fetch(photo.uri).then((res) => res.arrayBuffer());
      const fileExt = photo.uri.split('.').pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(path, arraybuffer, { contentType: `image/${fileExt}` });
      if (uploadError) throw uploadError;
      try {
        const STORAGE_KEY = 'generated_cards';
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const existing = raw ? JSON.parse(raw) : [];
        const newCard = {
          id: Date.now().toString(),
          title: `Photo ${existing.length + 1}`,
          createdAt: Date.now(),
          imageUri: data.path,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([newCard, ...existing]));
      } catch (e) { console.log("Failed to save generated card", e); }
      router.push("/core/home");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error.message);
    } finally { setUploading(false); }
  }

  // --- COUNTDOWN DESIGN UPDATE ---
  function startCountdown() {
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          takePicture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function cancelCountdown() {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
  }

  if (!permission?.granted) return <View className="flex-1 bg-black" />;

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

      {/* Industrial Overlay */}
      <View className="absolute inset-0 px-8 py-14 justify-between">
        
        {/* Header */}
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white text-3xl font-black italic uppercase tracking-tighter">
              Body Scan
            </Text>
            <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-[3px] mt-1">
              Imperial Calibration
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            className="w-12 h-12 items-center justify-center border border-white/10 rounded-xl bg-black/20"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Precision Viewfinder */}
        <View className="items-center justify-center">
          <View className="w-full aspect-[3/4] max-h-[480px] border border-white/10 rounded-[40px] relative">
            <View className="absolute top-0 left-0 w-10 h-10 border-t-[1.5px] border-l-[1.5px] border-white/40 rounded-tl-[35px]" />
            <View className="absolute top-0 right-0 w-10 h-10 border-t-[1.5px] border-r-[1.5px] border-white/40 rounded-tr-[35px]" />
            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[1.5px] border-l-[1.5px] border-white/40 rounded-bl-[35px]" />
            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[1.5px] border-r-[1.5px] border-white/40 rounded-br-[35px]" />
            
            {countdown !== null && (
              <View className="flex-1 items-center justify-center bg-black/40 rounded-[40px]">
                <Text className="text-white text-9xl font-black italic tracking-tighter">
                  {countdown}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Controls */}
        <View className="items-center">
          {countdown !== null ? (
            <TouchableOpacity 
              onPress={cancelCountdown}
              className="bg-red-500/10 border border-red-500/50 px-10 py-5 rounded-2xl mb-6"
            >
              <Text className="text-red-500 font-black uppercase tracking-[4px] text-xs">
                Abort Scan
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row items-center justify-between w-full px-6 mb-4">
              {/* Spacer on left to keep Shutter centered */}
              <View className="w-14 h-14" />

              <TouchableOpacity 
                onPress={startCountdown}
                disabled={uploading}
                className="w-24 h-24 rounded-full border border-white/20 items-center justify-center"
              >
                <View className="w-20 h-20 bg-white rounded-full items-center justify-center">
                  <View className="w-[74px] h-[74px] border border-black rounded-full" />
                </View>
              </TouchableOpacity>

              {/* Camera Flip on the Right */}
              <TouchableOpacity 
                onPress={() => setFacing(f => f === 'front' ? 'back' : 'front')}
                className="w-14 h-14 items-center justify-center border border-white/10 rounded-2xl bg-black/20"
              >
                <MaterialCommunityIcons name="camera-flip-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
          )}
          
          <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-[4px]">
            Stand atleast 6 Feet back for full frame
          </Text>
        </View>

      </View>
    </View>
  );
}
