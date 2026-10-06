import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { Box } from "./Box";
import { Text } from "./Text";

interface CornerRibbonProps {
  label: string;
  value: string | number;
  color?: keyof Theme["colors"];
  textColor?: keyof Theme["colors"];
  size?: number;
}

const CornerRibbon: React.FC<CornerRibbonProps> = ({
  label,
  value,
  color = "primary",
  textColor = "white",
  size = 95,
}) => {
  const theme = useTheme<Theme>();

  return (
    <>
      <Box
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderTopWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: size,
          borderBottomWidth: size,
          borderTopColor: "transparent",
          borderLeftColor: "transparent",
          borderRightColor: theme.colors[color],
          borderBottomColor: "transparent",
        }}
      />
      <Box
        style={{
          position: "absolute",
          top: 14,
          right: 10,
          alignItems: "flex-end",
        }}
      >
        <Text
          variant="captionUpperBold"
          color={textColor}
          style={{ letterSpacing: 1 }}
        >
          {label}
        </Text>
        <Text
          color={textColor}
          variant="subtitleBold"
          style={{ fontSize: 14, fontWeight: "800", marginTop: -2 }}
        >
          {value}
        </Text>
      </Box>
    </>
  );
};

export default CornerRibbon;
