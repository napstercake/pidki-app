import { Text, TextProps } from "@/components/authorable/Text";
import { formatCurrency } from "@/utils/common";
import React from "react";
import { Box } from "./Box";

interface AmountTitleProps {
  amount: number;
  variant?: TextProps["variant"];
  color?: TextProps["color"];
}

const AmountTitle: React.FC<AmountTitleProps> = ({
  amount,
  variant = "HeaderGiantBold",
  color = "gray900",
}) => {
  const formatted = formatCurrency(amount);
  const [integer, decimal] = formatted.split(".");

  return (
    <Box flexDirection="row" alignItems="flex-end">
      <Text variant={variant} color={color}>
        {integer}
      </Text>
      <Text variant="HeaderMiniBold" color={color} style={{ paddingBottom: 4 }}>
        .{decimal}
      </Text>
    </Box>
  );
};

export default AmountTitle;
