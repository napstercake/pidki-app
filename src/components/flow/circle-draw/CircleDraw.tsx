import { AlertDialog, Avatar } from "@/components/authorable";
import { AvatarGroup } from "@/components/authorable/AvatarGroup";
import { Badge } from "@/components/authorable/Badge";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import Hero from "@/components/authorable/Hero";
import IconButton from "@/components/authorable/IconButton";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import { StatusLabel } from "@/components/authorable/StatusLabel";
import { Text } from "@/components/authorable/Text";
import CircleDrawResult from "@/components/flow/circle-draw/CircleDrawResult";
import { usePerformDraw } from "@/hooks/mutations/useCircleMutations";
import { useCircle } from "@/hooks/queries/useCircles";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { getPaymentPeriodText } from "@/utils/circles";
import { formatCurrency } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ChevronLeft, Clock, Play, Star } from "lucide-react-native";
import { ReactNode, useState } from "react";
import { ScrollView } from "react-native";

interface CircleDrawProps {
  circle: Circle;
}

const CircleDraw = ({ circle }: CircleDrawProps) => {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const performDrawMutation = usePerformDraw(circle.id);
  const { refetch: refetchCircle } = useCircle(circle.id);
  const [showDrawDialog, setShowDrawDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [drawnCircle, setDrawnCircle] = useState<Circle | null>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState<ReactNode>("");

  const isCreator = circle.creatorId === user?.id;
  const canPerformDraw = isCreator && circle.currentParticipants >= 3;

  const handlePerformDraw = () => {
    setDialogTitle("Realizar sorteo");
    setDialogMessage(
      "¿Estás seguro de querer realizar el sorteo? Esto asignará posiciones a todos los participantes y activará el círculo.",
    );
    setShowDrawDialog(true);
  };

  const handleConfirmDraw = async () => {
    setShowDrawDialog(false);

    try {
      await performDrawMutation.mutateAsync();
      const { data } = await refetchCircle();
      if (data) setDrawnCircle(data.circle);
    } catch (error) {
      console.error("Error performing draw:", error);
      setDialogTitle("Error");
      setDialogMessage("No se pudo realizar el sorteo");
      setShowErrorDialog(true);
    }
  };

  if (performDrawMutation.isPending) {
    return <LoadingSpinner fullScreen text="Procesando..." />;
  }

  if (drawnCircle) {
    return (
      <CircleDrawResult circle={drawnCircle} onStart={() => router.back()} />
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      {/* Header */}
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
          theme.colors.linearGradientPrimary2,
        ]}
      >
        <Box paddingHorizontal="l" paddingTop="xxl" paddingBottom="l" gap="m">
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <IconButton onPress={() => router.back()}>
              <ChevronLeft size={20} color={theme.colors.white} />
            </IconButton>
            {isCreator && (
              <IconButton onPress={() => {}}>
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
              <StatusLabel status={circle.status} />
            </Box>

            <Box flexDirection="row" alignItems="center" gap="s">
              <AvatarGroup members={circle.members} maxVisible={3} />
              <Text variant="caption" color="white">
                {circle.currentParticipants} participantes ·{" "}
                {getPaymentPeriodText(circle.paymentPeriod).toLowerCase()}
              </Text>
            </Box>
          </Box>
        </Box>
      </Gradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.l }}
        showsVerticalScrollIndicator={false}
      >
        {/* Circle Stats Hero */}
        <Box paddingHorizontal="l" marginBottom="s">
          <Hero
            poolAmount={formatCurrency(circle.goalAmount)}
            stats={[
              {
                label: "TU APORTE",
                value: `${formatCurrency(circle.paymentAmount)} ${getPaymentPeriodText(circle.paymentPeriod).toLowerCase()}`,
              },
              {
                label: "DURACIÓN",
                value: `${circle.currentParticipants} rondas · ${circle.currentParticipants} ${getPaymentPeriodText(circle.paymentPeriod).toLowerCase()}s`,
              },
            ]}
          />
        </Box>

        {/* Participants */}
        <Box marginBottom="l">
          <Text
            variant="bodyBold"
            color="text"
            fontSize={18}
            marginBottom="m"
            marginTop="s"
          >
            Participantes
          </Text>

          <Box gap="m">
            {circle.members.map((member, index) => (
              <Card key={member.id} padding="m" backgroundColor="gray50">
                <Box flexDirection="row" alignItems="flex-start">
                  <Avatar
                    size="medium"
                    uri={member.user.avatarUrl}
                    firstName={member.user.firstName}
                    lastName={member.user.lastName}
                    backgroundColor={index % 2 === 0 ? "gray300" : "gray400"}
                  />

                  <Box flex={1} marginLeft="m">
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      marginBottom="xs"
                    >
                      <Text variant="bodyBold" color="text" style={{ flex: 1 }}>
                        {member.user.firstName} {member.user.lastName}
                      </Text>
                      {member.userId === circle.creatorId && (
                        <Badge variant="secondary" size="small">
                          Creador
                        </Badge>
                      )}
                    </Box>

                    <Box flexDirection="row" alignItems="center" gap="xs">
                      <Star
                        size={12}
                        color={theme.colors.yellow500}
                        fill={theme.colors.yellow500}
                      />
                      <Text variant="caption" color="textSecondary">
                        {member.user.averageRating > 0
                          ? `${member.user.averageRating.toFixed(1)} (${member.user.totalRatings})`
                          : "Sin calificaciones"}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box marginBottom="l" gap="m" marginTop="m">
          {canPerformDraw && (
            <Button
              title="Sortear Turnos"
              variant="primary2"
              onPress={handlePerformDraw}
              icon={<Play size={16} color={theme.colors.white} />}
              size="large"
            />
          )}

          {!canPerformDraw && circle.currentParticipants < 3 && (
            <Box alignItems="center" paddingVertical="m">
              <Clock size={24} color={theme.colors.warning} />
              <Text
                variant="body"
                color="textSecondary"
                textAlign="center"
                marginTop="s"
              >
                Necesitas al menos 3 participantes para iniciar el sorteo.
              </Text>
            </Box>
          )}
        </Box>
      </ScrollView>

      {/* Draw Confirmation Dialog */}
      <AlertDialog
        visible={showDrawDialog}
        title={dialogTitle}
        description={dialogMessage}
        onCancel={() => setShowDrawDialog(false)}
        onConfirm={handleConfirmDraw}
        confirmText="Sortear"
        cancelText="Cancelar"
        variant="warning"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
      />

      {/* Error Dialog */}
      <AlertDialog
        visible={showErrorDialog}
        title={dialogTitle}
        description={dialogMessage}
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
        onCancel={() => setShowSuccessDialog(false)}
        confirmText="Continuar"
        cancelText="CERRAR"
        variant="success"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
      />

    </Box>
  );
};

export default CircleDraw;
