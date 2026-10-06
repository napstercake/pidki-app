import { Box } from "@/components/authorable/Box";
import { EmptyState } from "@/components/authorable/EmptyState";
import { Header } from "@/components/authorable/Header";
import HeroCircleItem from "@/components/authorable/HeroCircleItem";
import { LoadingSpinner } from "@/components/authorable/LoadingSpinner";
import { MultipleChoice } from "@/components/authorable/MultipleChoice";
import { CIRCLE_STATUS } from "@/constants/circles";
import { TAB_BAR_CLEARANCE } from "@/constants/Common";
import { useCircles } from "@/hooks/queries/useCircles";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { Circle, CircleStatusType } from "@/types/api";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { CircleFadingPlus } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

type StatusFilter = "all" | CircleStatusType;

export default function CirclesScreen() {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const { data, isLoading, isRefetching, refetch } = useCircles();
  const circles = data?.circles ?? [];
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando tus circulos..." />;
  }

  const handleCirclePress = (circle: Circle) => {
    router.push(`/circle/${circle.id}`);
  };

  const filteredCircles = circles.filter(
    (circle) => statusFilter === "all" || circle.status === statusFilter,
  );

  const onRefresh = () => {
    refetch();
  };

  return (
    <Box flex={1} backgroundColor="background">
      <Header
        avatarUrl={user?.avatarUrl}
        firstName={user?.firstName}
        lastName={user?.lastName}
        borderBottom={false}
        backgroundColor="gray900"
      />

      {/* Filters */}
      <Box
        backgroundColor="gray900"
        paddingHorizontal="l"
        paddingVertical="l"
        borderBottomLeftRadius="xl"
        borderBottomRightRadius="xl"
      >
        <MultipleChoice
          options={[
            { label: "Todos", value: "all" },
            { label: "Activo", value: CIRCLE_STATUS.active },
            { label: "Pendiente", value: CIRCLE_STATUS.pending },
          ]}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val as StatusFilter)}
        />
      </Box>

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
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {filteredCircles.length === 0 ? (
          <EmptyState
            title="Aun no hay círculos"
            description={`No hay círculos que coincidan con tus filtros actuales. Intenta ajustar tus filtros o crea un nuevo círculo.`}
            actionText="Crear círculo"
            onAction={() => router.push("/circle/create")}
            actionIcon={<CircleFadingPlus color={theme.colors.gray900} />}
          />
        ) : (
          <Box gap="m">
            {filteredCircles.map((circle) => (
              <HeroCircleItem
                key={circle.id}
                circle={circle}
                onPress={handleCirclePress}
              />
            ))}
          </Box>
        )}
      </ScrollView>
    </Box>
  );
}
