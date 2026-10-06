import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React, { useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "outlined" | "large";
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  backgroundColor?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  variant = "default",
  icon,
  rightIcon,
  backgroundColor,
  ...props
}) => {
  const theme = useTheme<Theme>();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    if (variant === "outlined" || variant === "large") return "transparent";
    return theme.colors.white;
  };

  return (
    <Box marginBottom="m">
      {label && (
        <Text variant="body" color="text" marginBottom="xs" fontWeight="500">
          {label}
        </Text>
      )}

      <Box
        borderWidth={variant === "outlined" || variant === "large" ? 1 : 0}
        borderRadius="l"
        paddingHorizontal="m"
        paddingVertical="s"
        shadowColor="gray800"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={variant === "default" ? 0.1 : 0}
        shadowRadius={variant === "default" ? 2 : 0}
        elevation={variant === "default" ? 1 : 0}
        style={{
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
          ...(variant === "large" && { minHeight: 67 }),
        }}
      >
        <Box
          flexDirection="row"
          alignItems={variant === "large" ? "flex-start" : "center"}
        >
          {icon && (
            <Box
              marginRight="s"
              marginTop={variant === "large" ? "s" : undefined}
            >
              {icon}
            </Box>
          )}
          <Box flex={1}>
            <TextInput
              style={{
                fontSize: variant === "large" ? 28 : 16,
                fontWeight: variant === "large" ? "700" : "400",
                fontFamily:
                  variant === "large"
                    ? "PlusJakartaSans-Bold"
                    : "PlusJakartaSans",
                color:
                  variant === "large"
                    ? theme.colors.gray500
                    : theme.colors.text,
                paddingVertical: 8,
                ...(variant === "large" && {
                  height: 52,
                  textAlignVertical: "top",
                }),
              }}
              placeholderTextColor={theme.colors.gray400}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...props}
            />
          </Box>
          {rightIcon && <Box marginLeft="s">{rightIcon}</Box>}
        </Box>
      </Box>

      {(error || helperText) && (
        <Box marginTop="xs">
          <Text
            variant="caption"
            color={(error ? "error" : "textSecondary") as keyof Theme["colors"]}
          >
            {error || helperText}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default TextField;
