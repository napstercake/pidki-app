import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Avatar } from "./Avatar";
import { Box } from "./Box";
import { Text } from "./Text";

export interface StackListItemProps {
  id: string;
  title: string;
  subtitle?: string;
  highlightedText?: string;
  highlightColor?: keyof Theme["colors"];
  avatarUri?: string | null;
  avatarInitialsSource?: string;
  avatarBackgroundColor?: keyof Theme["colors"];
  onPress?: () => void;
}

const StackListItem: React.FC<StackListItemProps> = ({
  title,
  subtitle,
  highlightedText,
  highlightColor = "error",
  avatarUri,
  avatarInitialsSource,
  avatarBackgroundColor = "secondary",
  onPress,
}) => {
  const theme = useTheme<Theme>();
  const [initialsFirst, initialsLast] = (
    avatarInitialsSource ?? title
  )
    .trim()
    .split(/\s+/);

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="white"
        borderRadius="l"
        padding="m"
        gap="m"
        shadowColor="gray800"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.06}
        shadowRadius={8}
        elevation={2}
      >
        <Box style={{ opacity: 0.85 }}>
          <Avatar
            size="medium"
            uri={avatarUri}
            firstName={initialsFirst}
            lastName={initialsLast}
            backgroundColor={avatarBackgroundColor}
          />
        </Box>

        <Box flex={1} justifyContent="center">
          <Text variant="bodyBold" color="text">
            {title}
          </Text>
          {(subtitle || highlightedText) && (
            <Text variant="caption" color="textSecondary" marginTop="xs">
              {subtitle}
              {subtitle && highlightedText ? " · " : ""}
              {highlightedText && (
                <Text variant="captionBold" color={highlightColor}>
                  {highlightedText}
                </Text>
              )}
            </Text>
          )}
        </Box>

        {onPress && (
          <ChevronRight size={20} color={theme.colors.textLight} />
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default StackListItem;
