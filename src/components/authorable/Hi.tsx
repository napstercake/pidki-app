import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

type HiProps = {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
};

const Hi = ({ image, title, subtitle }: HiProps) => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      borderRadius="l"
      padding="m"
      marginBottom="l"
      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
    >
      <Image
        source={image}
        style={{ width: 64, height: 64, marginRight: 16 }}
        resizeMode="contain"
      />
      <Box flex={1}>
        <Text variant="titleBold" color="text">
          {title}
        </Text>
        <Text variant="caption" color="textSecondary" marginTop="xs">
          {subtitle}
        </Text>
      </Box>
    </Box>
  );
};

export default Hi;
