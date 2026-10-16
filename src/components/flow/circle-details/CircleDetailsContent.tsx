import { AlertDialog } from "@/components/authorable";
import { AvatarGroup } from "@/components/authorable/AvatarGroup";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import CircleBadge from "@/components/authorable/CircleBadge";
import CircleIcon from "@/components/authorable/CircleIcon";
import { ErrorScreen } from "@/components/authorable/ErrorScreen";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import List from "@/components/authorable/List";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import NotificationItem from "@/components/authorable/NotificationItem";
import Pot from "@/components/authorable/Pot";
import { StatusLabel } from "@/components/authorable/StatusLabel";
import { Text } from "@/components/authorable/Text";
import Timeline from "@/components/authorable/Timeline";
import CircleDetailsContentCompleted from "@/components/flow/circle-details/CircleDetailsContentCompleted";
import CircleDraw from "@/components/flow/circle-draw/CircleDraw";
import CircleDrawResult from "@/components/flow/circle-draw/CircleDrawResult";
import {
  CIRCLE_INVITATION,
  CIRCLE_STATUS,
} from "@/constants/circles";
import {
  useCancelCircle,
  useConfirmMemberPayment,
  useVerifyPayment,
} from "@/hooks/mutations/useCircleMutations";
import { useCircle, useRoundDeposits } from "@/hooks/queries/useCircles";
import { InvitationsApi } from "@/services/api/invitations";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { getCurrentPendingPayment, isLastRound } from "@/utils/circles";
import { formatCurrency, formatDate } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  AlarmClock,
  CalendarFold,
  Check,
  ChevronLeft,
  Clock,
  Frown,
  HandCoins,
  Send,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

const CloseRoundCTA: React.FC<{
  title: string;
  onPress: () => void;
  iconColor: string;
}> = ({ title, onPress, iconColor }) => {
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.04,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Button
        title={title}
        variant="black"
        size="large"
        onPress={onPress}
        icon={<CalendarFold color={iconColor} />}
      />
    </Animated.View>
  );
};

const CurrentRoundSubtitle: React.FC<{ circle: Circle }> = ({ circle }) => {
  const currentPayment = getCurrentPendingPayment(circle);
  if (!currentPayment) return null;

  const recipient = circle.members.find(
    (m) => m.userId === currentPayment.recipientUserId,
  );
  const dueDate = formatDate(new Date(currentPayment.dueDate), {
    day: "numeric",
    month: "short",
  });

  return (
    <Text variant="caption" color="white">
      Le toca a {recipient?.user.firstName ?? "—"} · Cierra el {dueDate}
    </Text>
  );
};

