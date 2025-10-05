import React, { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  editable?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  editable = true,
  className = '',
  leftIcon,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyles = () => {
    const baseStyles = `
      relative rounded-2xl bg-axia-darkGray/80 border-2
      transition-all duration-200 shadow-lg
      ${!editable ? 'opacity-60' : ''}
    `;

    if (error) {
      return `${baseStyles} border-red-500/60 shadow-red-500/10`;
    }
    if (isFocused) {
      return `${baseStyles} border-axia-green shadow-axia-green/20`;
    }
    return `${baseStyles} border-axia-gray/30 shadow-black/10`;
  };

  return (
    <View className={`w-full mb-5 ${className}`}>
      <View className={getContainerStyles()}>
        {/* Icono izquierdo */}
        {leftIcon && (
          <View className="absolute left-4 top-4 z-10">
            {leftIcon}
          </View>
        )}

        {/* Input principal */}
        <TextInput
          className={`
            px-5 py-4 text-white text-base font-primary
            ${leftIcon ? 'pl-12' : ''}
            ${secureTextEntry ? 'pr-12' : ''}
          `}
          placeholder={placeholder}
          placeholderTextColor={!editable ? '#666' : '#9CA3AF'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor="#10B981"
        />

        {/* Icono de contraseña */}
        {secureTextEntry && (
          <Pressable
            onPress={togglePasswordVisibility}
            className={`
              absolute right-4 top-4 
              w-8 h-8 rounded-lg items-center justify-center
              active:scale-90 transition-all
              ${!editable ? 'opacity-40' : 'active:bg-axia-gray/20'}
            `}
            disabled={!editable}
            accessibilityLabel={
              isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={!editable ? '#666' : '#6B7280'}
            />
          </Pressable>
        )}
      </View>

      {/* Mensaje de error */}
      {error && (
        <View className="flex-row items-center mt-2 ml-1">
          <Ionicons name="warning-outline" size={14} color="#EF4444" />
          <Text className="text-red-400 text-sm font-primary ml-1">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;