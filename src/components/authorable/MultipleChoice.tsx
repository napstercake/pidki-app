import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

interface Option<T extends string> {
  label: string;
  value: T;
}

interface MultipleChoiceProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function MultipleChoice<T extends string>({
  options,
  value,
  onChange,
}: MultipleChoiceProps<T>) {
  const theme = useTheme<Theme>();

  return (
    <Box
      flexDirection="row"
      borderRadius="round"
      padding="xs"
      style={{ backgroundColor: `${theme.colors.white}40` }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              ...(selected && {
                backgroundColor: theme.colors.white,
                shadowColor: theme.colors.gray400,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
                elevation: 2,
              }),
            }}
          >
            <Text
              variant="caption"
              color={selected ? "primary" : "white"}
              fontFamily={
                selected ? "PlusJakartaSans-Bold" : "PlusJakartaSans-Bold"
              }
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Box>
  );
}

export default MultipleChoice;
