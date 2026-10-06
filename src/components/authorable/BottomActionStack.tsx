import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { Info } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./Box";
import { Text } from "./Text";

interface BottomActionStackProps {
  secondaryAction?: React.ReactNode;
  primaryAction: React.ReactNode;
  infoLabel?: string;
  /** false renders inline (no bg/border/shadow/safe-area padding) instead of a bar pinned to the screen bottom. */
  floating?: boolean;
}

const BottomActionStack: React.FC<BottomActionStackProps> = ({
  secondaryAction,
  primaryAction,
  infoLabel,
  floating = true,
}) => {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  return (
    <Box
      paddingHorizontal={floating ? "l" : undefined}
      paddingTop={floating ? "m" : undefined}
      gap="m"
      borderTopWidth={floating ? 1 : undefined}
      borderTopColor={floating ? "border" : undefined}
      {...(floating && {
        backgroundColor: "white",
        shadowColor: "gray800",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
      })}
      style={
        floating
          ? { paddingBottom: insets.bottom + theme.spacing.m }
          : undefined
      }
    >
      {infoLabel && (
        <Box flexDirection="row" alignItems="center" gap="xs">
          <Info size={14} color={theme.colors.textLight} />
          <Text variant="caption" color="textLight" flex={1}>
            {infoLabel}
          </Text>
        </Box>
      )}
      <Box flexDirection="row" alignItems="center" gap="m">
        {secondaryAction}
        {primaryAction}
      </Box>
    </Box>
  );
};

export default BottomActionStack;
