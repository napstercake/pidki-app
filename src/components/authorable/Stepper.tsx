import theme from "@/theme";
import React from "react";
import { Text, View } from "react-native";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onGradient?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  onGradient = false,
}) => {
  const percent = Math.round((currentStep / totalSteps) * 100);
  const labelColor = onGradient
    ? theme.colors.white
    : theme.colors.textSecondary;
  const percentColor = onGradient ? theme.colors.white : theme.colors.primary;
  const inactiveColor = onGradient
    ? "rgba(255,255,255,0.35)"
    : theme.colors.gray200;

  return (
    <View style={{ marginBottom: theme.spacing.m }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.m,
        }}
      >
        <Text
          style={{
            fontFamily: "PlusJakartaSans",
            fontSize: 13,
            fontWeight: "600",
            color: labelColor,
          }}
        >
          Paso {currentStep} de {totalSteps}
        </Text>
        <Text
          style={{
            fontFamily: "PlusJakartaSans-Bold",
            fontSize: 13,
            fontWeight: "700",
            color: percentColor,
          }}
        >
          {percent}%
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 99,
              backgroundColor:
                i < currentStep ? theme.colors.white : inactiveColor,
              marginRight: i < totalSteps - 1 ? 4 : 0,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default Stepper;
