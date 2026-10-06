import theme from "@/theme";
import React from "react";
import { View } from "react-native";

type Size = "small" | "medium" | "large";

interface CircleIconProps {
  icon: React.ReactNode;
  size?: Size;
  backgroundColor?: string;
  borderColor?: string;
  shadow?: boolean;
}

const dimensions: Record<Size, number> = {
  small: 40,
  medium: 56,
  large: 72,
};

const CircleIcon: React.FC<CircleIconProps> = ({
  icon,
  size = "medium",
  backgroundColor = theme.colors.white,
  borderColor = theme.colors.gray200,
  shadow = true,
}) => {
  const dim = dimensions[size];

  return (
    <View
      style={{
        width: dim,
        height: dim,
        borderRadius: dim / 2,
        backgroundColor,
        borderWidth: 1,
        borderColor,
        alignItems: "center",
        justifyContent: "center",
        ...(shadow && {
          shadowColor: theme.colors.gray800,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }),
      }}
    >
      {icon}
    </View>
  );
};

export default CircleIcon;
