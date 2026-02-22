import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

type Card = { id: string; title: string; createdAt: number; imageUri?: string; workoutContent?: string };

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [workout, setWorkout] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const STORAGE_KEY = 'generated_cards';
  const isFocused = useIsFocused();
  const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

  const getWorkout = async (card: Card) => {
    if (!card.imageUri || card.workoutContent) return;
    try {
      const { data: blobData, error: downloadError } = await supabase.storage
        .from('screenshots')
        .download(card.imageUri);
      if (downloadError || !blobData) return;
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Raw = reader.result as string;
        const base64Image = base64Raw.split(',')[1];
        try {
          const { data, error: funcError } = await supabase.functions.invoke('generate-workout', {
            body: { image: base64Image },
          });
          if (funcError || !data?.text) return;
          setCards((prevCards) => {
            const updated = prevCards.map((c) =>
              c.id === card.id ? { ...c, workoutContent: data.text } : c
            );
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        } catch (err) { console.error('Background analysis failed:', err); }
      };
      reader.readAsDataURL(blobData);
    } catch (err) { console.error('Process error:', err); }
  };

  const loadCards = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsedCards: Card[] = JSON.parse(raw);
        setCards(parsedCards);
        parsedCards.forEach((card) => {
          if (!card.workoutContent) { getWorkout(card); }
        });
      }
    } catch (e) { console.log('Failed to load cards', e); }
  }, []);

  useEffect(() => { loadCards(); }, [loadCards, isFocused]);

  useEffect(() => {
    const now = Date.now();
    setCards((prevCards) => {
      const filteredCards = prevCards.filter((card) => now - card.createdAt < FIVE_DAYS_MS);
      if (filteredCards.length !== prevCards.length) {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards)).catch(
          (e) => console.log('Failed to save filtered cards', e)
        );
      }
      return filteredCards;
    });
  }, []);

  const clearAllCards = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setCards([]);
    } catch (e) { console.log('Failed to clear cards', e); }
  }, []);

  function onOpenCard(card: Card) {
    setSelectedCard(card);
    setModalVisible(true);
    if (card.workoutContent) {
      setWorkout(card.workoutContent);
      setLoading(false);
    } else {
      setWorkout('Analyzing...');
      setLoading(true);
    }
  }

  return (
    <View className="flex-1 bg-gray-950 px-6 pt-16">
      <StatusBar barStyle="light-content" />
      
      {/* BRAND HEADER */}
      <View className="mb-10">
        <Text className="text-white text-6xl font-black italic uppercase tracking-tighter">MOJET</Text>
        <View className="h-[1px] w-full bg-white/10 mt-4" />
      </View>

      {/* SECTION LABEL */}
      <View className="flex-row justify-between items-center mb-6 px-1">
        <Text className="text-white text-[11px] font-black uppercase tracking-[4px]">Workouts</Text>
        {cards.length > 0 && (
          <TouchableOpacity onPress={clearAllCards}>
            <Text className="text-white/40 text-[10px] font-bold uppercase border-b border-white/20">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {cards.length === 0 ? (
          <View className="w-full h-40 border border-white/5 items-center justify-center">
            <Text className="text-white/10 font-bold uppercase tracking-widest text-[10px]">No Recent Data</Text>
          </View>
        ) : (
          cards.map((c) => (
            <TouchableOpacity 
              key={c.id} 
              onPress={() => onOpenCard(c)} 
              activeOpacity={0.8}
              className="w-full bg-white/[0.03] border border-white/10 mb-6 p-6"
            >
              <View className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40" />
              <View className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40" />

              <Text className="text-white text-3xl font-black italic uppercase tracking-tighter leading-tight">{c.title}</Text>
              
              <View className="flex-row items-center justify-between mt-6">
                <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest">
                  {new Date(c.createdAt).toLocaleDateString()}
                </Text>
                <View className="flex-row items-center">
                  <View className={`w-1.5 h-1.5 rounded-full ${c.workoutContent ? 'bg-green-500' : 'bg-orange-500'} mr-2`} />
                  <Text className={`text-[10px] font-black uppercase tracking-widest ${c.workoutContent ? 'text-green-500' : 'text-orange-500'}`}>
                    {c.workoutContent ? 'Ready' : 'Analyzing'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* COHESIVE VIEWFINDER NAVIGATION TAB */}
      <View className="absolute bottom-10 left-6 right-6 flex-row items-center">
        {/* Navigation Block */}
        <View className="flex-1 flex-row bg-white/[0.03] border border-white/10 h-16 items-center justify-around px-4 relative">
          {/* Matching Corner Viewfinder Accents */}
          <View className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40" />
          <View className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40" />

          <TouchableOpacity onPress={() => router.push('/core/home')} className="p-2">
            <FontAwesome name="home" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/core/settings')} className="p-2 opacity-30">
            <Ionicons name="settings-sharp" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Plus Button - Framed Target Design */}
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

      {/* WORKOUT MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/95 p-8 justify-center">
          <View className="border border-white/10 p-6 bg-gray-950">
            <View className="flex-row justify-between items-start mb-8">
              <View>
                <Text className="text-white text-3xl font-black italic uppercase tracking-tighter leading-none">{selectedCard?.title}</Text>
                <View className="h-0.5 w-12 bg-green-500 mt-2" />
              </View>
              <TouchableOpacity onPress={() => { setModalVisible(false); setWorkout(''); }}>
                <Text className="text-white/60 font-black uppercase tracking-widest text-[10px] border border-white/20 px-3 py-1">Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} className="max-h-[70%]">
              {loading ? (
                <View className="py-20 items-center">
                  <ActivityIndicator size="small" color="#22c55e" />
                </View>
              ) : (
                <Text className="text-white leading-7 text-lg font-bold uppercase italic">{workout}</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

//greetings programmer, if you see this. Then I as the creator of this app has NO idea how this worked. I slammed my head
//on this FUCKING KEYBOARD figuring it out for DAYS AND DAYS ON END until i was forced to use AI. This entire thing? yeah AI!
// so best of luck for you and report to me if you ever see this code maybe you'll get rewarded who knows :3

//greetings programmer, if you see this. Then I as the creator of this app has NO idea how this worked. I slammed my head
//on this FUCKING KEYBOARD figuring it out for DAYS AND DAYS ON END until i was forced to use AI. This entire thing? yeah AI!
// so best of luck for you and report to me if you ever see this code maybe you'll get rewarded who knows :3
