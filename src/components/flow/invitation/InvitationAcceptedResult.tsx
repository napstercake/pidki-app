import AmountTitle from "@/components/authorable/AmountTitle";
import { AvatarGroup } from "@/components/authorable/AvatarGroup";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import { Text } from "@/components/authorable/Text";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { getPaymentPeriodText } from "@/utils/circles";
import { formatCurrency } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import { PartyPopper } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface InvitationAcceptedResultProps {
  circle: Circle;
  onDone: () => void;
}

const InvitationAcceptedResult: React.FC<InvitationAcceptedResultProps> = ({
  circle,
  onDone,
}) => {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  return (
    <Gradient
      colors={[
        theme.colors.linearGradientPrimary1,
        theme.colors.linearGradientPrimary3,
        theme.colors.linearGradientPrimary2,
      ]}
      style={{ flex: 1 }}
    >
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        paddingHorizontal="l"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Box
          width={88}
          height={88}
          borderRadius="round"
          alignItems="center"
          justifyContent="center"
          marginBottom="l"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          <PartyPopper size={40} color={theme.colors.white} />
        </Box>

        <Text
          variant="titleBold"
          color="white"
          textAlign="center"
          marginBottom="s"
          style={{ fontSize: 24 }}
        >
          ¡Te uniste al círculo!
        </Text>
        <Text
          variant="body"
          color="white"
          textAlign="center"
          marginBottom="xl"
          style={{ opacity: 0.85 }}
        >
          Ya formas parte de &ldquo;{circle.name}&rdquo;
        </Text>

        <Box
          width="100%"
          borderRadius="xl"
          padding="l"
          gap="m"
          style={{
            backgroundColor: theme.colors.white,
            shadowColor: theme.colors.gray800,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Box alignItems="center" gap="xs">
            <Text
              variant="captionUpperBold"
              color="textLight"
              style={{ letterSpacing: 1.5 }}
            >
              META DEL POZO
            </Text>
            <AmountTitle amount={circle.goalAmount} />
          </Box>

          <Box height={1} backgroundColor="border" />

          <Box flexDirection="row" justifyContent="space-between">
            <Box alignItems="center" flex={1}>
              <Text
                variant="captionUpperBold"
                color="textLight"
                marginBottom="xs"
              >
                APORTE{" "}
                {getPaymentPeriodText(circle.paymentPeriod).toUpperCase()}
              </Text>
              <Text variant="bodyBold" color="text">
                {formatCurrency(circle.paymentAmount)}
              </Text>
            </Box>
            <Box width={1} backgroundColor="border" />
            <Box alignItems="center" flex={1}>
              <Text
                variant="captionUpperBold"
                color="textLight"
                marginBottom="xs"
              >
                MIEMBROS
              </Text>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <AvatarGroup members={circle.members} maxVisible={3} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box width="100%" marginTop="xl">
          <Button
            title="Ir a mis invitaciones"
            variant="white"
            size="large"
            onPress={onDone}
          />
        </Box>
      </Box>
    </Gradient>
  );
};

export default InvitationAcceptedResult;
