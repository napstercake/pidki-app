import { Box } from "@/components/authorable";
import { Slider } from "@/components/authorable/Slider";
import { Text } from "@/components/authorable/Text";
import { GOAL_AMOUNT } from "@/constants/circles";
import theme from "@/theme";
import { formatCurrency } from "@/utils/common";
import React from "react";

type Props = {
  goalAmount: string;
  error: string | null;
  onGoalAmountChange: (value: string) => void;
};

const Step1 = ({ goalAmount, error, onGoalAmountChange }: Props) => {
  const numericAmount = Number(goalAmount) || GOAL_AMOUNT.default;

  return (
    <Box flex={1}>
      <Text
        variant="titleBold"
        color="text"
        marginBottom="xs"
        textAlign="center"
      >
        ¿Cuánto quieres ahorrar?
      </Text>
      <Text
        variant="body"
        color="textSecondary"
        marginBottom="xl"
        textAlign="center"
        style={{ fontStyle: "italic" }}
      >
        Elige el monto total que quieres ahorrar en tu círculo.
      </Text>

      <Box alignItems="center">
        <Text
          variant="captionUpperBold"
          color="textLight"
          marginBottom="s"
          style={{ letterSpacing: 1.5 }}
        >
          MONTO A AHORRAR
        </Text>

        <Box flexDirection="row" alignItems="flex-start" marginBottom="l">
          <Text
            style={{
              fontFamily: "PlusJakartaSans-Bold",
              fontSize: 52,
              color: theme.colors.text,
            }}
          >
            {formatCurrency(numericAmount, false)}
          </Text>
        </Box>

        <Box width="100%">
          <Slider
            minimumValue={GOAL_AMOUNT.min}
            maximumValue={GOAL_AMOUNT.max}
            step={GOAL_AMOUNT.step}
            value={numericAmount}
            onValueChange={(v) => onGoalAmountChange(String(v))}
          />
        </Box>

        {error && (
          <Text
            variant="captionBold"
            color="error"
            marginTop="m"
            textAlign="center"
          >
            {error}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Step1;
