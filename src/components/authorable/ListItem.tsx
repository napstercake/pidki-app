import { Theme } from "@/theme";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Box } from "./Box";
import { Button } from "./Button";
import { Text } from "./Text";

export interface ListItemProps {
  id: string;
  firstName: string;
  lastName: string;
  avatarUri?: string | null;
  avatarBackgroundColor?: keyof Theme["colors"];
  subtitle?: string;
  badgeLabel?: string;
  badgeVariant?: "primary" | "secondary" | "success" | "warning" | "white";
  actionLabel?: string;
  onActionPress?: () => void;
  actionLoading?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  firstName,
  lastName,
  avatarUri,
  avatarBackgroundColor = "gray300",
  subtitle,
  badgeLabel,
  badgeVariant = "success",
  actionLabel,
  onActionPress,
  actionLoading = false,
  onPress,
  isLast = false,
}) => {
  const content = (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingVertical="m"
      gap="m"
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomColor="borderLight"
    >
      <Avatar
        size="small"
        uri={avatarUri}
        firstName={firstName}
        lastName={lastName}
        backgroundColor={avatarBackgroundColor}
      />

      <Box flex={1} justifyContent="center">
        <Text variant="bodyBold" color="text">
          {firstName} {lastName}
        </Text>
        {subtitle && (
          <Text variant="caption" color="textSecondary" marginTop="xs">
            {subtitle}
          </Text>
        )}
      </Box>

      {badgeLabel && !actionLabel && (
        <Badge variant={badgeVariant} size="small">
          {badgeLabel}
        </Badge>
      )}

      {actionLabel && (
        <Button
          title={actionLabel}
          variant="outlineSecondary"
          size="small"
          onPress={onActionPress}
          loading={actionLoading}
        />
      )}
    </Box>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default ListItem;
