import React, { useEffect, useState } from "react";
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CheckboxProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (next: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "green" | "purple" | "blue";
  disabled?: boolean;
  error?: string;
  pressLabel?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  value,
  defaultValue = false,
  onValueChange,
  label,
  size = "md",
  color = "green",
  disabled = false,
  error,
  pressLabel = true,
}) => {
  const isControlled = typeof value === "boolean";
  const [internal, setInternal] = useState<boolean>(defaultValue);

  useEffect(() => {
    if (isControlled) setInternal(Boolean(value));
  }, [value, isControlled]);

  const checked = isControlled ? Boolean(value) : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  // Size classes para el checkbox
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  // Tamaños de icono
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  // Color classes para Axia palette
  const colorClasses = {
    green: {
      checked: "bg-axia-green border-axia-green",
      unchecked: "border-white/40",
    },
    purple: {
      checked: "bg-axia-purple border-axia-purple", 
      unchecked: "border-white/40",
    },
    blue: {
      checked: "bg-axia-blue border-axia-blue",
      unchecked: "border-white/40",
    }
  };

  return (
    <View>
      <View className="flex-row items-center">
        {/* Checkbox Box */}
        <Pressable
          onPress={toggle}
          disabled={disabled}
          className={`
            ${sizeClasses[size]}
            rounded
            border-2
            items-center
            justify-center
            ${disabled ? "opacity-50" : ""}
            ${checked ? colorClasses[color].checked : colorClasses[color].unchecked}
          `}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={label || "Checkbox"}
        >
          {checked && (
            <Ionicons 
              name="checkmark" 
              size={iconSizes[size]} 
              color="#FFFFFF" 
            />
          )}
        </Pressable>

        {/* Label */}
        {label && (
          pressLabel && !disabled ? (
            <Pressable onPress={toggle} className="ml-3 flex-1">
              <Text className={`text-sm ${disabled ? "text-axia-gray" : "text-white"}`}>
                {label}
              </Text>
            </Pressable>
          ) : (
            <Text className={`text-sm ml-3 flex-1 ${disabled ? "text-axia-gray" : "text-white"}`}>
              {label}
            </Text>
          )
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Checkbox;