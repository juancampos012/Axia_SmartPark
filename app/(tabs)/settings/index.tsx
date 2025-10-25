import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsSection from '../../../components/organisms/settings/SettingsSection';
import { useSettingsScreen } from '../../../hooks/useSettingsScreen';

const Settings = () => {
  const {
    displayName,
    displayEmail,
    accountItems,
    applicationItems,
  } = useSettingsScreen();

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with User Profile */}
        <View className="px-4 py-6 items-center">
          <Image
            source={require('../../../assets/icon.png')}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-white text-xl font-semibold font-secondary">
            {displayName}
          </Text>
          <Text className="text-axia-gray text-sm font-primary mt-1">
            {displayEmail}
          </Text>
        </View>

        {/* Settings Sections */}
        <View className="px-4 pb-8">
          <SettingsSection title="Cuenta" items={accountItems} />
          <SettingsSection title="Aplicación" items={applicationItems} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;