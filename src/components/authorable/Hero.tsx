import theme from "@/theme";
import React from "react";
import { View } from "react-native";
import { Box } from "./Box";
import { Button, ButtonVariant } from "./Button";
import { Text } from "./Text";

interface HeroStat {
  label: string;
  value: string;
}

interface HeroProps {
  poolLabel?: string;
  poolAmount: string;
  stats?: [HeroStat, HeroStat];
  ctaButton?: {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: "small" | "medium" | "large";
  };
}

export default function Hero({
  poolLabel = "POZO POR RONDA",
  poolAmount,
  stats,
  ctaButton,
}: HeroProps) {
  return (
    <Box
      backgroundColor="white"
      borderRadius="l"
      padding="l"
      shadowColor="gray800"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={8}
      elevation={3}
      gap="m"
    >
      <Text variant="captionUpperBold" color="secondary" textAlign="center">
        {poolLabel}
      </Text>

      <Text
        variant="HeaderMiniBold"
        color="gray900"
        style={{ fontSize: 32, lineHeight: 38 }}
        textAlign="center"
      >
        {poolAmount}
      </Text>

      {stats && (
        <>
          <Box
            height={1}
            backgroundColor="border"
            style={{ marginHorizontal: -theme.spacing.l }}
          />

          <Box
            flexDirection="row"
            style={{
              marginHorizontal: -theme.spacing.l,
              marginBottom: -theme.spacing.l,
              marginTop: -theme.spacing.m,
            }}
          >
            <Box flex={1} gap="xs" padding="l">
              <Text
                variant="captionUpperBold"
                color="secondary"
                textAlign="center"
              >
                {stats[0].label}
              </Text>
              <Text variant="bodyBold" color="gray600" textAlign="center">
                {stats[0].value}
              </Text>
            </Box>

            <View
              style={{
                width: 1,
                backgroundColor: theme.colors.border,
                alignSelf: "stretch",
              }}
            />

            <Box flex={1} gap="xs" padding="l">
              <Text
                variant="captionUpperBold"
                color="secondary"
                textAlign="center"
              >
                {stats[1].label}
              </Text>
              <Text variant="bodyBold" color="gray600" textAlign="center">
                {stats[1].value}
              </Text>
            </Box>
          </Box>
        </>
      )}

      {ctaButton && (
        <Box marginTop="m">
          <Button
            title={ctaButton.title}
            onPress={ctaButton.onPress}
            variant={ctaButton.variant ?? "primary"}
            size={ctaButton.size ?? "medium"}
          />
        </Box>
      )}
    </Box>
  );
}
