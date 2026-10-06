import { RoundDepositsResponse } from "@/services/api/circles";
import { Circle } from "@/types/api";
import { getCurrentPendingPayment } from "@/utils/circles";
import { formatCurrency } from "@/utils/common";
import React from "react";
import { Box } from "./Box";
import CornerRibbon from "./CornerRibbon";
import SegmentedProgressBar from "./SegmentedProgressBar";
import { Text } from "./Text";

interface PotProps {
  circle: Circle;
  roundDeposits?: RoundDepositsResponse;
  maxSegments?: number;
  formatAmount?: (amount: number) => string;
  cornerBadge?: boolean;
}

const defaultFormat = (amount: number) => formatCurrency(amount, false);

const Pot: React.FC<PotProps> = ({
  circle,
  roundDeposits,
  maxSegments = 10,
  formatAmount = defaultFormat,
  cornerBadge = false,
}) => {
  const paidCount = roundDeposits?.confirmed ?? 0;
  const totalCount = roundDeposits?.total ?? circle.members.length;
  const collectedAmount = paidCount * circle.paymentAmount;
  const totalAmount = totalCount * circle.paymentAmount;
  const segments = Math.min(totalCount, maxSegments);
  const currentRound = getCurrentPendingPayment(circle)?.roundNumber ?? 1;
  const totalRounds = circle.payments.length;

  return (
    <Box
      borderRadius="l"
      shadowColor="gray800"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={8}
      elevation={3}
    >
      <Box
        backgroundColor="white"
        borderRadius="l"
        padding="l"
        borderWidth={1}
        borderColor="border"
        style={{ overflow: "hidden" }}
      >
        {cornerBadge ? (
          <CornerRibbon
            label="RONDA"
            value={`${currentRound}/${totalRounds}`}
          />
        ) : null}

        <Text
          variant="captionUpperBold"
          color="textSecondary"
          marginBottom="s"
          style={{ maxWidth: "70%" }}
        >
          REUNIDO
        </Text>

        <Box flexDirection="row" alignItems="flex-end" gap="s" marginBottom="m">
          <Text variant="HeaderMiniBold" color="secondary">
            {formatAmount(collectedAmount)}
          </Text>
          <Text
            variant="body"
            color="textSecondary"
            style={{ paddingBottom: 2 }}
          >
            de {formatAmount(totalAmount)}
          </Text>
        </Box>

        <Box marginBottom="s">
          <SegmentedProgressBar segments={segments} filledCount={paidCount} />
        </Box>

        <Text variant="caption" color="textSecondary">
          {paidCount} de {totalCount} aportes recibidos
        </Text>
      </Box>
    </Box>
  );
};

export default Pot;
