import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

interface GradientProps {
  colors: [string, string, ...string[]];
  type?: "linear" | "radial";
  direction?: "horizontal" | "vertical" | "diagonal";
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const Gradient: React.FC<GradientProps> = ({
  colors,
  type = "linear",
  direction = "diagonal",
  style,
  children,
}) => {
  let start = { x: 0, y: 0 };
  let end = { x: 1, y: 1 };

  if (type === "radial") {
    start = { x: 0.5, y: 0.5 };
    end = { x: 1, y: 1 };
  } else if (direction === "vertical") {
    start = { x: 0, y: 0 };
    end = { x: 0, y: 1 };
  } else if (direction === "horizontal") {
    start = { x: 0, y: 0 };
    end = { x: 1, y: 0 };
  }

  return (
    <LinearGradient colors={colors} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
};

export default Gradient;
