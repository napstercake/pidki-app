import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Box } from "./Box";
import { Text } from "./Text";

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: keyof Theme["colors"];
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  leftLabel?: string;
  size?: "small" | "medium" | "large";
}

export default function ProgressBar({
  progress,
  height = 8,
  backgroundColor = "gray200",
  showPercentage = false,
  showLabel = false,
  label,
  leftLabel,
  size = "medium",
}: ProgressBarProps) {
  const theme = useTheme<Theme>();

  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const HEIGHT_MAP = { small: 4, medium: height, large: 12 };
  const FONT_SIZE_MAP = { small: 10, medium: 12, large: 14 };

  return (
    <Box>
      {(showPercentage || leftLabel) && (
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="s"
        >
          <Text
            variant="caption"
            color="textSecondary"
            fontSize={FONT_SIZE_MAP[size]}
            fontWeight="600"
          >
            {leftLabel ?? ""}
          </Text>
          {showPercentage && (
            <Text
              variant="caption"
              color="textSecondary"
              fontSize={FONT_SIZE_MAP[size]}
              fontWeight="600"
            >
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </Box>
      )}

      <Box
        backgroundColor={backgroundColor}
        borderRadius="round"
        height={HEIGHT_MAP[size]}
        overflow="hidden"
      >
        <LinearGradient
          colors={[theme.colors.secondary, `${theme.colors.secondary}22`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: `${clampedProgress}%`,
            height: "100%",
            borderRadius: 50,
          }}
        />
      </Box>
    </Box>
  );
}