const CircleDetailsContent = () => {
  const theme = useTheme<Theme>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, user } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  // Kept here (not in CircleDraw) because the draw flips the circle to ACTIVE,
  // which unmounts CircleDraw once the refetched circle arrives.
  const [drawnCircle, setDrawnCircle] = useState<Circle | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showCircleCompletedDialog, setShowCircleCompletedDialog] =
    useState(false);
  const [showMemberPaymentDialog, setShowMemberPaymentDialog] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [pendingMemberPaymentId, setPendingMemberPaymentId] = useState<
    string | null
  >(null);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  const {
    data: circleData,
    isPending: isInitialLoading,
    isRefetching: isRefreshing,
    refetch: refetchCircle,
    error: circleError,
  } = useCircle(id ?? "");
  const circle = circleData?.circle ?? null;

  const currentRoundNumber = circle
    ? getCurrentPendingPayment(circle)?.roundNumber
    : undefined;

  const { data: roundDeposits, refetch: refetchDeposits } = useRoundDeposits(
    id ?? "",
    currentRoundNumber,
  );

  const cancelCircleMutation = useCancelCircle();
  const verifyPaymentMutation = useVerifyPayment(id ?? "");
  const confirmMemberPaymentMutation = useConfirmMemberPayment(id ?? "");

  const [shownCircleError, setShownCircleError] = useState<typeof circleError>(null);
  if (circleError !== shownCircleError) {
    setShownCircleError(circleError);
    if (circleError) {
      setDialogTitle("Error");
      setDialogMessage("No se pudo cargar el círculo");
      setShowErrorDialog(true);
    }
  }

  useEffect(() => {
    if (circleError) {
      console.error("Error fetching circle:", circleError);
    }
  }, [circleError]);

  useFocusEffect(
    React.useCallback(() => {
      if (token && !isInitialLoading && id) {
        refetchCircle();
      }
    }, [token, isInitialLoading, id, refetchCircle]),
  );

  const handleMarkPaymentAsPaid = () => {
    if (!token || !circle) return;

    const currentPayment = getCurrentPendingPayment(circle);
    if (!currentPayment) {
      setDialogTitle("Error");
      setDialogMessage("No hay pagos pendientes para marcar como completados.");
      setShowErrorDialog(true);
      return;
    }

    const isLast = isLastRound(circle);
    const alertMessage = isLast
      ? `¿Confirmas que todos los participantes han pagado ${formatCurrency(circle.paymentAmount)} para la ronda ${currentPayment.roundNumber}? Esta es la última ronda del círculo.`
      : `¿Confirmas que todos los participantes han pagado ${formatCurrency(circle.paymentAmount)} para la ronda ${currentPayment.roundNumber}?`;

    setDialogTitle("Confirmar pago");
    setDialogMessage(alertMessage);
    setShowPaymentDialog(true);
  };

  const onRefresh = () => {
    refetchCircle();
  };

  const handleConfirmPayment = async () => {
    if (!circle) return;

    const currentPayment = getCurrentPendingPayment(circle);
    const isLast = isLastRound(circle);

    try {
      await verifyPaymentMutation.mutateAsync({
        paymentAmount: circle.paymentAmount,
      });
      await refetchCircle();
      setShowPaymentDialog(false);

      if (isLast) {
        setDialogTitle("¡Círculo Completado!");
        setDialogMessage(
          "Todas las rondas han sido completadas. Ahora puedes calificar a los miembros de tu círculo.",
        );
        setShowCircleCompletedDialog(true);
      } else {
        setDialogTitle("¡Bien!");
        setDialogMessage(
          `Ronda ${currentPayment?.roundNumber} marcada como completada.`,
        );
        setShowSuccessDialog(true);
      }
    } catch (error: any) {
      setShowPaymentDialog(false);
      console.error("Error marking payment as paid:", error);
      setDialogTitle("Error");
      setDialogMessage(
        error.message || "No se pudo marcar el pago como completado.",
      );
      setShowErrorDialog(true);
    }
  };

  const handleRateMembers = () => {
    setShowCircleCompletedDialog(false);
    router.push({
      pathname: "/circle/[id]/rate" as any,
      params: { id: circle?.id, circleData: JSON.stringify(circle) },
    });
  };

  const handleConfirmMemberPayment = (memberId: string) => {
    setPendingMemberPaymentId(memberId);
    setShowMemberPaymentDialog(true);
  };

  const handleExecuteMemberPayment = async () => {
    if (!circle || !pendingMemberPaymentId) return;
    const currentPayment = getCurrentPendingPayment(circle);
    if (!currentPayment) return;
    try {
      await confirmMemberPaymentMutation.mutateAsync({
        roundNumber: currentPayment.roundNumber,
        memberId: pendingMemberPaymentId,
      });
      await Promise.all([refetchCircle(), refetchDeposits()]);
      setShowMemberPaymentDialog(false);
    } catch (error: any) {
      setShowMemberPaymentDialog(false);
      setDialogTitle("Error");
      setDialogMessage(error.message || "No se pudo confirmar el pago.");
      setShowErrorDialog(true);
    } finally {
      setPendingMemberPaymentId(null);
    }
  };

  const handleSendReminder = () => {
    setShowReminderModal(true);
  };

  const handleConfirmSendReminder = async () => {
    if (!token || !circle) return;

    const pendingEmails = circle.invitations
      .filter((invitation) => invitation.status === CIRCLE_INVITATION.pending)
      .map((invitation) => invitation.invitedEmail);

    if (pendingEmails.length === 0) {
      setShowReminderModal(false);
      return;
    }

    setIsSendingReminder(true);
    try {
      const response = await InvitationsApi.remindInvitees(
        token,
        circle.id,
        pendingEmails,
      );
      setShowReminderModal(false);
      setDialogTitle("¡Recordatorio enviado!");
      setDialogMessage(response.message);
      setShowSuccessDialog(true);
    } catch (error: any) {
      setShowReminderModal(false);
      setDialogTitle("Error");
      setDialogMessage(error.message || "No se pudo enviar el recordatorio.");
      setShowErrorDialog(true);
    } finally {
      setIsSendingReminder(false);
    }
  };

  const handleCancelCircle = async () => {
    if (!circle) return;

    // Errors are shown inside the cancel modal: opening the error dialog (a
    // second Modal) on top of it leaves the screen unresponsive.
    if (cancelConfirmation !== circle.name) {
      setCancelError(
        "Por favor escribe exactamente el nombre del círculo para confirmar la cancelación.",
      );
      return;
    }

    setCancelError(null);
    try {
      await cancelCircleMutation.mutateAsync(circle.id);
      closeCancelModal();
      router.replace("/circles");
    } catch (error: any) {
      setCancelError(
        circle.status === CIRCLE_STATUS.active
          ? "Un círculo activo no se puede eliminar."
          : error?.message || "No se pudo cancelar el círculo.",
      );
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelConfirmation("");
    setCancelError(null);
  };

  if (drawnCircle) {
    return (
      <CircleDrawResult
        circle={drawnCircle}
        onStart={() => router.back()}
      />
    );
  }

  if (isInitialLoading) {
    return <LoadingSpinner fullScreen text="Cargando círculo..." />;
  }

  if (!circle) {
    return (
      <ErrorScreen
        icon={<Frown size={40} color={theme.colors.white} />}
        title="Círculo no encontrado"
        description="Puede que ya no esté disponible o haya sido eliminado."
        actionText="Ir a mis círculos"
        onAction={() => router.replace("/circles")}
      />
    );
  }

  if (circle.status === CIRCLE_STATUS.readyToDraw) {
    return <CircleDraw circle={circle} onDrawCompleted={setDrawnCircle} />;
  }

  if (circle.status === CIRCLE_STATUS.completed) {
    return (
      <CircleDetailsContentCompleted
        circle={circle}
        onRateMembers={() =>
          router.push({
            pathname: "/circle/[id]/rate" as any,
            params: { id: circle.id, circleData: JSON.stringify(circle) },
          })
        }
      />
    );
  }

  const isCreator = circle.creatorId === user?.id;
  // The round's recipient doesn't pay themselves, so they have nothing pending.
  const isCurrentRecipient =
    getCurrentPendingPayment(circle)?.recipientUserId === user?.id;

  const isActive = circle.status === CIRCLE_STATUS.active;
  const showCloseRoundCTA = isActive && isCreator && !!roundDeposits?.allConfirmed;
  const showPendingPayment =
    isActive &&
    !isCurrentRecipient &&
    !roundDeposits?.allConfirmed &&
    !roundDeposits?.deposits.some((d) => d.memberId === user?.id);
  const showSendReminder =
    isCreator &&
    circle.status === CIRCLE_STATUS.pending &&
    circle.invitations.some(
      (invitation) => invitation.status === CIRCLE_INVITATION.pending,
    );
  // Cards below the header overlap the gradient via a negative margin, so the
  // gradient only reserves room for them when one is actually shown.
  const hasHeaderCard = showCloseRoundCTA || showPendingPayment || showSendReminder;

  return (
    <Box flex={1} backgroundColor="background">
      {/* Header Circle Details */}
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
          theme.colors.linearGradientPrimary2,
        ]}
      >
        <Box
          paddingHorizontal="l"
          paddingTop="xxl"
          paddingBottom={hasHeaderCard ? "xxxl" : "l"}
          gap="m"
        >
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <IconButton onPress={() => router.back()}>
              <ChevronLeft size={20} color={theme.colors.white} />
            </IconButton>
            {isCreator && (
              <IconButton onPress={() => setShowOptionsMenu(true)}>
                <Text variant="bodyBold" color="white">
                  ···
                </Text>
              </IconButton>
            )}
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
              {circle.status !== CIRCLE_STATUS.pending &&
              circle.status !== CIRCLE_STATUS.readyToDraw ? (
                <CircleBadge
                  currentRound={
                    getCurrentPendingPayment(circle)?.roundNumber ?? 1
                  }
                  totalRounds={circle.payments.length}
                />
              ) : (
                <StatusLabel status={circle.status} />
              )}
            </Box>

            <Box flexDirection="row" alignItems="center" gap="s">
              <AvatarGroup members={circle.members} maxVisible={3} />
              <CurrentRoundSubtitle circle={circle} />
            </Box>
          </Box>
        </Box>
      </Gradient>

      {/** Notification Item */}
      {(showCloseRoundCTA || showPendingPayment) && (
        <Box
          paddingHorizontal="l"
          paddingTop="m"
          style={{ marginTop: -theme.spacing.xxxl, zIndex: 1 }}
        >
          {showCloseRoundCTA ? (
            <Box
              backgroundColor="white"
              padding="l"
              borderRadius="l"
              shadowColor="gray800"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.08}
              shadowRadius={8}
              elevation={3}
              borderWidth={1}
              borderColor="border"
            >
              <CloseRoundCTA
                title={`Cerrar ronda ${getCurrentPendingPayment(circle)?.roundNumber ?? 1}`}
                onPress={handleMarkPaymentAsPaid}
                iconColor={theme.colors.white}
              />
            </Box>
          ) : (
            <NotificationItem
              variant="warning"
              title="Pago pendiente"
              subtitle={formatCurrency(circle.paymentAmount)}
              icon={<Clock size={20} color="white" />}
              onAction={() => {}}
            />
          )}
        </Box>
      )}

      {/** Send reminder CTA for Pending circle status */}
      {showSendReminder && (
          <Box
            paddingHorizontal="l"
            paddingTop="m"
            style={{ marginTop: -theme.spacing.xxxl, zIndex: 1 }}
          >
            <Box
              backgroundColor="white"
              padding="l"
              borderRadius="l"
              shadowColor="gray800"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.08}
              shadowRadius={8}
              elevation={3}
              borderWidth={1}
              borderColor="border"
            >
              <Button
                title="Enviar recordatorio"
                variant="black"
                size="large"
                onPress={handleSendReminder}
                icon={<AlarmClock color={theme.colors.white} />}
              />
            </Box>
          </Box>
        )}

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.l }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/** Pot */}
        <Box marginBottom="l">
          <Pot
            circle={circle}
            roundDeposits={roundDeposits}
            cornerBadge={circle.status !== CIRCLE_STATUS.pending}
          />
        </Box>

        {/** Pending users for invitation acceptance. */}
        {circle.status === CIRCLE_STATUS.pending && (
          <Box
            marginBottom="l"
            backgroundColor="white"
            padding="l"
            borderRadius="l"
            shadowColor="gray800"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
            borderWidth={1}
            borderColor="border"
          >
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="xs"
            >
              <Text variant="bodyBold" color="text" fontSize={16}>
                Participantes
              </Text>
              <Text variant="caption" color="textSecondary">
                {circle.currentParticipants} de{" "}
                {circle.targetParticipants ?? circle.currentParticipants} mínimo
              </Text>
            </Box>
            <Text variant="caption" color="textSecondary" marginBottom="m">
              El círculo estará listo para el sorteo cuando se complete el
              mínimo de participantes.
            </Text>

            <List
              items={[
                ...circle.members.map((member) => ({
                  id: member.id,
                  firstName: member.user.firstName,
                  lastName: member.user.lastName,
                  avatarUri: member.user.avatarUrl,
                  badgeLabel: "Unido",
                  badgeVariant: "success" as const,
                })),
                ...circle.invitations
                  .filter(
                    (invitation) =>
                      invitation.status === CIRCLE_INVITATION.pending,
                  )
                  .map((invitation) => ({
                    id: invitation.id,
                    firstName:
                      invitation.invitedUser?.firstName ??
                      invitation.invitedEmail,
                    lastName: invitation.invitedUser?.lastName ?? "",
                    avatarUri: invitation.invitedUser?.avatarUrl,
                    badgeLabel: "Pendiente",
                    badgeVariant: "warning" as const,
                  })),
              ]}
            />
          </Box>
        )}

        {/** Member payment status — creator only */}
        {isCreator && circle.status === CIRCLE_STATUS.active && (
          <Box
            marginBottom="l"
            backgroundColor="white"
            paddingHorizontal="m"
            borderRadius="l"
            shadowColor="gray800"
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.08}
            shadowRadius={8}
            elevation={3}
            borderWidth={1}
            borderColor="border"
          >
            <List
              items={circle.members.map((member, index) => {
                const isRecipient =
                  getCurrentPendingPayment(circle)?.recipientUserId ===
                  member.userId;
                const hasDeposited =
                  roundDeposits?.deposits.some(
                    (d) => d.memberId === member.userId,
                  ) ?? false;
                if (isRecipient) {
                  return {
                    id: member.id,
                    firstName: member.user.firstName,
                    lastName: member.user.lastName,
                    avatarUri: member.user.avatarUrl,
                    avatarBackgroundColor:
                      index % 2 === 0 ? "gray300" : ("gray400" as const),
                    badgeLabel: "Recibe",
                    badgeVariant: "primary" as const,
                  };
                }
                return {
                  id: member.id,
                  firstName: member.user.firstName,
                  lastName: member.user.lastName,
                  avatarUri: member.user.avatarUrl,
                  avatarBackgroundColor:
                    index % 2 === 0 ? "gray300" : ("gray400" as const),
                  subtitle: hasDeposited
                    ? undefined
                    : `${roundDeposits?.confirmed ?? 0} de ${roundDeposits?.total ?? circle.members.length} confirmados`,
                  badgeLabel: hasDeposited ? "Pagado" : undefined,
                  badgeVariant: "success" as const,
                  actionLabel: !hasDeposited ? "Ha pagado" : undefined,
                  onActionPress: !hasDeposited
                    ? () => handleConfirmMemberPayment(member.userId)
                    : undefined,
                };
              })}
            />
          </Box>
        )}

        {/** Timeline */}
        {circle.status === CIRCLE_STATUS.active &&
          circle.payments.length > 0 && (
            <Box marginBottom="l">
              <Timeline circle={circle} currentUserId={user?.id} />
            </Box>
          )}

        {/* Danger Zone - Cancel Circle
        {isCreator &&
          (circle.status === CIRCLE_STATUS.pending ||
            circle.status === CIRCLE_STATUS.readyToDraw) && (
            <Card padding="l" marginBottom="l" backgroundColor="gray50">
              <Box alignItems="center" marginBottom="m">
                <Text variant="subtitle" color="error" textAlign="center">
                  ⚠️ Zona de Peligro
                </Text>
                <Text
                  variant="body"
                  color="textSecondary"
                  textAlign="center"
                  marginTop="s"
                >
                  Acciones irreversibles
                </Text>
              </Box>

              <Button
                title="Cancelar Círculo"
                variant="outlineError"
                onPress={() => setShowCancelModal(true)}
                size="large"
              />
            </Card>
          )} */}
      </ScrollView>

      {/* Options Menu */}
      <Modal
        visible={showOptionsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOptionsMenu(false)}>
          <Box flex={1}>
            <TouchableWithoutFeedback>
              <Box
                style={{
                  position: "absolute",
                  top: 70,
                  right: theme.spacing.xl,
                  width: 220,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Box
                  backgroundColor="white"
                  borderRadius="m"
                  style={{ overflow: "hidden" }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setShowOptionsMenu(false);
                      setShowCancelModal(true);
                    }}
                  >
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      gap="m"
                      paddingVertical="m"
                      paddingHorizontal="l"
                    >
                      <Trash2 size={18} color={theme.colors.error} />
                      <Text variant="body" color="error">
                        Eliminar círculo
                      </Text>
                    </Box>
                  </TouchableOpacity>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          </Box>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Cancel Circle Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (cancelCircleMutation.isPending) return;
          closeCancelModal();
        }}
      >
        <Box
          flex={1}
          backgroundColor="background"
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="l"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Box
            backgroundColor="white"
            padding="l"
            borderRadius="m"
            width="100%"
            maxWidth={400}
          >
            <Box alignItems="center" marginBottom="l">
              <Text
                variant="titleBold"
                color="error"
                textAlign="center"
                marginBottom="s"
              >
                ⚠️ Cancelar Círculo
              </Text>
              <Text variant="body" color="textSecondary" textAlign="center">
                Esta acción no se puede deshacer. Todos los participantes serán
                notificados.
              </Text>
            </Box>

            <Box marginBottom="l">
              <Text variant="body" color="text" marginBottom="s">
                Para confirmar, escribe el nombre del círculo:
              </Text>
              <Text variant="bodyBold" color="text" marginBottom="m">
                &quot;{circle?.name}&quot;
              </Text>

              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.gray300,
                  borderRadius: theme.borderRadii.s,
                  padding: theme.spacing.m,
                  fontSize: 16,
                  color: theme.colors.text,
                }}
                placeholder="Escribe el nombre del círculo"
                value={cancelConfirmation}
                onChangeText={(text) => {
                  setCancelConfirmation(text);
                  setCancelError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!cancelCircleMutation.isPending}
              />
              {cancelError && (
                <Text variant="caption" color="error" marginTop="s">
                  {cancelError}
                </Text>
              )}
            </Box>

            <Box flexDirection="row" alignItems="center" gap="m">
              <TouchableOpacity
                onPress={() => {
                  if (cancelCircleMutation.isPending) return;
                  closeCancelModal();
                }}
                activeOpacity={0.7}
              >
                <CircleIcon
                  size="medium"
                  icon={<X size={20} color={theme.colors.textSecondary} />}
                />
              </TouchableOpacity>
              <Button
                title="Eliminar Círculo"
                size="large"
                variant="secondary"
                onPress={handleCancelCircle}
                loading={cancelCircleMutation.isPending}
                disabled={cancelConfirmation !== circle?.name}
                flex={1}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Send Reminder Modal */}
      <Modal
        visible={showReminderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="l"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <Box
            backgroundColor="white"
            padding="l"
            borderRadius="m"
            width="100%"
            maxWidth={400}
          >
            <Box alignItems="center" marginBottom="l">
              <Text
                variant="titleBold"
                color="text"
                textAlign="center"
                marginBottom="s"
              >
                Enviar un recordatorio
              </Text>
              <Text variant="body" color="textSecondary" textAlign="center">
                Miembros pendientes en tu círculo
              </Text>
            </Box>

            <Box marginBottom="l">
              <Box height={1} backgroundColor="gray200" marginBottom="s" />
              <List
                items={circle.invitations
                  .filter(
                    (invitation) =>
                      invitation.status === CIRCLE_INVITATION.pending,
                  )
                  .map((invitation) => ({
                    id: invitation.id,
                    firstName:
                      invitation.invitedUser?.firstName ??
                      invitation.invitedEmail,
                    lastName: invitation.invitedUser?.lastName ?? "",
                    avatarUri: invitation.invitedUser?.avatarUrl,
                    badgeLabel: "Pendiente",
                    badgeVariant: "warning" as const,
                  }))}
              />
              <Box height={1} backgroundColor="gray200" marginTop="s" />
            </Box>

            <Box flexDirection="row" alignItems="center" gap="m">
              <TouchableOpacity
                onPress={() => {
                  if (isSendingReminder) return;
                  setShowReminderModal(false);
                }}
                activeOpacity={0.7}
              >
                <CircleIcon
                  size="medium"
                  icon={<X size={20} color={theme.colors.textSecondary} />}
                />
              </TouchableOpacity>
              <Button
                title="Enviar"
                size="large"
                variant="primary2"
                icon={<Send size={18} color={theme.colors.white} />}
                onPress={handleConfirmSendReminder}
                loading={isSendingReminder}
                disabled={isSendingReminder}
                iconPosition="right"
                flex={1}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Member Payment Confirmation Dialog */}
      <AlertDialog
        visible={showMemberPaymentDialog}
        title="Confirmar Pago"
        description="¿Confirmas que este miembro ha realizado su pago?"
        icon={<HandCoins color={theme.colors.warning} />}
        onCancel={() => {
          setShowMemberPaymentDialog(false);
          setPendingMemberPaymentId(null);
        }}
        onConfirm={handleExecuteMemberPayment}
        confirmLoading={confirmMemberPaymentMutation.isPending}
        confirmText="Si"
        cancelText="Aún no"
        variant="warning"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
      />

      {/* Error Dialog */}
      <AlertDialog
        visible={showErrorDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<X />}
        onCancel={() => setShowErrorDialog(false)}
        confirmText="CERRAR"
        cancelText="CERRAR"
        variant="error"
        confirmButtonVariant="outlineError"
        cancelButtonVariant="outlineGray"
      />

      {/* Success Dialog */}
      <AlertDialog
        visible={showSuccessDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<Check color={theme.colors.success} />}
        onCancel={() => setShowSuccessDialog(false)}
        confirmText="Continuar"
        cancelText="CERRAR"
        variant="success"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
      />

      {/* Payment Confirmation Dialog */}
      <AlertDialog
        visible={showPaymentDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<HandCoins color={theme.colors.warning} />}
        onCancel={() => setShowPaymentDialog(false)}
        onConfirm={handleConfirmPayment}
        confirmLoading={verifyPaymentMutation.isPending}
        confirmText="Sí"
        cancelText="Cancelar"
        variant="warning"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
      />

      {/* Circle Completed Dialog */}
      <AlertDialog
        visible={showCircleCompletedDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<Check color={theme.colors.success} />}
        onCancel={() => setShowCircleCompletedDialog(false)}
        onConfirm={handleRateMembers}
        confirmText="Calificar Miembros"
        cancelText="Cerrar"
        variant="success"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
        stackedButtons={true}
      />
    </Box>
  );
};

export default CircleDetailsContent;
