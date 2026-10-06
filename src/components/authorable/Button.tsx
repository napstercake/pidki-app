import { Theme } from "@/theme";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { BouncingDots } from "./BouncingDots";
import { Box } from "./Box";
import { Text } from "./Text";

export type ButtonVariant =
  | "primary"
  | "primary2"
  | "secondary"
  | "outline"
  | "black"
  | "outlinePrimary"
  | "outlineSecondary"
  | "outlineError"
  | "gray"
  | "outlineGray"
  | "outlineWhite"
  | "white";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: "small" | "medium" | "large";
  title: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
  marginTop?: keyof Theme["spacing"];
  marginBottom?: keyof Theme["spacing"];
  marginLeft?: keyof Theme["spacing"];
  marginRight?: keyof Theme["spacing"];
  flex?: number;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  title,
  icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  flex,
  ...props
}) => {
  const variantStyles: Record<
    ButtonVariant,
    {
      backgroundColor: keyof Theme["colors"];
      borderColor: keyof Theme["colors"];
      textColor: keyof Theme["colors"];
    }
  > = {
    primary: {
      backgroundColor: "primary",
      borderColor: "transparent",
      textColor: "gray900",
    },
    primary2: {
      backgroundColor: "primary",
      borderColor: "transparent",
      textColor: "white",
    },
    secondary: {
      backgroundColor: "secondary",
      borderColor: "transparent",
      textColor: "white",
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: "primary",
      textColor: "primary",
    },
    black: {
      backgroundColor: "gray900",
      borderColor: "transparent",
      textColor: "white",
    },
    outlinePrimary: {
      backgroundColor: "transparent",
      borderColor: "primary",
      textColor: "primary",
    },
    outlineSecondary: {
      backgroundColor: "transparent",
      borderColor: "secondary",
      textColor: "secondary",
    },
    outlineError: {
      backgroundColor: "red100",
      borderColor: "error",
      textColor: "error",
    },
    gray: {
      backgroundColor: "gray400",
      borderColor: "transparent",
      textColor: "white",
    },
    outlineGray: {
      backgroundColor: "gray100",
      borderColor: "gray500",
      textColor: "gray600",
    },
    outlineWhite: {
      backgroundColor: "transparent",
      borderColor: "white",
      textColor: "white",
    },
    white: {
      backgroundColor: "white",
      borderColor: "transparent",
      textColor: "gray900",
    },
  };

  const sizeStyles: Record<
    NonNullable<ButtonProps["size"]>,
    {
      paddingVertical: keyof Theme["spacing"];
      paddingHorizontal: keyof Theme["spacing"];
      borderRadius: keyof Theme["borderRadii"];
      borderWidth?: number;
    }
  > = {
    small: {
      paddingVertical: "xs",
      paddingHorizontal: "m",
      borderRadius: "s",
    },
    medium: {
      paddingVertical: "s",
      paddingHorizontal: "l",
      borderRadius: "s",
    },
    large: {
      paddingVertical: "m",
      paddingHorizontal: "l",
      borderRadius: "xxxl",
      borderWidth: 2,
    },
  };

  const styles = variantStyles[variant];

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={{ flex }}
      {...props}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        backgroundColor={styles.backgroundColor}
        borderWidth={variant.includes("outline") ? 1 : 0}
        borderColor={styles.borderColor}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        marginRight={marginRight}
        {...sizeStyles[size]}
      >
        {loading ? (
          <BouncingDots
            color={styles.textColor}
            height={size === "small" ? 17 : size === "large" ? 22 : 20}
          />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <Box marginRight="s">{icon}</Box>
            )}
            <Text
              variant="button"
              color={styles.textColor}
              fontSize={size === "small" ? 14 : size === "large" ? 18 : 16}
              fontFamily={size === "large" ? "PlusJakartaSans-Bold" : undefined}
            >
              {title}
            </Text>
            {icon && iconPosition === "right" && (
              <Box marginLeft="s">{icon}</Box>
            )}
          </>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default Button;
