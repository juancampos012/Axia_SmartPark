import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
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
  error
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className="w-full mb-4">
      <View className={`
        relative rounded-lg border
        ${isFocused ? 'border-axia-purple bg-axia-darkGray' : 'border-axia-gray bg-axia-darkGray'}
        ${error ? 'border-red-500' : ''}
      `}>
        <TextInput
          className="px-4 py-4 text-white text-base"
          placeholder={placeholder}
          placeholderTextColor="#8C8C8C"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-4 top-4"
            style={{ 
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24
            }}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color="#8C8C8C" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
};

export default Input;