import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { getCurrentPendingPayment } from "@/utils/circles";
import { formatCurrency, formatDate } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { View } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

export interface TimelineItem {
  roundNumber: number;
  participantName: string;
  isCurrentUser?: boolean;
  isActive?: boolean;
  subtitle: string;
  amount?: string;
}

interface TimelineProps {
  circle: Circle;
  currentUserId?: string;
  label?: string;
}

const TimelineDot = ({
  isActive,
  isLast,
}: {
  isActive: boolean;
  isLast: boolean;
}) => {
  const theme = useTheme<Theme>();

  return (
    <Box alignItems="center">
      {isActive ? (
        <Box
          width={28}
          height={28}
          borderRadius="round"
          backgroundColor="secondary"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            width={10}
            height={10}
            borderRadius="round"
            backgroundColor="white"
          />
        </Box>
      ) : (
        <Box
          width={28}
          height={28}
          borderRadius="round"
          borderWidth={2}
          borderColor="gray300"
          backgroundColor="white"
        />
      )}
      {!isLast && (
        <View
          style={{
            width: 2,
            flex: 1,
            minHeight: 24,
            backgroundColor: theme.colors.gray200,
            marginTop: 2,
          }}
        />
      )}
    </Box>
  );
};

const Timeline: React.FC<TimelineProps> = ({
  circle,
  currentUserId,
  label = "LÍNEA DE RONDAS",
}) => {
  const currentPayment = getCurrentPendingPayment(circle);

  const items: TimelineItem[] = circle.payments
    .slice()
    .sort((a, b) => a.roundNumber - b.roundNumber)
    .map((payment) => {
      const member = circle.members.find(
        (m) => m.userId === payment.recipientUserId,
      );
      const isActive = payment.roundNumber === currentPayment?.roundNumber;
      const dueDate = formatDate(new Date(payment.dueDate), {
        day: "numeric",
        month: "short",
      });
      return {
        roundNumber: payment.roundNumber,
        participantName: `${member?.user.firstName ?? "—"} recibiras`,
        isCurrentUser: payment.recipientUserId === currentUserId,
        isActive,
        subtitle: isActive ? `A pagar el ${dueDate}` : `el ${dueDate}`,
        amount: isActive
          ? formatCurrency(payment.totalAmount, false)
          : undefined,
      };
    });

  return (
    <Box
      backgroundColor="white"
      borderRadius="l"
      padding="l"
      shadowColor="gray800"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={8}
      elevation={3}
      borderWidth={1}
      borderColor="border"
    >
      <Text variant="captionUpperBold" color="textSecondary" marginBottom="m">
        {label}
      </Text>

      {items.map((item, index) => (
        <Box key={item.roundNumber} flexDirection="row" gap="m">
          <TimelineDot
            isActive={!!item.isActive}
            isLast={index === items.length - 1}
          />

          <Box
            flex={1}
            paddingBottom={index < items.length - 1 ? "m" : undefined}
          >
            <Box
              flexDirection="row"
              flexWrap="wrap"
              alignItems="center"
              gap="xs"
            >
              <Text variant="bodyBold" color="text">
                Ronda {item.roundNumber} · {item.participantName}
                {item.isCurrentUser ? " (tú)" : ""}
              </Text>
              {item.amount && (
                <Text variant="bodyBold" color="secondary">
                  {item.amount}
                </Text>
              )}
            </Box>
            <Text variant="caption" color="textSecondary" marginTop="xs">
              {item.subtitle}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Timeline;
