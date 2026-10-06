import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const [aboutVisible, setAboutVisible] = React.useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Sign-out failed', error.message);
      return;
    }

    router.replace('/components/Auth');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);

    const { error } = await supabase.rpc('delete_current_user');
    if (error) {
      setDeleting(false);
      Alert.alert(
        'Delete account failed',
        'Missing backend function. Create RPC delete_current_user in Supabase and try again.'
      );
      return;
    }

    await supabase.auth.signOut();
    setDeleting(false);
    setConfirmDeleteVisible(false);
    router.replace('/components/Auth');
  };

  return (
    <View className="flex-1 bg-gray-950 px-6 pt-16">
      <View className="mb-10">
        <Text className="text-white text-6xl font-black italic uppercase tracking-tighter">MOJET</Text>
        <View className="h-[1px] w-full bg-white/10 mt-4" />
      </View>

      <View className="flex-row justify-between items-center mb-6 px-1">
        <Text className="text-white text-[11px] font-black uppercase tracking-[4px]">Settings</Text>
      </View>

      <View className="space-y-5">
        <TouchableOpacity
          className="w-full bg-white/[0.03] border border-white/10 py-6 px-6"
          onPress={() => setAboutVisible(true)}
        >
          <View className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40" />
          <View className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40" />
          <Text className="text-white text-2xl font-black italic uppercase tracking-tight">About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-white/[0.03] border border-white/10 py-6 px-6 mt-4"
          onPress={() => router.push('/core/Tos')}
        >
          <View className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40" />
          <View className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40" />
          <Text className="text-white text-2xl font-black italic uppercase tracking-tight">Terms</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-white/[0.03] border border-white/10 py-6 px-6 mt-4"
          onPress={handleSignOut}
        >
          <View className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40" />
          <View className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40" />
          <Text className="text-white text-2xl font-black italic uppercase tracking-tight">Sign-Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-red-600/15 border border-red-500/40 py-6 px-6 mt-4"
          onPress={() => setConfirmDeleteVisible(true)}
        >
          <View className="absolute top-0 left-0 w-3 h-3 border-t border-l border-red-400/70" />
          <View className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-red-400/70" />
          <Text className="text-red-300 text-2xl font-black italic uppercase tracking-tight">Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-10 left-6 right-6 flex-row items-center">
        <View className="flex-1 flex-row bg-white/[0.03] border border-white/10 h-16 items-center justify-around px-4 relative">
          <View className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40" />
          <View className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40" />

          <TouchableOpacity onPress={() => router.push('/core/home')} className="p-2 opacity-30">
            <FontAwesome name="home" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/core/settings')} className="p-2">
            <Ionicons name="settings-sharp" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="ml-3 relative">
          <View className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-green-500/50" />
          <View className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-green-500/50" />
          <TouchableOpacity
            onPress={() => router.push('/core/test')}
            className="bg-green-500 w-16 h-16 items-center justify-center shadow-2xl"
          >
            <Ionicons name="add" size={36} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent visible={aboutVisible} animationType="fade">
        <View className="flex-1 bg-black/80 px-8 justify-center">
          <View className="bg-gray-950 border border-white/10 rounded-2xl p-6">
            <Text className="text-white text-2xl font-black italic uppercase tracking-tight mb-3">
              About Mojet
            </Text>
            <Text className="text-gray-500 text-[11px] font-bold uppercase tracking-[2px] mb-2">
              App Version
            </Text>
            <Text className="text-white text-3xl font-black italic tracking-tight mb-6">
              v{appVersion}
            </Text>
            <TouchableOpacity
              className="bg-white rounded-xl h-12 items-center justify-center"
              onPress={() => setAboutVisible(false)}
            >
              <Text className="text-black text-base font-black italic uppercase">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={confirmDeleteVisible} animationType="fade">
        <View className="flex-1 bg-black/80 px-8 justify-center">
          <View className="bg-gray-950 border border-red-500/30 rounded-2xl p-6">
            <Text className="text-red-400 text-2xl font-black italic uppercase tracking-tight mb-2">
              Delete Account
            </Text>
            <Text className="text-gray-300 text-sm leading-6 mb-6">
              This action is permanent and cannot be undone. Your profile and linked app data
              will be removed.
            </Text>
            <TouchableOpacity
              disabled={deleting}
              className="bg-red-600 rounded-xl h-12 items-center justify-center mb-3"
              onPress={handleDeleteAccount}
            >
              <Text className="text-white text-base font-black italic uppercase">
                {deleting ? 'Deleting' : 'Confirm Delete'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={deleting}
              className="bg-white rounded-xl h-12 items-center justify-center"
              onPress={() => setConfirmDeleteVisible(false)}
            >
              <Text className="text-black text-base font-black italic uppercase">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
