import React from 'react';
import { ActivityIndicator, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string | React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  hapticFeedback?: boolean | 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  hapticFeedback = 'light' // Por defecto feedback ligero
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'h-10 px-4';
      case 'large':
        return 'h-14 px-8';
      default:
        return 'h-12 px-6';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-axia-green active:bg-axia-green/90 border-2 border-axia-green';
      case 'secondary':
        return 'bg-axia-green/10 border-2 border-axia-green active:bg-axia-green/20';
      case 'outline':
        return 'bg-transparent border-2 border-white/30 active:bg-white/10';
      default:
        return 'bg-axia-green active:bg-axia-green/90 border-2 border-axia-green';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-axia-green';
      case 'outline':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  const triggerHaptic = async (type: string | boolean) => {
    try {
      if (type === false) return; // Si está deshabilitado
      
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('Haptics no disponibles:', error);
    }
  };

  const handlePress = async () => {
    // Trigger haptic feedback antes de ejecutar la acción
    if (!disabled && !loading) {
      await triggerHaptic(hapticFeedback);
    }
    
    if (!disabled && !loading) {
      onPress();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          color={variant === 'primary' ? "#FFFFFF" : "#006B54"} 
          size="small" 
        />
      );
    }

    if (typeof title === 'string') {
      return (
        <Text className={`font-primaryBold text-base ${getTextColor()}`}>
          {title}
        </Text>
      );
    }

    return title;
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      className={`
        w-full rounded-xl items-center justify-center 
        ${getSizeStyles()} 
        ${getVariantStyles()}
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
      })}
    >
      {renderContent()}
    </Pressable>
  );
};

export default Button;