import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditCarForm from '../../../../../components/organisms/forms/EditCarForm';
import { useLocalSearchParams } from 'expo-router';

export default function EditCarScreen() {
  const params = useLocalSearchParams<{ carId: string }>();
  const carId = params?.carId || '';

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-8" showsVerticalScrollIndicator={false}>
          <View className="mb-12">
            <View className="items-center">
              <Text className="text-white text-3xl font-bold text-center">Editar Vehículo</Text>
            </View>
            <Text className="text-white/60 text-base text-center px-4 mt-2">Modifica los datos de tu vehículo.</Text>
          </View>

          <EditCarForm carId={carId} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
