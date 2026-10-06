import { Box } from "@/components/authorable/Box";
import { RadioButtonList } from "@/components/authorable/RadioButtonList";
import { Text } from "@/components/authorable/Text";
import {
  PAYMENT_CONSTANTS,
  PAYMENT_PERIOD_OPTIONS,
} from "@/constants/Payments";
import { Theme } from "@/theme";
import { formatDate } from "@/utils/common";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";

type Props = {
  paymentPeriod: "WEEKLY" | "BIWEEKLY" | "MONTHLY";
  firstPaymentDate: Date;
  showDatePicker: boolean;
  error: string | null;
  onPaymentPeriodChange: (period: "WEEKLY" | "BIWEEKLY" | "MONTHLY") => void;
  onFirstPaymentDateChange: (date: Date) => void;
  onToggleDatePicker: () => void;
};

const Step3 = ({
  paymentPeriod,
  firstPaymentDate,
  showDatePicker,
  error,
  onPaymentPeriodChange,
  onFirstPaymentDateChange,
  onToggleDatePicker,
}: Props) => {
  const theme = useTheme<Theme>();

  const periodColor = (value: string) => {
    if (value === PAYMENT_CONSTANTS.WEEKLY.value) return theme.colors.secondary;
    if (value === PAYMENT_CONSTANTS.BIWEEKLY.value)
      return theme.colors.tertiary;
    return theme.colors.purple500;
  };

  return (
    <>
      <Text
        variant="titleBold"
        color="text"
        marginBottom="m"
        textAlign="center"
      >
        ¿Cada cuánto tiempo quieren aportar?
      </Text>
      <Text
        variant="body"
        color="textSecondary"
        marginBottom="l"
        textAlign="center"
        style={{ fontStyle: "italic" }}
      >
        Elige la frecuencia de pago.
      </Text>

      <Box marginBottom="l">
        <RadioButtonList
          options={PAYMENT_PERIOD_OPTIONS.map((opt) => ({
            label: opt.label,
            value: opt.value,
            subtitle: opt.description,
          }))}
          value={paymentPeriod}
          onChange={(val) =>
            onPaymentPeriodChange(val as "WEEKLY" | "BIWEEKLY" | "MONTHLY")
          }
          color={periodColor(paymentPeriod)}
          size="large"
        />
      </Box>

      <Box marginBottom="l">
        <Text variant="subtitle" color="text" marginBottom="s">
          Fecha del primer pago
        </Text>
        <TouchableOpacity
          onPress={onToggleDatePicker}
          accessibilityRole="button"
          accessibilityLabel="Cambiar fecha del primer pago"
        >
          <Box
            paddingVertical="m"
            paddingHorizontal="m"
            backgroundColor="gray100"
            borderRadius="s"
            alignItems="center"
            justifyContent="center"
            marginBottom="m"
          >
            <Text variant="body" color="textSecondary">
              {formatDate(firstPaymentDate)}
            </Text>
            <Text variant="caption" color="primary" marginTop="xs">
              Toca para cambiar la fecha
            </Text>
          </Box>
        </TouchableOpacity>
        {showDatePicker && (
          <View
            style={
              Platform.OS === "ios"
                ? { width: "100%", height: 216, marginBottom: 12 }
                : undefined
            }
          >
            <DateTimePicker
              value={firstPaymentDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              themeVariant="light"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (Platform.OS === "android") {
                  onToggleDatePicker();
                }
                if (event.type === "dismissed") {
                  onToggleDatePicker();
                }
                if (selectedDate) {
                  onFirstPaymentDateChange(selectedDate);
                }
              }}
              style={
                Platform.OS === "ios"
                  ? { width: "100%", height: 216 }
                  : undefined
              }
            />
          </View>
        )}
        <Text
          variant="caption"
          color="textSecondary"
          style={{ fontStyle: "italic" }}
        >
          Esta fecha se calcula automáticamente según el periodo seleccionado.
          Puedes cambiarla si lo deseas. Los pagos posteriores seguirán el mismo
          patrón.
        </Text>
      </Box>

      {error && (
        <Text color="error" marginTop="s">
          {error}
        </Text>
      )}
    </>
  );
};

export default Step3;
