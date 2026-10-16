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
  const currentPayment = getCurrentPendingPayment(circle);
  const recipient = circle.members.find(
    (m) => m.userId === currentPayment?.recipientUserId,
  );
  // The round's recipient doesn't pay themselves, so their share counts as
  // already in the pot. This keeps the total equal to the full payout.
  const recipientShare = recipient ? 1 : 0;
  const payerCount =
    roundDeposits?.total ?? circle.members.length - recipientShare;
  const paidCount = (roundDeposits?.confirmed ?? 0) + recipientShare;
  const totalCount = payerCount + recipientShare;
  const collectedAmount = paidCount * circle.paymentAmount;
  const totalAmount = totalCount * circle.paymentAmount;
  const segments = Math.min(totalCount, maxSegments);
  const currentRound = currentPayment?.roundNumber ?? 1;
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
          {recipient
            ? `${paidCount} de ${totalCount} aportes · el de ${recipient.user.firstName} ya está incluido`
            : `${paidCount} de ${totalCount} aportes recibidos`}
        </Text>
      </Box>
    </Box>
  );
};

export default Pot;
