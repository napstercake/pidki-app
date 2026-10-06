import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { View } from "react-native";
import { Box } from "./Box";

interface SegmentedProgressBarProps {
  segments: number;
  filledCount: number;
  color?: string;
  inactiveColor?: string;
  height?: number;
}

const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({
  segments,
  filledCount,
  color,
  inactiveColor,
  height = 8,
}) => {
  const theme = useTheme<Theme>();
  const filledColor = color ?? theme.colors.primary;
  const emptyColor = inactiveColor ?? theme.colors.gray200;

  return (
    <Box flexDirection="row" gap="xs">
      {Array.from({ length: segments }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height,
            borderRadius: height / 2,
            backgroundColor: i < filledCount ? filledColor : emptyColor,
          }}
        />
      ))}
    </Box>
  );
};

export default SegmentedProgressBar;
