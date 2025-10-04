// components/atoms/Checkbox.tsx
import React, { useEffect, useState } from "react";

export interface CheckboxProps {
  value?: boolean;
  defaultValue?: boolean;
  onValueChange?: (next: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg"; // Tailwind sizes instead of px
  color?: "green" | "purple" | "blue"; // Axia color options
  boxStyle?: string; // Tailwind classes
  labelStyle?: string; // Tailwind classes
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
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${checked ? colorClasses[color].checked : colorClasses[color].unchecked}
    ${sizeClasses[size]}
    ${boxStyle}
  `;

  const labelClasses = `
    text-sm transition-colors duration-200
    ${disabled ? "text-axia-gray cursor-not-allowed" : "text-axia-black cursor-pointer"}
    ${labelStyle}
  `;

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {/* Checkbox Button */}
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          className={checkboxClasses}
          role="checkbox"
          aria-checked={checked}
          aria-label={label || "Checkbox"}
        >
          {checked && (
            <svg 
              className={`${iconSizes[size]} text-axia-white`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </button>

        {/* Label */}
        {label && (
          <button
            type="button"
            onClick={pressLabel ? toggle : undefined}
            disabled={!pressLabel || disabled}
            className={`ml-3 text-left ${labelClasses}`}
          >
            {label}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-axia-error text-xs mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;