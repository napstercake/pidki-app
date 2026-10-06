import { Theme } from "@/theme";
import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

interface AvatarProps {
  size?: "small" | "medium" | "large" | "extralarge";
  source?: ImageSourcePropType;
  uri?: string | null;
  firstName?: string;
  lastName?: string;
  backgroundColor?: keyof Theme["colors"];
}

export const Avatar: React.FC<AvatarProps> = ({
  size = "medium",
  source,
  uri,
  firstName = "",
  lastName = "",
  backgroundColor = "primary",
}) => {
  const sizeMap = { small: 32, medium: 48, large: 64, extralarge: 96 };
  const fontSizeMap = { small: 12, medium: 16, large: 20, extralarge: 32 };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const avatarSize = sizeMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <Box
      width={avatarSize}
      height={avatarSize}
      borderRadius="round"
      backgroundColor={backgroundColor}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {source || uri ? (
        <Image
          source={uri ? { uri } : source}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          }}
          onError={(e) =>
            console.log("Avatar image error:", uri, e.nativeEvent.error)
          }
        />
      ) : (
        <Text color="gray500" fontSize={fontSize} fontWeight="600">
          {initials}
        </Text>
      )}
    </Box>
  );
};

export default Avatar;
