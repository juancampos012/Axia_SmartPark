import React from 'react';
import { ActivityIndicator, Text, View, Pressable } from 'react-native';

interface ButtonProps {
  title: string | React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = ''
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
      onPress={onPress}
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