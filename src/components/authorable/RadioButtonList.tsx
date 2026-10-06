import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { Check } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

export interface RadioButtonOption {
  label: string;
  value: string;
  subtitle?: string;
}

type RadioButtonSize = "small" | "medium" | "large";

interface RadioButtonListProps {
  options: RadioButtonOption[];
  value: string;
  onChange: (value: string) => void;
  color?: string;
  size?: RadioButtonSize;
}

const sizeConfig = {
  small: {
    padding: 10,
    minHeight: 56,
    borderRadius: 8,
    titleVariant: "bodyBold" as const,
    subtitleVariant: "caption" as const,
    checkSize: 16,
    checkBoxSize: 24,
  },
  medium: {
    padding: 14,
    minHeight: 68,
    borderRadius: 10,
    titleVariant: "subtitle" as const,
    subtitleVariant: "caption" as const,
    checkSize: 18,
    checkBoxSize: 28,
  },
  large: {
    padding: 16,
    minHeight: 80,
    borderRadius: 12,
    titleVariant: "subtitleBold" as const,
    subtitleVariant: "caption" as const,
    checkSize: 20,
    checkBoxSize: 32,
  },
};

export const RadioButtonList: React.FC<RadioButtonListProps> = ({
  options,
  value,
  onChange,
  color,
  size = "large",
}) => {
  const theme = useTheme<Theme>();
  const cfg = sizeConfig[size];
  const activeColor = color ?? theme.colors.secondary;

  return (
    <Box gap="m">
      {options.map((opt) => {
        const isSelected = value === opt.value;

        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
            style={{
              backgroundColor: isSelected ? activeColor : theme.colors.white,
              borderWidth: 2,
              borderColor: isSelected ? activeColor : theme.colors.gray200,
              borderRadius: cfg.borderRadius,
              padding: cfg.padding,
              minHeight: cfg.minHeight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box flex={1}>
              <Text
                variant={cfg.titleVariant}
                color={isSelected ? "white" : "text"}
                marginBottom={opt.subtitle ? "xs" : undefined}
              >
                {opt.label}
              </Text>
              {opt.subtitle && (
                <Text
                  variant={cfg.subtitleVariant}
                  color={isSelected ? "white" : "textSecondary"}
                >
                  {opt.subtitle}
                </Text>
              )}
            </Box>

            <Box
              width={cfg.checkBoxSize}
              height={cfg.checkBoxSize}
              borderRadius="round"
              borderWidth={2}
              borderColor={isSelected ? "white" : "gray300"}
              backgroundColor={isSelected ? "white" : "transparent"}
              alignItems="center"
              justifyContent="center"
              marginLeft="m"
            >
              {isSelected && (
                <Check
                  size={cfg.checkSize}
                  color={activeColor}
                  strokeWidth={3}
                />
              )}
            </Box>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};

export default RadioButtonList;
