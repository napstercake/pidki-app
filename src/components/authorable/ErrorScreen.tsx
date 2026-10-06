import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { Box } from "./Box";
import { Button } from "./Button";
import Gradient from "./Gradient";
import { Text } from "./Text";

interface ErrorScreenProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  const theme = useTheme<Theme>();

  return (
    <Gradient
      colors={[
        theme.colors.linearGradientPrimary1,
        theme.colors.linearGradientPrimary3,
        theme.colors.linearGradientPrimary2,
      ]}
      style={{ flex: 1 }}
    >
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal="l"
      >
        <Box
          width={88}
          height={88}
          borderRadius="round"
          alignItems="center"
          justifyContent="center"
          marginBottom="l"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          {icon}
        </Box>

        <Text
          variant="titleBold"
          color="white"
          textAlign="center"
          marginBottom="s"
          style={{ fontSize: 24 }}
        >
          {title}
        </Text>

        {description && (
          <Text
            variant="body"
            color="white"
            textAlign="center"
            marginBottom="xl"
            style={{ opacity: 0.85 }}
          >
            {description}
          </Text>
        )}

        {actionText && onAction && (
          <Box width="100%">
            <Button
              title={actionText}
              variant="white"
              size="large"
              onPress={onAction}
            />
          </Box>
        )}
      </Box>
    </Gradient>
  );
};

export default ErrorScreen;
