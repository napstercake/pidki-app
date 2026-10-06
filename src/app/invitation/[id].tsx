import { AlertDialog } from "@/components/authorable";
import { Avatar } from "@/components/authorable/Avatar";
import { AvatarGroup } from "@/components/authorable/AvatarGroup";
import BottomActionStack from "@/components/authorable/BottomActionStack";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import CircleIcon from "@/components/authorable/CircleIcon";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import { Text } from "@/components/authorable/Text";
import InvitationAcceptedResult from "@/components/flow/invitation/InvitationAcceptedResult";
import { PAYMENT_CONSTANTS } from "@/constants/Payments";
import {
  useAcceptInvitation,
  useDeclineInvitation,
} from "@/hooks/mutations/useInvitationMutations";
import { usePendingInvitations } from "@/hooks/queries/useInvitations";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { formatCurrency } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  ChevronLeft,
  Frown,
  ShieldCheck,
  Star,
  X
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InvitationDetailScreen() {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = usePendingInvitations();
  const invitation = data?.invitations.find((inv) => inv.id === id);

  const acceptMutation = useAcceptInvitation();
  const declineMutation = useDeclineInvitation();
  const isMutating = acceptMutation.isPending || declineMutation.isPending;

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [acceptedCircle, setAcceptedCircle] = useState<Circle | null>(null);

  const handleAccept = async () => {
    if (!invitation) return;
    try {
      await acceptMutation.mutateAsync(invitation.id);
      setAcceptedCircle(invitation.circle ?? null);
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setDialogMessage("No se pudo aceptar la invitación");
      setShowErrorDialog(true);
    }
  };

  const handleDeclinePress = () => {
    setShowDeclineConfirm(true);
  };

  const confirmDecline = async () => {
    if (!invitation) return;
    setShowDeclineConfirm(false);
    try {
      await declineMutation.mutateAsync(invitation.id);
      router.replace("/(tabs)/invitations");
    } catch (error) {
      console.error("Error declining invitation:", error);
      setDialogMessage("No se pudo rechazar la invitación");
      setShowErrorDialog(true);
    }
  };

  if (acceptedCircle) {
    return (
      <Box flex={1}>
        <Stack.Screen options={{ headerShown: false }} />
        <InvitationAcceptedResult
          circle={acceptedCircle}
          onDone={() => router.replace("/(tabs)/invitations")}
        />
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando invitación..." />;
  }

  const circle = invitation?.circle;
  const periodLabel = circle?.paymentPeriod
    ? PAYMENT_CONSTANTS[circle.paymentPeriod as keyof typeof PAYMENT_CONSTANTS]
        ?.label
    : undefined;
  const durationCount =
    circle?.targetParticipants ?? circle?.currentParticipants ?? 0;

  if (!invitation || !circle) {
    return (
      <Box flex={1} backgroundColor="background">
        <Stack.Screen options={{ headerShown: false }} />
        <Box flex={1} alignItems="center" justifyContent="center" padding="l">
          <Text variant="body" color="textSecondary" textAlign="center">
            No se encontró esta invitación.
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Gradient
          colors={[
            theme.colors.linearGradientPrimary1,
            theme.colors.linearGradientPrimary3,
            theme.colors.linearGradientPrimary2,
          ]}
        >
          <Box
            paddingHorizontal="l"
            paddingBottom="l"
            gap="m"
            style={{ paddingTop: insets.top + theme.spacing.s }}
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <IconButton onPress={() => router.back()}>
                <ChevronLeft size={20} color={theme.colors.white} />
              </IconButton>
              {/* LATER IMPLEMENTATION: real invitation expiry date is not in the API yet 
              <Box
                flexDirection="row"
                alignItems="center"
                borderRadius="round"
                paddingHorizontal="m"
                paddingVertical="xs"
                gap="xs"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <Clock size={14} color={theme.colors.white} />
                <Text
                  variant="captionUpperBold"
                  style={{ color: theme.colors.white, letterSpacing: 1 }}
                >
                  Expira en 2 días
                </Text>
              </Box>*/}
            </Box>

            <Box gap="s">
              <Box
                flexDirection="row"
                alignItems="center"
                gap="s"
                marginBottom="s"
              >
                <Text variant="titleBold" color="white">
                  {circle.name}
                </Text>
              </Box>

              <Box flexDirection="row" alignItems="center" gap="s">
                {circle.members.length > 0 && (
                  <AvatarGroup members={circle.members} maxVisible={3} />
                )}
                <Text variant="caption" color="white">
                  {circle.members.length}{" "}
                  {circle.members.length === 1 ? "miembro" : "miembros"}
                </Text>
              </Box>
            </Box>
          </Box>
        </Gradient>
        <Box backgroundColor="background">
          <Box padding="l">
            {/** first card */}
            <Box
              backgroundColor="white"
              borderRadius="l"
              padding="l"
              shadowColor="gray800"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.08}
              shadowRadius={8}
              elevation={3}
              gap="m"
            >
              <Box flexDirection="row" alignItems="center">
                <Avatar
                  size="medium"
                  uri={circle.creator.avatarUrl}
                  firstName={circle.creator.firstName}
                  lastName={circle.creator.lastName}
                  backgroundColor="primaryLight"
                />
                <Box flex={1} marginLeft="m">
                  <Text variant="bodyBold" color="text">
                    {circle.creator.firstName} {circle.creator.lastName}
                  </Text>
                  <Box flexDirection="row" alignItems="center" gap="xs">
                    <Text variant="caption" color="textSecondary">
                      Organizador
                    </Text>
                    {/*
                    LATER IMPLEMENTATION
                    <><Text variant="caption" color="textLight">
                      |
                    </Text>
                    <Text variant="caption" color="textSecondary">
                      8 círculos
                    </Text></>*/}
                    {circle.creator.averageRating > 0 && (
                      <>
                        <Text variant="caption" color="textLight">
                          |
                        </Text>
                        <Box flexDirection="row" alignItems="center" gap="xs">
                          <Star
                            size={12}
                            color={theme.colors.yellow500}
                            fill={theme.colors.yellow500}
                          />
                          <Text variant="caption" color="textSecondary">
                            {circle.creator.averageRating.toFixed(1)}
                          </Text>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              {circle.description && (
                <Text
                  variant="body"
                  color="textSecondary"
                  style={{ fontStyle: "italic" }}
                >
                  &ldquo;{circle.description}&rdquo;
                </Text>
              )}
            </Box>

            {/** second card */}
            <Box
              backgroundColor="white"
              borderRadius="l"
              padding="l"
              marginTop="m"
              shadowColor="gray800"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.08}
              shadowRadius={8}
              elevation={2}
            >
              <Text
                variant="captionUpperBold"
                color="textLight"
                marginBottom="m"
                style={{ letterSpacing: 1 }}
              >
                TU COMPROMISO
              </Text>

              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingBottom="m"
                marginBottom="m"
                borderBottomWidth={1}
                borderBottomColor="borderLight"
              >
                <Text variant="body" color="textSecondary">
                  {periodLabel === "Semanal"
                    ? "Aporte semanal"
                    : periodLabel === "Quincenal"
                      ? "Aporte quincenal"
                      : "Aporte mensual"}
                </Text>
                <Text variant="bodyBold" color="text">
                  {formatCurrency(circle.paymentAmount)}
                </Text>
              </Box>

              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                paddingBottom="m"
                marginBottom="m"
                borderBottomWidth={1}
                borderBottomColor="borderLight"
              >
                <Text variant="body" color="textSecondary">
                  Duración
                </Text>
                <Text variant="bodyBold" color="text">
                  {durationCount}{" "}
                  {periodLabel === "Semanal" ? "semanas" : "pagos"}
                </Text>
              </Box>

              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                marginBottom="m"
              >
                <Text variant="body" color="textSecondary">
                  Recibes
                </Text>
                <Text variant="bodyBold" color="accent">
                  {formatCurrency(circle.goalAmount)}
                </Text>
              </Box>

              <Box
                flexDirection="row"
                alignItems="center"
                backgroundColor="gray50"
                borderRadius="m"
                padding="m"
                gap="s"
              >
                <ShieldCheck size={18} color={theme.colors.textSecondary} />
                <Box flex={1}>
                  <Text variant="caption" color="textSecondary">
                    El orden de cobro se sorteará cuando el círculo esté
                    completo.
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </ScrollView>

      <BottomActionStack
        secondaryAction={
          <TouchableOpacity
            onPress={handleDeclinePress}
            disabled={isMutating}
            activeOpacity={0.7}
          >
            <CircleIcon
              icon={<X size={20} color={theme.colors.textSecondary} />}
            />
          </TouchableOpacity>
        }
        primaryAction={
          <Button
            title="Aceptar invitación"
            variant="primary2"
            onPress={handleAccept}
            disabled={isMutating}
            loading={isMutating}
            size="large"
            flex={1}
            iconPosition="right"
            icon={<ArrowRight size={18} color={theme.colors.white} />}
          />
        }
      />

      <AlertDialog
        visible={showErrorDialog}
        title="Error"
        description={dialogMessage}
        icon={<Frown />}
        onCancel={() => setShowErrorDialog(false)}
        confirmText="Reintentar"
        cancelText="Cerrar"
        variant="error"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outlineGray"
      />

      <AlertDialog
        visible={showDeclineConfirm}
        title="Rechazar invitación"
        description="¿Estás seguro de que quieres rechazar esta invitación? Esta acción no se puede deshacer."
        variant="warning"
        onCancel={() => setShowDeclineConfirm(false)}
        onConfirm={confirmDecline}
        confirmText="Rechazar"
        cancelText="Cancelar"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outlineGray"
      />
    </Box>
  );
}
