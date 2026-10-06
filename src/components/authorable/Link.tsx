import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

type IconProp = React.ReactNode | ((color: string) => React.ReactNode);

interface LinkProps extends TouchableOpacityProps {
  title: string;
  color?: keyof Theme["colors"];
  iconLeft?: IconProp;
  iconRight?: IconProp;
  fontSize?: number;
}

export const Link: React.FC<LinkProps> = ({
  title,
  color = "primary",
  iconLeft,
  iconRight,
  fontSize,
  ...props
}) => {
  const theme = useTheme<Theme>();
  const resolvedColor = theme.colors[color];

  const renderIcon = (icon: IconProp) =>
    typeof icon === "function" ? icon(resolvedColor) : icon;

  return (
    <TouchableOpacity activeOpacity={0.6} {...props}>
      <Box flexDirection="row" alignItems="center" gap="xs">
        {iconLeft && renderIcon(iconLeft)}
        <Text paddingHorizontal="s" variant="bodyBold" color={color} fontSize={fontSize}>
          {title}
        </Text>
        {iconRight && renderIcon(iconRight)}
      </Box>
    </TouchableOpacity>
  );
};

export default Link;
