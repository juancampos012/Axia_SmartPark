// components/atoms/Checkbox.tsx
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";

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
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  // Color mappings for Axia palette
  const colorClasses = {
    green: {
      checked: "border-axia-green bg-axia-green",
      unchecked: "border-axia-gray hover:border-axia-darkGray",
    },
    purple: {
      checked: "border-axia-purple bg-axia-purple", 
      unchecked: "border-axia-gray hover:border-axia-darkGray",
    },
    blue: {
      checked: "border-axia-blue bg-axia-blue",
      unchecked: "border-axia-gray hover:border-axia-darkGray",
    }
  };

  const checkboxClasses = `
    flex items-center justify-center
    border-2 transition-all duration-200
    ${disabled ? "opacity-50" : ""}
    ${checked ? colorClasses[color].checked : colorClasses[color].unchecked}
    ${sizeClasses[size]}
    ${boxStyle}
  `;

  const labelClasses = `
    text-sm
    ${disabled ? "text-axia-gray" : "text-axia-black"}
    ${labelStyle}
  `;

  return (
    <View className="flex flex-col">
      <View className="flex flex-row items-center">
        {/* Checkbox Button */}
        <TouchableOpacity
          onPress={toggle}
          disabled={disabled}
          className={checkboxClasses}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={label || "Checkbox"}
        >
          {checked && (
            <View className={`${iconSizes[size]} flex items-center justify-center`}>
              <Text className="text-axia-white font-bold">✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Label */}
        {label && (
          <TouchableOpacity
            onPress={pressLabel ? toggle : undefined}
            disabled={!pressLabel || disabled}
            className={`ml-3 ${!pressLabel || disabled ? "opacity-50" : ""}`}
          >
            <Text className={labelClasses}>
              {label}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text className="text-axia-error text-xs mt-1 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Checkbox;