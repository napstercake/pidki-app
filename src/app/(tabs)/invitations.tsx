import { Text } from "@/components/authorable";
import { Box } from "@/components/authorable/Box";
import { EmptyState } from "@/components/authorable/EmptyState";
import { Header } from "@/components/authorable/Header";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import StackList from "@/components/authorable/StackList";
import { TAB_BAR_CLEARANCE } from "@/constants/Common";
import { usePendingInvitations } from "@/hooks/queries/useInvitations";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { Binoculars, Footprints } from "lucide-react-native";
import { RefreshControl, ScrollView } from "react-native";

export default function InvitationsScreen() {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const { data, isLoading, isRefetching, refetch } = usePendingInvitations();
  const invitations = data?.invitations ?? [];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando invitaciones..." />;
  }

  return (
    <Box flex={1} backgroundColor="background">
      <Header
        avatarUrl={user?.avatarUrl}
        firstName={user?.firstName}
        lastName={user?.lastName}
        backgroundColor="gray900"
      />

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing.l,
          paddingBottom: TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {invitations.length === 0 ? (
          <EmptyState
            title="No tienes invitaciones aún"
            description="Las invitaciones aparecerán aquí cuando tus amigos te inviten a unirte a sus círculos."
            icon={<Footprints />}
            actionText="Explorar círculos"
            actionIcon={<Binoculars color={theme.colors.gray900} />}
            onAction={() => router.push("/(tabs)/circles")}
          />
        ) : (
          <>
            <Text
              variant="bodyBold"
              color="text"
              fontSize={18}
              marginBottom="l"
            >
              Invitaciones
            </Text>
            <StackList
              items={invitations.map((invitation, index) => ({
                id: invitation.id,
                title: invitation.circle?.name || "Círculo",
                subtitle: `${invitation.circle?.creator.firstName || ""} ${
                  invitation.circle?.creator.lastName || ""
                }`.trim(),
                highlightedText: "Pendiente",
                highlightColor: "warning",
                avatarInitialsSource: invitation.circle?.name || "Círculo",
                avatarBackgroundColor:
                  index % 2 === 0 ? "secondary" : "primaryLight",
                onPress: () => router.push(`/invitation/${invitation.id}`),
              }))}
            />
          </>
        )}
      </ScrollView>
    </Box>
  );
}
