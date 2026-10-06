import { Box } from "@/components/authorable/Box";
import { Card } from "@/components/authorable/Card";
import { Text } from "@/components/authorable/Text";
import {
  PAYMENT_CONSTANTS,
  PAYMENT_PERIOD_OPTIONS,
} from "@/constants/Payments";
import { Theme } from "@/theme";
import { formatCurrency, formatDate } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import { Calendar, Info, Users } from "lucide-react-native";
import React from "react";

type PaymentScheduleItem = {
  round: number;
  date: Date;
  amount: number;
  memberLabel: string;
};

type Props = {
  name: string;
  description: string;
  goalAmount: string;
  paymentAmount: number;
  paymentPeriod: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  firstPaymentDate: Date;
  validEmails: string[];
  error: string | null;
};

const Step5 = ({
  name,
  description,
  goalAmount,
  paymentAmount,
  paymentPeriod,
  firstPaymentDate,
  validEmails,
  error,
}: Props) => {
  const theme = useTheme<Theme>();

  const calculatePaymentSchedule = (): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const totalMembers = validEmails.length + 1;

    for (let i = 0; i < totalMembers; i++) {
      const paymentDate = new Date(firstPaymentDate);

      switch (paymentPeriod) {
        case PAYMENT_CONSTANTS.WEEKLY.value:
          paymentDate.setDate(firstPaymentDate.getDate() + i * 7);
          break;
        case PAYMENT_CONSTANTS.BIWEEKLY.value:
          paymentDate.setDate(firstPaymentDate.getDate() + i * 15);
          break;
        case PAYMENT_CONSTANTS.MONTHLY.value:
          paymentDate.setMonth(firstPaymentDate.getMonth() + i);
          break;
      }

      schedule.push({
        round: i + 1,
        date: paymentDate,
        amount: paymentAmount,
        memberLabel: i === 0 ? "Tú (Creador)" : `Miembro #${i + 1}`,
      });
    }

    return schedule;
  };

  const paymentSchedule = calculatePaymentSchedule();

  const infoRows: [string, string][] = [
    ["Nombre", name],
    ["Descripción", description || "-"],
    ["Monto a ahorrar", formatCurrency(Number(goalAmount))],
    [
      "Periodo de pago",
      PAYMENT_PERIOD_OPTIONS.find((opt) => opt.value === paymentPeriod)
        ?.label || "",
    ],
    ["Monto por persona", formatCurrency(paymentAmount)],
  ];

  return (
    <>
      <Text
        variant="titleBold"
        color="text"
        marginBottom="m"
        textAlign="center"
      >
        Revisa tu círculo
      </Text>
      <Text
        variant="body"
        color="textSecondary"
        marginBottom="l"
        textAlign="center"
        style={{ fontStyle: "italic" }}
      >
        Confirma los datos antes de crear el círculo.
      </Text>

      <Card padding="m" marginBottom="l">
        <Box flexDirection="row" alignItems="center" marginBottom="m">
          <Info
            size={20}
            color={theme.colors.info}
            style={{ marginRight: 8 }}
          />
          <Text variant="subtitle" color="text">
            Información del círculo
          </Text>
        </Box>
        <Box>
          {infoRows.map(([label, value]) => (
            <Box
              key={label}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="xs"
            >
              <Text
                variant="bodyBold"
                color="text"
                style={{ flex: 1, textAlign: "left" }}
              >
                {label}
              </Text>
              <Text
                color="textSecondary"
                style={{ flex: 1, textAlign: "right" }}
              >
                {value}
              </Text>
            </Box>
          ))}
        </Box>
      </Card>

      <Card padding="m" marginBottom="l">
        <Box flexDirection="row" alignItems="center" marginBottom="m">
          <Users
            size={20}
            color={theme.colors.accent}
            style={{ marginRight: 8 }}
          />
          <Text variant="subtitle" color="text">
            Miembros
          </Text>
        </Box>
        {validEmails.map((e, i) => (
          <Text
            key={i}
            color="textSecondary"
            style={{ marginLeft: 12, marginBottom: 4 }}
          >
            {e}
          </Text>
        ))}
      </Card>

      <Card padding="m" marginBottom="l">
        <Box flexDirection="row" alignItems="center" marginBottom="m">
          <Calendar
            size={20}
            color={theme.colors.purple500}
            style={{ marginRight: 8 }}
          />
          <Text variant="subtitle" color="text">
            Cronograma de pagos
          </Text>
        </Box>
        <Text variant="body" color="textSecondary" marginBottom="s">
          Cada miembro recibirá {formatCurrency(Number(goalAmount))} en su
          ronda correspondiente:
        </Text>
        <Box gap="s">
          {paymentSchedule.map((payment, index) => (
            <Box
              key={payment.round}
              flexDirection="row"
              alignItems="center"
              paddingVertical="m"
              paddingHorizontal="m"
              backgroundColor="gray50"
              borderRadius="s"
            >
              <Box
                backgroundColor={index === 0 ? "success" : "secondary"}
                borderRadius="round"
                width={32}
                height={32}
                alignItems="center"
                justifyContent="center"
                marginRight="m"
              >
                <Text variant="body" color="white" fontWeight="600">
                  {payment.round}
                </Text>
              </Box>
              <Box flex={1}>
                <Text variant="bodyBold" color="text" marginBottom="xs">
                  {payment.memberLabel}
                </Text>
                <Text variant="caption" color="textSecondary">
                  {formatDate(payment.date)}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      <Text color="textSecondary" marginTop="m" style={{ textAlign: "center" }}>
        Al crear el círculo, se enviará un correo a los invitados para que se
        unan.
      </Text>
      {error && (
        <Text color="error" marginTop="s">
          {error}
        </Text>
      )}
    </>
  );
};

export default Step5;
