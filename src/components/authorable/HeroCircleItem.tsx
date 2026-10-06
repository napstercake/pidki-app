import AmountTitle from "@/components/authorable/AmountTitle";
import { AvatarGroup } from "@/components/authorable/AvatarGroup";
import { Box } from "@/components/authorable/Box";
import { Card } from "@/components/authorable/Card";
import SegmentedProgressBar from "@/components/authorable/SegmentedProgressBar";
import { StatusLabel } from "@/components/authorable/StatusLabel";
import { Text } from "@/components/authorable/Text";
import { MAX_VISIBLE_AVATARS } from "@/constants/circles";
import { Circle } from "@/types/api";
import { getPaymentPeriodText, getRoundProgress } from "@/utils/circles";
import { formatCurrency } from "@/utils/common";
import React from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  circle: Circle;
  onPress: (circle: Circle) => void;
};

const HeroCircleItem = ({ circle, onPress }: Props) => {
  const roundProgress = getRoundProgress(circle);

  return (
    <TouchableOpacity onPress={() => onPress(circle)} activeOpacity={0.8}>
      <Card padding="l" shadow={false}>
        {/* Top row: status badge + avatars */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="m"
        >
          <Box>
            <Text variant="titleBold" color="text">
              {circle.name}
            </Text>
            <Text variant="captionItalic" color="textSecondary">
              Ronda {roundProgress.current}/{roundProgress.total}
            </Text>
          </Box>
          <AvatarGroup
            members={circle.members}
            maxVisible={MAX_VISIBLE_AVATARS}
          />
        </Box>

        {/* Stat section */}
        <Box backgroundColor="transparent" borderRadius="m" marginBottom="m">
          {/* Pot goal — full width hero */}
          <Box paddingHorizontal="m" paddingTop="m" paddingBottom="m">
            <Text
              variant="captionUpperBold"
              marginBottom="xs"
              textAlign="center"
            >
              META DEL POZO
            </Text>
            <Box flexDirection="row" justifyContent="center">
              <AmountTitle amount={circle.goalAmount || 0} />
            </Box>
          </Box>

          {/* Divider */}
          <Box height={1} backgroundColor="border" />

          {/* Secondary stats */}
          <Box flexDirection="row">
            <Box
              flex={1}
              alignItems="center"
              paddingHorizontal="s"
              paddingVertical="m"
            >
              <Text variant="captionUpperBold" marginBottom="xs">
                ESTADO
              </Text>
              <Box alignItems="center">
                <StatusLabel status={circle.status} />
              </Box>
            </Box>
            <Box width={1} backgroundColor="border" />
            <Box
              flex={1}
              alignItems="center"
              paddingHorizontal="s"
              paddingVertical="m"
            >
              <Text variant="captionUpperBold" marginBottom="xs">
                PAGO{" "}
                {getPaymentPeriodText(
                  circle.paymentPeriod || "MONTHLY",
                ).toUpperCase()}
              </Text>
              <Text variant="bodyBold" color="primary">
                {formatCurrency(circle.paymentAmount || 0)}
              </Text>
            </Box>
          </Box>
        </Box>

        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="m"
        >
          <Text variant="bodyBold" color="text">
            {`${roundProgress.current}/${roundProgress.total} rondas`}
          </Text>
          <Text variant="caption" color="textSecondary">
            Junta: {formatCurrency(circle.goalAmount || 0)}
          </Text>
        </Box>

        <SegmentedProgressBar
          segments={roundProgress.total}
          filledCount={roundProgress.current}
        />
      </Card>
    </TouchableOpacity>
  );
};

export default HeroCircleItem;
