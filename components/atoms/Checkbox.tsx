// components/atoms/Checkbox.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface CheckboxProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (next: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "green" | "purple" | "blue";
  boxStyle?: string;
  labelStyle?: string;
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
  boxStyle = "",
  labelStyle = "",
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

  // Size mappings
  const sizeClasses = {
    sm: "w-4 h-4 rounded",
    md: "w-5 h-5 rounded-md",
    lg: "w-6 h-6 rounded-md"
  };

  const iconSizes = {
    sm: 12,
    md: 16, 
    lg: 20
  };

  // Color mappings for Axia palette
  const colorClasses = {
    green: {
      checked: "border-axia-green bg-axia-green",
      unchecked: "border-axia-gray",
    },
    purple: {
      checked: "border-axia-purple bg-axia-purple", 
      unchecked: "border-axia-gray",
    },
    blue: {
      checked: "border-axia-blue bg-axia-blue",
      unchecked: "border-axia-gray",
    }
  };

  const checkboxClasses = `
    flex items-center justify-center
    border-2
    ${disabled ? "opacity-50" : ""}
    ${checked ? colorClasses[color].checked : colorClasses[color].unchecked}
    ${sizeClasses[size]}
    ${boxStyle}
  `;

  const labelClasses = `
    text-sm
    ${disabled ? "text-axia-gray" : "text-white"}
    ${labelStyle}
  `;

  return (
    <View className="flex-col">
      <View className="flex-row items-center">
        {/* Checkbox Button */}
        <Pressable
          onPress={toggle}
          disabled={disabled}
          className={checkboxClasses}
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
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
          <Pressable
            onPress={pressLabel ? toggle : undefined}
            disabled={!pressLabel || disabled}
            className="ml-3 flex-1"
          >
            <Text className={labelClasses}>
              {label}
            </Text>
          </Pressable>
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