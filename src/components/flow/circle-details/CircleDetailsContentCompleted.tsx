import AmountTitle from "@/components/authorable/AmountTitle";
import { Avatar } from "@/components/authorable/Avatar";
import { AvatarGroup } from "@/components/authorable/AvatarGroup";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import IconButton from "@/components/authorable/IconButton";
import { Text } from "@/components/authorable/Text";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CircleDetailsContentCompletedProps {
  circle: Circle;
  onRateMembers: () => void;
}

const CircleDetailsContentCompleted: React.FC<
  CircleDetailsContentCompletedProps
> = ({ circle, onRateMembers }) => {
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();

  return (
    <Gradient
      colors={[
        theme.colors.linearGradientPrimary1,
        theme.colors.linearGradientPrimary3,
        theme.colors.linearGradientPrimary2,
      ]}
      style={{ flex: 1 }}
    >
      <Box
        flex={1}
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Box paddingHorizontal="l" paddingTop="m">
          <IconButton onPress={() => router.back()}>
            <ChevronLeft size={20} color={theme.colors.white} />
          </IconButton>
        </Box>

        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
          paddingHorizontal="l"
        >
          <Text
            variant="captionUpperBold"
            color="white"
            style={{ opacity: 0.85, letterSpacing: 2 }}
            marginBottom="l"
          >
            CÍRCULO COMPLETADO
          </Text>

          {/* Creator avatar + members */}
          <Box alignItems="center" gap="m" marginBottom="l">
            <Box
              style={{
                borderRadius: 52,
                borderWidth: 3,
                borderColor: theme.colors.white,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 7,
              }}
            >
              <Avatar
                size="extralarge"
                uri={circle.creator.avatarUrl}
                firstName={circle.creator.firstName}
                lastName={circle.creator.lastName}
                backgroundColor="white"
              />
            </Box>

            <AvatarGroup members={circle.members} maxVisible={4} />
          </Box>

          <Text
            variant="titleBold"
            color="white"
            textAlign="center"
            marginBottom="xs"
            style={{ fontSize: 22 }}
          >
            {circle.name}
          </Text>
          <Text
            variant="body"
            color="white"
            textAlign="center"
            marginBottom="xl"
            style={{ opacity: 0.85 }}
          >
            ¡El círculo se ha completado correctamente!
          </Text>

          <Box
            style={{
              borderRadius: 24,
              paddingVertical: 10,
              paddingHorizontal: 24,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
          >
            <AmountTitle amount={circle.goalAmount} color="white" />
          </Box>
        </Box>

        <Box paddingHorizontal="l" paddingBottom="l">
          <Button
            title="Calificar Miembros"
            variant="white"
            size="large"
            onPress={onRateMembers}
          />
        </Box>
      </Box>
    </Gradient>
  );
};

export default CircleDetailsContentCompleted;
