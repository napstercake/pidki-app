import { Box } from "@/components/authorable/Box";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface IconButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  backgroundColor?: string;
  size?: number;
}

const IconButton = ({
  children,
  backgroundColor = "rgba(255,255,255,0.25)",
  size = 36,
  ...props
}: IconButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} {...props}>
      <Box
        borderRadius="round"
        alignItems="center"
        justifyContent="center"
        style={{ width: size, height: size, backgroundColor }}
      >
        {children}
      </Box>
    </TouchableOpacity>
  );
};

export default IconButton;
