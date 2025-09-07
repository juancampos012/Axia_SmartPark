import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onSubmit?: () => void;
  onSignUpPress?: () => void;
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onSignUpPress, 
  onGooglePress, 
  onFacebookPress 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Aquí se agregará la validación con zod y react-hook-form posteriormente
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <View className="w-full px-6">
      {/* Inputs */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Botón Sign In */}
      <Button
        title="SIGN IN"
        onPress={handleSubmit}
        className="w-full mt-4"
      />

      {/* Separador "Or login with" */}
      <View className="flex-row items-center my-8">
        <View className="flex-1 h-px bg-axia-gray" />
        <Text className="px-4 text-axia-gray text-sm">Or login with</Text>
        <View className="flex-1 h-px bg-axia-gray" />
      </View>

      {/* Botones de redes sociales */}
      <View className="flex-row justify-between space-x-6 mb-8 px-8">
        {/* Botón Google */}
        <TouchableOpacity
          onPress={onGooglePress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center mx-4"
        >
          <Ionicons name="logo-google" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Botón Facebook */}
        <TouchableOpacity
          onPress={onFacebookPress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center mx-3"
        >
          <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Link para Sign Up */}
      <View className="flex-row justify-center items-center">
        <Text className="text-axia-gray text-base">
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={onSignUpPress}>
          <Text className="text-axia-green text-base font-semibold">
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;