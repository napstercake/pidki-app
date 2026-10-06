import React from "react";
import { Box } from "./Box";
import { Button } from "./Button";
import { Text } from "./Text";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  actionIcon,
  onAction,
}) => {
  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="l"
      paddingTop="xxl"
    >
      {icon && <Box marginBottom="l">{icon}</Box>}

      <Text variant="subtitle" color="text" textAlign="center" marginBottom="s">
        {title}
      </Text>

      <Text
        variant="body"
        color="textSecondary"
        textAlign="center"
        marginBottom="l"
      >
        {description}
      </Text>

      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          variant="primary"
          size="large"
          icon={actionIcon}
        />
      )}
    </Box>
  );
};

export default EmptyState;
