import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import PizzaStepper from "@/components/authorable/PizzaStepper";
import { Text } from "@/components/authorable/Text";
import CircleCreationResult from "@/components/flow/circle-creation/CircleCreationResult";
import Step1 from "@/components/flow/circle-creation/Step1";
import Step2 from "@/components/flow/circle-creation/Step2";
import Step3 from "@/components/flow/circle-creation/Step3";
import Step4 from "@/components/flow/circle-creation/Step4";
import Step5 from "@/components/flow/circle-creation/Step5";
import { GOAL_AMOUNT } from "@/constants/circles";
import { PAYMENT_CONSTANTS } from "@/constants/Payments";
import { useCreateCircle } from "@/hooks/mutations/useCircleMutations";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { useTheme } from "@shopify/restyle";
import { router, Stack } from "expo-router";
import {
  ArrowRight,
  BadgeInfo,
  CalendarCheck2,
  Check,
  ChevronLeft,
  DollarSign,
  Handshake,
  PenLine,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateCircleScreen() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const createCircleMutation = useCreateCircle();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(1);
  const [goalAmount, setGoalAmount] = useState(String(GOAL_AMOUNT.default));
  const [emails, setEmails] = useState(["", ""]);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [paymentPeriod, setPaymentPeriod] = useState<
    "WEEKLY" | "BIWEEKLY" | "MONTHLY"
  >("MONTHLY");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdCircle, setCreatedCircle] = useState<Circle | null>(null);
  const [invitedCount, setInvitedCount] = useState(0);
  const [firstPaymentDate, setFirstPaymentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validEmails = emails.filter((e) => e.trim() !== "" && validateEmail(e));
  const paymentAmount =
    goalAmount && validEmails.length > 0
      ? Math.round(Number(goalAmount) / (validEmails.length + 1))
      : 0;

  const calculateFirstPaymentDate = (
    period: "WEEKLY" | "BIWEEKLY" | "MONTHLY",
  ) => {
    const today = new Date();
    const currentDay = today.getDate();

    switch (period) {
      case PAYMENT_CONSTANTS.WEEKLY.value: {
        const daysUntilFriday = (5 - today.getDay() + 7) % 7;
        const nextFriday = new Date(today);
        nextFriday.setDate(today.getDate() + daysUntilFriday);
        return nextFriday;
      }
      case PAYMENT_CONSTANTS.BIWEEKLY.value: {
        const targetDay = currentDay <= 15 ? 15 : 30;
        const biweeklyDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          targetDay,
        );
        if (biweeklyDate <= today) {
          biweeklyDate.setMonth(today.getMonth() + 1);
          biweeklyDate.setDate(targetDay === 15 ? 15 : 30);
        }
        return biweeklyDate;
      }
      case PAYMENT_CONSTANTS.MONTHLY.value:
        return new Date(today.getFullYear(), today.getMonth() + 1, 0);
      default:
        return today;
    }
  };

  React.useEffect(() => {
    setFirstPaymentDate(calculateFirstPaymentDate(paymentPeriod));
  }, [paymentPeriod]);

  function validateEmail(email: string) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  function handleAddEmailField() {
    if (emails.length < 10) setEmails([...emails, ""]);
  }

  function handleEmailChange(index: number, value: string) {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  }

  function handleRemoveEmailField(index: number) {
    if (emails.length > 2) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  }

  function validateStep1() {
    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
      setError("Por favor ingresa un monto válido.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep2() {
    const errors = emails.map((e) =>
      !e.trim() ? "Requerido" : !validateEmail(e) ? "Email inválido" : "",
    );
    setEmailErrors(errors);
    if (emails.length < 2 || errors.some((e) => e)) {
      setError("Agrega al menos 2 emails válidos.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep3() {
    if (!paymentPeriod) {
      setError("Selecciona un periodo de pago.");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep4() {
    if (!name.trim()) {
      setError("El nombre es requerido.");
      return false;
    }
    setError(null);
    return true;
  }

  const formatApiDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  async function handleCreateCircle() {
    setError(null);
    try {
      const response = await createCircleMutation.mutateAsync({
        name,
        description,
        goalAmount: Number(goalAmount),
        paymentPeriod,
        firstPaymentDueDate: formatApiDate(firstPaymentDate),
        inviteEmails: validEmails,
      });
      setCreatedCircle(response.circle);
      setInvitedCount(response.invitations);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Error al crear el círculo.");
    }
  }

  function handleSuccessNav() {
    router.replace("/circles");
  }

  const steps = [
    { title: "Monto", icon: DollarSign },
    { title: "Team", icon: Handshake },
    { title: "Pagos", icon: CalendarCheck2 },
    { title: "Datos", icon: PenLine },
    { title: "Resumen", icon: BadgeInfo },
  ];

  const StepIcon = steps[step - 1].icon;

  if (success && createdCircle) {
    return (
      <CircleCreationResult
        circle={createdCircle}
        invitedCount={invitedCount}
        onDone={handleSuccessNav}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
          theme.colors.linearGradientPrimary2,
        ]}
        style={{
          paddingTop: insets.top + theme.spacing.s,
          paddingHorizontal: theme.spacing.l,
          paddingBottom: theme.spacing.xl,
        }}
      >
        {/* Custom header */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
          >
            <ChevronLeft color="#FFFFFF" size={24} />
          </IconButton>
          <Box flex={1} alignItems="center">
            <Text
              variant="HeaderMiniBold"
              style={{ color: theme.colors.white }}
            >
              Crea tu círculo
            </Text>
          </Box>
          <Box
            width={36}
            height={36}
            alignItems="center"
            justifyContent="center"
          >
            <PizzaStepper
              currentStep={step}
              totalSteps={steps.length}
              onGradient
            />
          </Box>
        </Box>
      </Gradient>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={step !== 1}
      >
        <Box flex={1} padding="l">
          {step === 1 && (
            <Step1
              goalAmount={goalAmount}
              error={error}
              onGoalAmountChange={(v) =>
                setGoalAmount(v.replace(/[^0-9]/g, ""))
              }
            />
          )}
          {step === 2 && (
            <Step2
              emails={emails}
              emailErrors={emailErrors}
              error={error}
              onEmailChange={handleEmailChange}
              onAddEmail={handleAddEmailField}
              onRemoveEmail={handleRemoveEmailField}
            />
          )}
          {step === 3 && (
            <Step3
              paymentPeriod={paymentPeriod}
              firstPaymentDate={firstPaymentDate}
              showDatePicker={showDatePicker}
              error={error}
              onPaymentPeriodChange={setPaymentPeriod}
              onFirstPaymentDateChange={setFirstPaymentDate}
              onToggleDatePicker={() => setShowDatePicker((open) => !open)}
            />
          )}
          {step === 4 && (
            <Step4
              name={name}
              description={description}
              error={error}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
          )}
          {step === 5 && (
            <Step5
              name={name}
              description={description}
              goalAmount={goalAmount}
              paymentAmount={paymentAmount}
              paymentPeriod={paymentPeriod}
              firstPaymentDate={firstPaymentDate}
              validEmails={validEmails}
              error={error}
            />
          )}
          <Box
            paddingTop="l"
            style={{ paddingBottom: insets.bottom + theme.spacing.m }}
          >
            {step === 5 ? (
              <Button
                title="Crear círculo"
                onPress={handleCreateCircle}
                loading={createCircleMutation.isPending}
                size="large"
                iconPosition="right"
                icon={<Check size={16} color={theme.colors.gray900} />}
              />
            ) : (
              <Button
                title="Continuar"
                onPress={() => {
                  const validators = [
                    validateStep1,
                    validateStep2,
                    validateStep3,
                    validateStep4,
                  ];
                  if (validators[step - 1]()) setStep(step + 1);
                }}
                size="large"
                iconPosition="right"
                icon={<ArrowRight size={16} color={theme.colors.gray900} />}
              />
            )}
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
