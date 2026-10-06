import { Theme } from "@/theme";
import React from "react";
import { Box } from "./Box";
import { Text } from "./Text";

interface BadgeProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "white";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  size = "medium",
  children,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "primary" as keyof Theme["colors"],
          textColor: "white" as keyof Theme["colors"],
        };
      case "secondary":
        return {
          backgroundColor: "secondary" as keyof Theme["colors"],
          textColor: "white" as keyof Theme["colors"],
        };
      case "success":
        return {
          backgroundColor: "success" as keyof Theme["colors"],
          textColor: "white" as keyof Theme["colors"],
        };
      case "warning":
        return {
          backgroundColor: "warning" as keyof Theme["colors"],
          textColor: "white" as keyof Theme["colors"],
        };
      case "error":
        return {
          backgroundColor: "error" as keyof Theme["colors"],
          textColor: "white" as keyof Theme["colors"],
        };
      case "white":
        return {
          backgroundColor: "white" as keyof Theme["colors"],
          textColor: "text" as keyof Theme["colors"],
        };
      default:
        return {
          backgroundColor: "primary" as keyof Theme["colors"],
          textColor: "white" as keyof Theme["colors"],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: "xs" as keyof Theme["spacing"],
          paddingHorizontal: "m" as keyof Theme["spacing"],
          borderRadius: "m" as keyof Theme["borderRadii"],
          fontSize: 12,
        };
      case "large":
        return {
          paddingVertical: "s" as keyof Theme["spacing"],
          paddingHorizontal: "l" as keyof Theme["spacing"],
          borderRadius: "l" as keyof Theme["borderRadii"],
          fontSize: 16,
        };
      default:
        return {
          paddingVertical: "xs" as keyof Theme["spacing"],
          paddingHorizontal: "m" as keyof Theme["spacing"],
          borderRadius: "m" as keyof Theme["borderRadii"],
          fontSize: 14,
        };
    }
  };

  const styles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Box
      backgroundColor={styles.backgroundColor}
      borderRadius={sizeStyles.borderRadius}
      paddingVertical={sizeStyles.paddingVertical}
      paddingHorizontal={sizeStyles.paddingHorizontal}
      alignSelf="flex-start"
    >
      <Text
        color={styles.textColor}
        fontSize={sizeStyles.fontSize}
        fontWeight="600"
        variant="captionUpperBold"
      >
        {children}
      </Text>
    </Box>
  );
};

export default Badge;
