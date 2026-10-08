import { AlertDialog, Avatar } from "@/components/authorable";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import { Card } from "@/components/authorable/Card";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import { Text } from "@/components/authorable/Text";
import { useRateUser } from "@/hooks/mutations/useUserMutations";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { useTheme } from "@shopify/restyle";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Check, ChevronLeft, Star, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

interface MemberRating {
  userId: string;
  rating: number;
}

export default function RateMembersScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <RateMembersContent />
    </>
  );
}

function RateMembersContent() {
  const theme = useTheme<Theme>();
  const { circleData } = useLocalSearchParams<{
    id: string;
    circleData: string;
  }>();
  const { user } = useAuth();
  const rateUserMutation = useRateUser();
  const isLoading = rateUserMutation.isPending;
  const [ratingByUserId, setRatingByUserId] = useState<Record<string, number>>(
    {},
  );
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  // Parse circle data from route params using useMemo to prevent infinite re-renders
  const circle: Circle | null = useMemo(() => {
    if (!circleData) return null;
    try {
      return JSON.parse(circleData);
    } catch (error) {
      console.error("Error parsing circle data:", error);
      return null;
    }
  }, [circleData]);

  // Ratings for all members (excluding the current user), unrated ones default to 0
  const ratings: MemberRating[] = useMemo(() => {
    if (!circle || !user) return [];

    return circle.members
      .filter((member) => member.userId !== user.id)
      .map((member) => ({
        userId: member.userId,
        rating: ratingByUserId[member.userId] ?? 0,
      }));
  }, [circle, user, ratingByUserId]);

  const handleRatingChange = (userId: string, newRating: number) => {
    setRatingByUserId((prev) => ({ ...prev, [userId]: newRating }));
  };

  const handleSubmitRatings = async () => {
    const unratedMembers = ratings.filter((r) => r.rating === 0);
    if (unratedMembers.length > 0) {
      setDialogTitle("Error");
      setDialogMessage(
        "Por favor califica a todos los miembros antes de continuar.",
      );
      setShowErrorDialog(true);
      return;
    }

    try {
      await Promise.all(
        ratings.map((rating) =>
          rateUserMutation.mutateAsync({
            userId: rating.userId,
            data: { rating: rating.rating },
          }),
        ),
      );
      setDialogTitle("¡Calificaciones Enviadas!");
      setDialogMessage(
        "Todas las calificaciones han sido enviadas exitosamente.",
      );
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error("Error submitting ratings:", error);
      setDialogTitle("Error");
      setDialogMessage(
        error.message || "No se pudieron enviar las calificaciones.",
      );
      setShowErrorDialog(true);
    }
  };

  const handleNavigateToCircles = () => {
    setShowSuccessDialog(false);
    router.replace("/circles");
  };

  const renderStars = (userId: string, currentRating: number) => {
    return (
      <Box flexDirection="row" gap="xs">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingChange(userId, star)}
          >
            <Star
              size={24}
              color={
                star <= currentRating
                  ? theme.colors.warning
                  : theme.colors.gray300
              }
              fill={
                star <= currentRating ? theme.colors.warning : "transparent"
              }
            />
          </TouchableOpacity>
        ))}
      </Box>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Enviando calificaciones..." />;
  }

  if (!circle) {
    return (
      <Box
        flex={1}
        backgroundColor="background"
        alignItems="center"
        justifyContent="center"
      >
        <Text variant="titleBold" color="text">
          Error: No se pudo cargar el círculo
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      {/* Header */}
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary2,
        ]}
      >
        <Box paddingHorizontal="l" paddingTop="xxxl" paddingBottom="l">
          <Box flexDirection="row" alignItems="center">
            <IconButton onPress={() => router.back()}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </IconButton>
            <Box flex={1} marginLeft="m">
              <Text
                variant="HeaderMiniBold"
                style={{ color: theme.colors.white }}
              >
                Calificar Miembros
              </Text>
              <Text variant="body" style={{ color: theme.colors.white }}>
                {circle.name}
              </Text>
            </Box>
          </Box>
        </Box>
      </Gradient>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.l }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="subtitle"
          color="text"
          marginBottom="l"
          textAlign="center"
        >
          Califica a los miembros de tu círculo:
        </Text>

        <Box gap="l">
          {ratings.map((memberRating) => {
            const member = circle.members.find(
              (m) => m.userId === memberRating.userId,
            );
            if (!member) return null;

            return (
              <Card key={member.id} padding="m" backgroundColor="gray50">
                <Box flexDirection="row" alignItems="center" marginBottom="m">
                  <Avatar
                    size="medium"
                    firstName={member.user.firstName}
                    lastName={member.user.lastName}
                    backgroundColor="primary"
                  />
                  <Box flex={1} marginLeft="m">
                    <Text variant="bodyBold" color="text" marginBottom="xs">
                      {member.user.firstName} {member.user.lastName}
                    </Text>
                    <Text variant="caption" color="textSecondary">
                      {member.user.email}
                    </Text>
                  </Box>
                </Box>

                <Box alignItems="center">
                  {renderStars(member.userId, memberRating.rating)}
                  <Text variant="caption" color="textSecondary" marginTop="s">
                    {memberRating.rating === 0 &&
                      "Toca las estrellas para calificar"}
                    {memberRating.rating === 1 && "Muy malo"}
                    {memberRating.rating === 2 && "Malo"}
                    {memberRating.rating === 3 && "Regular"}
                    {memberRating.rating === 4 && "Bueno"}
                    {memberRating.rating === 5 && "Excelente"}
                  </Text>
                </Box>
              </Card>
            );
          })}
        </Box>

        <Button
          title="Enviar Calificaciones"
          variant="primary"
          onPress={handleSubmitRatings}
          disabled={ratings.some((r) => r.rating === 0)}
          size="large"
          marginTop="l"
          iconPosition="right"
          icon={<Check size={22} color={theme.colors.white} />}
        />
      </ScrollView>

      {/* Error Dialog */}
      <AlertDialog
        visible={showErrorDialog}
        title={dialogTitle}
        description={dialogMessage}
        icon={<X color={theme.colors.error} />}
        onCancel={() => setShowErrorDialog(false)}
        confirmText="OK"
        cancelText="Cerrar"
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
        onConfirm={handleNavigateToCircles}
        confirmText="OK"
        cancelText="Cerrar"
        variant="success"
        confirmButtonVariant="primary"
        cancelButtonVariant="outlineGray"
      />
    </Box>
  );
}
