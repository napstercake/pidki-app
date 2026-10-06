import { CIRCLE_PAYMENT, MAX_VISIBLE_AVATARS } from "@/constants/circles";
import { CirclePayment, CircleStatusType } from "@/types/api";
import { formatCurrency } from "@/utils/common";
import React from "react";
import { AvatarGroup } from "./AvatarGroup";
import { Box } from "./Box";
import { Card } from "./Card";
import SegmentedProgressBar from "./SegmentedProgressBar";
import { StatusLabel } from "./StatusLabel";
import { Text } from "./Text";

type Member = {
  user: {
    avatarUrl?: string | null;
    firstName?: string;
    lastName?: string;
  };
};

type Circle = {
  name: string;
  status: CircleStatusType;
  currentAmount?: number;
  goalAmount?: number;
  completionPercentage?: number;
  members?: Member[];
  targetParticipants?: number;
  currentParticipants?: number;
  payments?: CirclePayment[];
};

type CircleItemProps = {
  circle: Circle;
  onPress?: () => void;
};

const CircleItem = ({ circle }: CircleItemProps) => {
  const {
    name,
    goalAmount = 0,
    members = [],
    targetParticipants,
    currentParticipants = 0,
    payments = [],
  } = circle;
  const totalRounds = targetParticipants ?? currentParticipants;
  const currentRound = payments.filter(
    (p) => p.status === CIRCLE_PAYMENT.paid,
  ).length;

  return (
    <Card padding="m" marginBottom="m">
      {/* Title row */}
      <Box
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="space-between"
        marginBottom="s"
      >
        <Text variant="bodyBold" color="text" fontSize={18}>
          {name}
        </Text>
        <StatusLabel status={circle.status} />
      </Box>

      {/* Member avatars */}
      <Box marginBottom="m">
        <AvatarGroup members={members} maxVisible={MAX_VISIBLE_AVATARS} />
      </Box>

      {/* Amount row */}
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="m"
      >
        <Text variant="caption" color="textSecondary">
          {`${currentRound}/${totalRounds} rondas`}
        </Text>
        <Text variant="caption" color="textSecondary">
          Junta: {formatCurrency(goalAmount, false)}
        </Text>
      </Box>

      <SegmentedProgressBar segments={totalRounds} filledCount={currentRound} />
    </Card>
  );
};

export default CircleItem;
