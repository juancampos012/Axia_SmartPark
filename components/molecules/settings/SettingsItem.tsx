import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Switch from '../../atoms/Switch';

export interface SettingsItemProps {
  icon: string;
  label: string;
  onPress?: () => void;
  rightElement?: 'chevron' | 'switch' | 'text';
  rightText?: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  disabled?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  label,
  onPress,
  rightElement = 'chevron',
  rightText,
  switchValue = false,
  onSwitchChange,
  disabled = false,
}) => {
  const content = (
    <View className="flex-row items-center justify-between py-4">
      {/* Left side: Icon and Label */}
      <View className="flex-row items-center flex-1">
        <Ionicons name={icon as any} size={24} color="#FFFFFF" />
        <Text className="text-white text-base font-primary ml-4">
          {label}
        </Text>
      </View>

      {/* Right side: Conditional rendering based on rightElement */}
      {rightElement === 'switch' && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          disabled={disabled}
        />
      )}

      {rightElement === 'text' && rightText && (
        <Text className="text-axia-gray text-sm font-primary mr-2">
          {rightText}
        </Text>
      )}

      {rightElement === 'chevron' && (
        <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
      )}
    </View>
  );

  // If it's a switch or disabled, don't wrap in TouchableOpacity
  if (rightElement === 'switch' || !onPress) {
    return <View className={disabled ? 'opacity-50' : ''}>{content}</View>;
  }

  // Otherwise, make it pressable
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={disabled ? 'opacity-50' : ''}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
  );
};

export default SettingsItem;
