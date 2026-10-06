import { LoadingSpinner } from "@/components/authorable";
import ActivityList from "@/components/authorable/ActivityList";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import { Card } from "@/components/authorable/Card";
import CircleItem from "@/components/authorable/CircleItem";
import { Header } from "@/components/authorable/Header";
import HeroCard from "@/components/authorable/HeroCard";
import Hi from "@/components/authorable/Hi";
import { Text } from "@/components/authorable/Text";
import { CIRCLE_STATUS } from "@/constants/circles";
import { TAB_BAR_CLEARANCE } from "@/constants/Common";
import { useCircles } from "@/hooks/queries/useCircles";
import { useFeed } from "@/hooks/queries/useFeed";
import { useAuth } from "@/services/AuthContext";
import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import { Link, router } from "expo-router";
import { ChevronRight, CircleFadingPlus, Users } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const theme = useTheme<Theme>();
  const { user } = useAuth();
  const { data, isLoading } = useCircles();
  const circles = data?.circles ?? [];
  const { data: feedData } = useFeed();
  const feedItems = feedData?.feed ?? [];

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const activeCircles = circles.filter(
    (circle: any) => circle.status === CIRCLE_STATUS.active,
  );

  const completedCircles = circles.filter(
    (circle: any) => circle.status === CIRCLE_STATUS.completed,
  );

  const totalSavings = completedCircles.reduce(
    (sum: number, circle: any) => sum + (circle.goalAmount || 0),
    0,
  );
  // Remove the entire Next Draw section since nextDraw is always undefined

  return (
    <Box flex={1} backgroundColor="background">
      <Header
        avatarUrl={user?.avatarUrl}
        firstName={user?.firstName}
        lastName={user?.lastName}
        backgroundColor="gray900"
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}
        testID="home-screen"
      >
        <Box marginTop="m">
          <Hi
            image={require("../../../assets/images/badge-01.png")}
            title={`Hola ${user?.firstName}`}
            subtitle="Bienvenido a tu app de ahorro y crecimiento"
          />
        </Box>
        <Box
          flex={1}
          backgroundColor="background"
          paddingHorizontal="l"
          paddingTop="xs"
          paddingBottom="l"
        >
          <HeroCard
            amount={totalSavings}
            onAddFunds={() => router.push("/circles")}
            onCreate={() => router.push("/circle/create")}
          />

          {/* My Circles */}
          <Box marginBottom="l">
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              marginBottom="m"
            >
              <Text variant="bodyBold" color="text" fontSize={18}>
                Círculos
              </Text>
              <Link href="/circles" asChild>
                <TouchableOpacity>
                  <Box flexDirection="row" alignItems="center" gap="xs">
                    <Text variant="bodyBold" color="primary">
                      Ver todos
                    </Text>
                    <ChevronRight size={16} color={theme.colors.primary} />
                  </Box>
                </TouchableOpacity>
              </Link>
            </Box>

            {circles.length > 0 ? (
              circles.slice(0, 3).map((circle: any) => (
                <Link key={circle.id} href={`/circle/${circle.id}`} asChild>
                  <TouchableOpacity>
                    <CircleItem circle={circle} />
                  </TouchableOpacity>
                </Link>
              ))
            ) : (
              <Card padding="l">
                <Box alignItems="center">
                  <Users size={48} color={theme.colors.textTertiary} />
                  <Text
                    variant="body"
                    color="textSecondary"
                    textAlign="center"
                    marginTop="m"
                  >
                    Aún no eres miembro de ningún círculo
                  </Text>
                  <Button
                    title="Unirme"
                    onPress={() => {}}
                    marginTop="m"
                    variant="primary2"
                    size="large"
                    icon={<CircleFadingPlus color={theme.colors.white} />}
                  />
                </Box>
              </Card>
            )}
          </Box>

          {/* Recent Activity */}
          <Box>
            <Text
              variant="bodyBold"
              color="text"
              fontSize={18}
              marginBottom="m"
            >
              Actividad reciente
            </Text>
            <Card padding="m">
              <ActivityList items={feedItems} />
            </Card>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
