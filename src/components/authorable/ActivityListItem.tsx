import theme from "@/theme";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

export type ActivityListItemType = "success" | "warning" | "action";

export interface ActivityListItemData {
  id: string;
  type: ActivityListItemType;
  title: string;
  subtitle: string;
  amount?: string;
  amountPositive?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
}

interface ListItemProps extends ActivityListItemData {
  isLast?: boolean;
}

const iconByType: Record<ActivityListItemType, string> = {
  success: "✓",
  warning: "!",
  action: "⊕",
};

const bgColorByType: Record<ActivityListItemType, string> = {
  success: "#E6F7F1",
  warning: "#FEF9E7",
  action: "#FDECEA",
};

const iconColorByType: Record<ActivityListItemType, string> = {
  success: theme.colors.accent,
  warning: theme.colors.warning,
  action: theme.colors.error,
};

const ActivityListItem: React.FC<ListItemProps> = ({
  type,
  title,
  subtitle,
  amount,
  amountPositive,
  actionLabel,
  onActionPress,
  isLast = false,
}) => {
  const iconBg = bgColorByType[type];
  const iconColor = iconColorByType[type];
  const icon = iconByType[type];

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingVertical="m"
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomColor="borderLight"
    >
      {/* Icon circle */}
      <Box
        width={44}
        height={44}
        borderRadius="round"
        alignItems="center"
        justifyContent="center"
        style={{ backgroundColor: iconBg }}
        marginRight="m"
      >
        <Text style={{ color: iconColor, fontSize: 18, fontWeight: "700" }}>
          {icon}
        </Text>
      </Box>

      {/* Title + subtitle */}
      <Box flex={1}>
        <Text variant="bodyBold" color="text">
          {title}
        </Text>
        <Text variant="caption" color="textSecondary" marginTop="xs">
          {subtitle}
        </Text>
      </Box>

      {/* Right side: amount or action button */}
      {amount !== undefined && (
        <Text
          variant="bodyBold"
          style={{
            color: amountPositive ? theme.colors.accent : theme.colors.text,
          }}
        >
          {amountPositive ? `+${amount}` : amount}
        </Text>
      )}

      {actionLabel && (
        <TouchableOpacity
          onPress={onActionPress}
          style={{
            backgroundColor: theme.colors.accent,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: theme.borderRadii.round,
          }}
          activeOpacity={0.8}
        >
          <Text variant="captionBold" style={{ color: theme.colors.white }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </Box>
  );
};

export default ActivityListItem;
