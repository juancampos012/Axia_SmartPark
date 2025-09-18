import React from 'react';
import { ActivityIndicator, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
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
        return 'h-10';
      case 'large':
        return 'h-14';
      default:
        return 'h-12';
    }
  };

  const content = (
    <View className="flex-row items-center justify-center px-6">
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text
          className={`font-semibold ${
            variant === 'outline' ? 'text-white' : 'text-white'
          }`}
        >
          {title}
        </Text>
      )}
    </View>
  );

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={`w-full rounded-xl overflow-hidden border-2 border-transparent ${getSizeStyles()} ${
          isDisabled ? 'opacity-50' : ''
        } ${className}`}
        style={({ pressed }) => ({
          borderRadius: 16,
          opacity: pressed ? 0.7 : 1
        })}
      >
        <LinearGradient
          colors={['#780BB7', '#093774']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 16
          }}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  const baseStyles =
    variant === 'secondary'
      ? 'bg-axia-darkGray'
      : 'border-2 border-white/30 bg-transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`w-full rounded-xl items-center justify-center ${getSizeStyles()} ${baseStyles} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      style={({ pressed }) => ({
        borderRadius: 16,
        opacity: pressed ? 0.7 : 1
      })}
    >
      {content}
    </Pressable>
  );
};

export default Button;
