import React from 'react';
import { View, Text } from 'react-native';
import SettingsItem, { SettingsItemProps } from '../../molecules/settings/SettingsItem';

interface SettingsSectionProps {
  title: string;
  items: SettingsItemProps[];
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  items,
}) => {
  return (
    <View className="mb-6">
      {/* Section Title */}
      <Text className="text-white text-lg font-semibold font-secondary mb-3 px-4">
        {title}
      </Text>

      {/* Section Items */}
      <View className="bg-[#161B22] rounded-2xl px-4 border border-white/5">
        {items.map((item, index) => (
          <View key={index}>
            <SettingsItem {...item} />
            {/* Add divider between items except for the last one */}
            {index < items.length - 1 && (
              <View className="h-[1px] bg-white/10" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

export default SettingsSection;
