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
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const borderColor = error
    ? 'border-red-500'
    : isFocused
    ? 'border-axia-purple'
    : 'border-axia-gray';

  return (
    <View className="w-full mb-4">
      <View
        className={`
          relative rounded-lg border ${borderColor} bg-axia-darkGray
          ${!editable ? 'opacity-60' : ''}
        `}
      >
        <TextInput
          className="px-4 py-4 text-white text-base font-primary"
          placeholder={placeholder}
          placeholderTextColor={!editable ? '#666' : '#8C8C8C'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry && (
          <Pressable
            onPress={togglePasswordVisibility}
            className="absolute right-4 top-4"
            disabled={!editable}
            accessibilityLabel={
              isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
            }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={!editable ? '#666' : '#8C8C8C'}
            />
          </Pressable>
        )}
      </View>

      {error && (
        <Text className="text-error text-sm mt-1 ml-1 font-primary">{error}</Text>
      )}
    </View>
  );
};

export default Input;
