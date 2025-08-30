import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  containerClassName?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  containerClassName = "",
  textClassName = "",
  className = "",
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 active:bg-blue-600';
      case 'secondary':
        return 'bg-gray-500 active:bg-gray-600';
      case 'success':
        return 'bg-green-500 active:bg-green-600';
      case 'danger':
        return 'bg-red-500 active:bg-red-600';
      case 'outline':
        return 'bg-transparent border-2 border-blue-500 active:bg-blue-50';
      default:
        return 'bg-blue-500 active:bg-blue-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-4';
      case 'md':
        return 'py-3 px-6';
      case 'lg':
        return 'py-4 px-8';
      default:
        return 'py-3 px-6';
    }
  };

  const getTextVariantClasses = () => {
    switch (variant) {
      case 'outline':
        return 'text-blue-500';
      default:
        return 'text-white';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      className={`
        rounded-lg items-center justify-center
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${(disabled || loading) ? 'opacity-50' : ''}
        ${containerClassName}
        ${className}
      `}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <Text
        className={`
          font-semibold
          ${getTextVariantClasses()}
          ${getTextSizeClasses()}
          ${textClassName}
        `}
      >
        {loading ? 'Cargando...' : title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;