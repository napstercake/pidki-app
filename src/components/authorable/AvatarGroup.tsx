import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { Avatar } from "./Avatar";
import { Box } from "./Box";
import { Text } from "./Text";

type AvatarGroupMember = {
  id?: string;
  user: {
    avatarUrl?: string | null;
    firstName?: string;
    lastName?: string;
  };
};

type AvatarGroupProps = {
  members: AvatarGroupMember[];
  maxVisible?: number;
};

export const AvatarGroup = ({ members, maxVisible = 3 }: AvatarGroupProps) => {
  const theme = useTheme<Theme>();
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;

  return (
    <Box flexDirection="row" alignItems="center">
      {visibleMembers.map((member, index) => (
        <Box
          key={member.id ?? index}
          style={{
            marginLeft: index === 0 ? 0 : -8,
            borderWidth: 2,
            borderColor: theme.colors.white,
            borderRadius: 20,
            zIndex: members.length - index,
          }}
        >
          <Avatar
            size="small"
            uri={member.user.avatarUrl}
            firstName={member.user.firstName ?? ""}
            lastName={member.user.lastName ?? ""}
            backgroundColor="gray200"
          />
        </Box>
      ))}
      {extraCount > 0 && (
        <Box
          backgroundColor="gray300"
          borderRadius="round"
          width={32}
          height={32}
          alignItems="center"
          justifyContent="center"
          style={{
            marginLeft: -8,
            borderWidth: 2,
            borderColor: theme.colors.white,
          }}
        >
          <Text variant="caption" color="text" fontWeight="600">
            +{extraCount}
          </Text>
        </Box>
      )}
    </Box>
  );
};
