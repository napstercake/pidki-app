import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { Box } from "./Box";
import { Button } from "./Button";
import { Text } from "./Text";

type Variant = "success" | "warning" | "error";

interface NotificationItemProps {
  variant?: Variant;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const variantStyles: Record<
  Variant,
  {
    cardBackground: keyof Theme["colors"];
    cardBorder: keyof Theme["colors"];
    iconBackground: keyof Theme["colors"];
    buttonVariant: "primary" | "outlineError" | "black" | "primary2";
  }
> = {
  warning: {
    cardBackground: "yellow100",
    cardBorder: "yellow200",
    iconBackground: "yellow300",
    buttonVariant: "primary2",
  },
  success: {
    cardBackground: "green500",
    cardBorder: "green600",
    iconBackground: "green600",
    buttonVariant: "black",
  },
  error: {
    cardBackground: "red100",
    cardBorder: "red500",
    iconBackground: "red500",
    buttonVariant: "outlineError",
  },
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  variant = "warning",
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme<Theme>();
  const styles = variantStyles[variant];

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      gap="m"
      padding="m"
      borderRadius="xl"
      borderWidth={1.5}
      borderColor={styles.cardBorder}
      style={{ backgroundColor: theme.colors[styles.cardBackground] }}
    >
      {/* Icon */}
      <Box
        width={44}
        height={44}
        borderRadius="round"
        alignItems="center"
        justifyContent="center"
        backgroundColor={styles.iconBackground}
      >
        {icon}
      </Box>

      {/* Text */}
      <Box flex={1} gap="xs">
        <Text variant="bodyBold" color="text">
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="textSecondary">
            {subtitle}
          </Text>
        )}
      </Box>

      {/* Action */}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          variant={styles.buttonVariant}
          onPress={onAction}
          size="small"
        />
      )}
    </Box>
  );
};

export default NotificationItem;
