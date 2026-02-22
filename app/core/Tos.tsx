import React from 'react'
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"

export default function Tos() {
  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="flex-1 px-8 py-10">
        
        {/* Brand Header */}
        <View className="mb-8 items-start">
          <Text className="text-white text-4xl font-black italic tracking-tighter uppercase">MOJET</Text>
          <View className="flex-row items-center mt-1">
            <View className="h-[2px] w-4 bg-white mr-2" />
            <Text className="text-gray-500 text-[10px] font-bold tracking-[3px] uppercase">
              Terms and Services
            </Text>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="flex-1 mb-6 border-t border-b border-gray-900 py-4"
        >
          <Text className="text-gray-400 text-xs leading-5 mb-6 italic">
            By using this software, you acknowledge that MOJET is provided "AS IS" and you waive certain legal rights.
          </Text>

          {/* 01. WARRANTY DISCLAIMER */}
          <View className="mb-8">
            <Text className="text-white font-black uppercase text-xs tracking-widest mb-3">01. No Warranties</Text>
            <Text className="text-gray-500 text-[11px] leading-5">
              MOJET IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. THE DEVELOPERS EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT THE OUTPUTS WILL BE ACCURATE, RELIABLE, OR MEET YOUR REQUIREMENTS.
            </Text>
          </View>

          {/* 02. MEDICAL DISCLAIMER */}
          <View className="mb-8 bg-red-950/20 p-5 border-l-2 border-red-900">
            <Text className="text-red-500 font-black uppercase text-[11px] tracking-widest mb-3">02. Medical Disclaimer</Text>
            <Text className="text-gray-400 text-[11px] leading-5 font-bold mb-3">
              MOJET IS NOT A HEALTHCARE PROVIDER. THE CALIBRATION OUTPUTS ARE FOR INFORMATIONAL PURPOSES ONLY.
            </Text>
            <Text className="text-gray-400 text-[11px] leading-5">
              The software does not account for your specific medical history, injuries, or physical limitations. You must obtain clearance from a qualified medical professional before attempting any physical activity suggested by the software.
            </Text>
          </View>

          {/* 03. DATA USAGE */}
          <View className="mb-8">
            <Text className="text-white font-black uppercase text-xs tracking-widest mb-3">03. Use of Visual Inputs</Text>
            <Text className="text-gray-500 text-[11px] leading-5">
              Visual calibration requires the processing of your photographic inputs. You agree that MOJET may use these inputs to generate training outputs. You represent that you are of legal age to consent to this processing or have obtained the necessary guardian consent.
            </Text>
          </View>

          {/* 04. LIABILITY */}
          <View className="mb-8 border-t border-gray-900 pt-6">
            <Text className="text-white font-black uppercase text-xs tracking-widest mb-3">04. Limitation of Liability</Text>
            <Text className="text-gray-500 text-[11px] leading-5">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MOJET SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM THE USE OR INABILITY TO USE THE SERVICE, INCLUDING BODILY INJURY OR LOSS OF DATA.
            </Text>
          </View>

          {/* 05. RELEASE */}
          <View className="mb-8">
            <Text className="text-white font-black uppercase text-xs tracking-widest mb-3">05. General Release</Text>
            <Text className="text-gray-500 text-[11px] leading-5 italic">
              You hereby release and forever discharge MOJET and its affiliates from any and all liability, claims, and demands which arise or may hereafter arise from your use of the software and the physical activities resulting therefrom.
            </Text>
          </View>

          <View className="items-center py-6 opacity-30">
            <Text className="text-white text-[8px] tracking-[4px] uppercase mt-2">
              End of Document
            </Text>
          </View>
        </ScrollView>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-white h-16 rounded-xl flex-row items-center justify-center shadow-2xl shadow-white/5"
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        >
          <Text className="text-black text-xl font-black italic tracking-tighter mr-2">
            ACCEPT & CONTINUE
          </Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  )
}

//under ZERO circumstances or ANY decision taken in the future by any programmer, staff or administrator or supervisor.
//ever orders to remove the comments bellow to be IMMEDIATELY REPORTED AND TO GET THEIR W-2 or 1099 TERMINATED EFFECTIVELY.



// dear editor, either it's the Owner, group, or individual tasked in dealing with this line of code. 
// I am absolutely clueless about this code... I don't know what's there to change either the lawyer.
// or some other guy said "oh no just do it!" FUCK YOU... except if it was the owner then bless you.
// P.S: spam email the owner like you're talking to your buddy or someone else on the discord group chat.
//make sure to not hold back, idk just say "hey business suka i saw this comment and it says to annoy you".
//it's like... idk to get me off of my high horses and actually remind me on locking in.
//anyways whatever lock in twin you got this I don't pay you to read allat just do what I say or something lol.
