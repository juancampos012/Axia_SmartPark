// components/atoms/Checkbox.tsx
import React, { useEffect, useState } from "react";
import {
  Pressable,
  View,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface CheckboxProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (next: boolean) => void;
  label?: string;
  size?: number; // px
  color?: string; // hex or tailwind color (used for icon/background via inline style)
  boxStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  error?: string;
  pressLabel?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  value,
  defaultValue = false,
  onValueChange,
  label,
  size = 22,
  color = "axia-green",
  boxStyle,
  labelStyle,
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

  const toggle = (evt?: GestureResponderEvent) => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const boxBorderColor = checked ? color : "#CBD5E1"; // tailwind gray-300
  const boxBgColor = checked ? color : "transparent";

  return (
    <View className="flex-col">
      <View className="flex-row items-center">
        <Pressable
          onPress={toggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
          accessibilityLabel={label ?? "Checkbox"}
          className={`rounded ${disabled ? "opacity-50" : "opacity-100"}`}
          style={[
            {
              width: size,
              height: size,
              borderRadius: Math.max(4, Math.round(size * 0.18)),
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
              borderColor: boxBorderColor,
              backgroundColor: boxBgColor,
            },
            boxStyle,
          ]}
        >
          {checked && <Ionicons name="checkmark" size={Math.round(size * 0.7)} color="#fff" />}
        </Pressable>

        {label ? (
          <Pressable
            onPress={pressLabel ? toggle : undefined}
            disabled={!pressLabel || disabled}
            className="ml-3"
            style={labelStyle}
          >
            <Text className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}>
              {label}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text className="text-red-600 text-xs mt-2 ml-1">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default Checkbox;
