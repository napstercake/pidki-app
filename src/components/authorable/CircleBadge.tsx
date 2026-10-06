import { Theme } from "@/theme";
import React from "react";
import { Box } from "./Box";
import { Text } from "./Text";

interface CircleBadgeProps {
  currentRound: number;
  totalRounds: number;
  backgroundColor?: keyof Theme["colors"];
  textColor?: keyof Theme["colors"];
  size?: number;
}

const CircleBadge: React.FC<CircleBadgeProps> = ({
  currentRound,
  totalRounds,
  backgroundColor = "white",
  textColor = "secondary",
  size = 40,
}) => {
  return (
    <Box
      width={size}
      height={size}
      borderRadius="round"
      backgroundColor={backgroundColor}
      alignItems="center"
      justifyContent="center"
      shadowColor="gray900"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.2}
      shadowRadius={4}
    >
      <Text>
        <Text color={textColor} variant="titleBold">
          {currentRound}
        </Text>
        <Text variant="caption">/{totalRounds}</Text>
      </Text>
    </Box>
  );
};

export default CircleBadge;
