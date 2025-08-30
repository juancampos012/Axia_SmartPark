import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  className = "",
  ...props
}) => {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className={`text-base font-semibold text-gray-800 mb-2 ${labelClassName}`}>
          {label}
        </Text>
      )}
      
      <TextInput
        className={`
          border border-gray-300 rounded-lg px-4 py-3 text-base bg-white text-gray-800
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${props.editable === false ? 'bg-gray-100 text-gray-500' : ''}
          ${inputClassName}
          ${className}
        `}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      
      {error && (
        <Text className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;