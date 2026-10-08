import AmountTitle from "@/components/authorable/AmountTitle";
import { Avatar } from "@/components/authorable/Avatar";
import { Box } from "@/components/authorable/Box";
import { Button } from "@/components/authorable/Button";
import Gradient from "@/components/authorable/Gradient";
import { Text } from "@/components/authorable/Text";
import { Theme } from "@/theme";
import { Circle } from "@/types/api";
import { formatDate } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import * as Sharing from "expo-sharing";
import { Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#FA8072",
  "#FFD700",
  "#FF69B4",
  "#7B68EE",
  "#00FA9A",
  "#FFA500",
  "#FFFFFF",
];

interface ConfettiPieceProps {
  x: number;
  color: string;
  delay: number;
  size: number;
  shape: "square" | "circle" | "rect";
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({
  x,
  color,
  delay,
  size,
  shape,
}) => {
  const [translateY] = useState(() => new Animated.Value(-20));
  const [opacity] = useState(() => new Animated.Value(0));
  const [rotate] = useState(() => new Animated.Value(0));
  const [translateX] = useState(() => new Animated.Value(0));
  const [drift] = useState(() => (Math.random() - 0.5) * 100);
  const [spinDirection] = useState(() => (Math.random() > 0.5 ? 1 : -1));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT * 0.85,
          duration: 3200 + Math.random() * 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: drift,
          duration: 3200 + Math.random() * 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2500 + Math.random() * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(2200),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [delay, drift, opacity, rotate, translateX, translateY]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${spinDirection * 720}deg`],
  });

  const borderRadius = shape === "circle" ? size / 2 : shape === "rect" ? 2 : 0;
  const width = shape === "rect" ? size * 0.45 : size;
  const height = shape === "rect" ? size * 1.8 : size;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: x,
        width,
        height,
        borderRadius,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: spin }],
      }}
    />
  );
};

const Confetti: React.FC = () => {
  const [pieces] = useState(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 1000,
      size: 6 + Math.random() * 8,
      shape: (["square", "circle", "rect"] as const)[
        Math.floor(Math.random() * 3)
      ],
    })),
  );

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents="none"
    >
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </View>
  );
};

interface CircleDrawResultProps {
  circle: Circle;
  onStart: () => void;
}

const CircleDrawResult: React.FC<CircleDrawResultProps> = ({
  circle,
  onStart,
}) => {
  const theme = useTheme<Theme>();
  const viewShotRef = useRef<ViewShot>(null);

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewShotRef, { format: "png", quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: "image/png" });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const sortedMembers = [...circle.members].sort((a, b) => {
    const posA = a.position ?? Infinity;
    const posB = b.position ?? Infinity;
    return posA - posB;
  });

  const winner = sortedMembers[0];

  const getDateLabel = (index: number): string => {
    const now = new Date();
    if (index === 0) return "esta semana";
    const date = new Date(now);
    const period = circle.paymentPeriod;
    const daysToAdd =
      period === "WEEKLY"
        ? index * 7
        : period === "BIWEEKLY"
          ? index * 14
          : index * 30;
    date.setDate(date.getDate() + daysToAdd);
    return formatDate(date, { day: "numeric", month: "short" });
  };

  return (
    <ViewShot
      ref={viewShotRef}
      options={{ format: "png", quality: 1 }}
      style={{ flex: 1 }}
    >
      <Gradient
        colors={[
          theme.colors.linearGradientPrimary1,
          theme.colors.linearGradientPrimary3,
        ]}
        direction="vertical"
        style={{ flex: 1 }}
      >
        {/* Top section */}
        <Box alignItems="center" paddingTop="xxl" paddingHorizontal="l" gap="m">
          <Text
            variant="captionUpperBold"
            marginTop="xxxl"
            color="white"
            style={{ opacity: 0.85, letterSpacing: 2 }}
          >
            SORTEO · RONDA 1
          </Text>

          {/* Winner avatar */}
          <Box
            style={{
              position: "relative",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 7,
            }}
          >
            <Box
              style={{
                borderRadius: 52,
                borderWidth: 3,
                borderColor: theme.colors.primary,
                overflow: "hidden",
              }}
            >
              <Avatar
                size="extralarge"
                uri={winner?.user.avatarUrl}
                firstName={winner?.user.firstName}
                lastName={winner?.user.lastName}
                backgroundColor="white"
              />
            </Box>
            <Box
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: theme.colors.warning,
                borderRadius: 16,
                minWidth: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 6,
                borderWidth: 2,
                borderColor: theme.colors.linearGradientSecondary3,
              }}
            >
              <Text color="text" fontSize={13} fontWeight="700">
                1°
              </Text>
            </Box>
          </Box>

          {/* Winner name & subtitle */}
          <Box alignItems="center" gap="xs">
            <Text variant="titleBold" color="white" style={{ fontSize: 22 }}>
              ¡Le toca a {winner?.user.firstName}!
            </Text>
            <Text variant="caption" color="white" style={{ opacity: 0.85 }}>
              Recibe el pozo en esta ronda
            </Text>
          </Box>

          {/* Amount pill */}
          <Box
            style={{
              borderRadius: 24,
              paddingVertical: 10,
              paddingHorizontal: 24,
              backgroundColor: "rgba(255,255,255,0.3)",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <AmountTitle amount={circle.goalAmount} color="white" />
          </Box>
        </Box>

        {/* White card */}
        <Box
          marginHorizontal="l"
          marginTop="xl"
          borderRadius="xl"
          paddingHorizontal="m"
          paddingTop="m"
          paddingBottom="xs"
          style={{
            backgroundColor: theme.colors.white,
            shadowColor: theme.colors.gray800,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text
            variant="captionUpperBold"
            color="textSecondary"
            style={{ letterSpacing: 1.5, marginBottom: theme.spacing.s }}
          >
            ORDEN DEFINIDO
          </Text>

          {sortedMembers.map((member, index) => {
            const isFirst = index === 0;
            const isLast = index === sortedMembers.length - 1;
            return (
              <Box
                key={member.id}
                flexDirection="row"
                alignItems="center"
                paddingVertical="m"
                paddingHorizontal="s"
                borderBottomWidth={isLast ? 0 : 1}
                borderBottomColor="borderLight"
                gap="m"
                style={
                  isFirst
                    ? {
                        backgroundColor: `${theme.colors.secondary}18`,
                        borderRadius: 10,
                      }
                    : undefined
                }
              >
                {/* Position bubble */}
                <Box
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isFirst
                      ? theme.colors.secondary
                      : theme.colors.gray200,
                    borderWidth: isFirst ? 0 : 1.5,
                    borderColor: theme.colors.gray300,
                  }}
                >
                  <Text
                    variant="bodyBold"
                    style={{ fontSize: 12 }}
                    color={isFirst ? "white" : "textSecondary"}
                  >
                    {index + 1}
                  </Text>
                </Box>
                <Text variant="bodyBold" color="text" style={{ flex: 1 }}>
                  {member.user.firstName} {member.user.lastName}
                </Text>
                <Text
                  variant="caption"
                  color={isFirst ? "secondary" : "textSecondary"}
                >
                  {getDateLabel(index)}
                </Text>
              </Box>
            );
          })}
        </Box>

        {/* CTA */}
        <Box paddingHorizontal="l" marginTop="xl" gap="m">
          <Button
            title="Comenzar Ronda 1"
            variant="white"
            size="large"
            onPress={onStart}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 4,
            }}
          >
            <Send size={16} color={theme.colors.white} />
            <Text variant="bodyBold" color="white" style={{ marginLeft: 8 }}>
              Compartir resultado
            </Text>
          </TouchableOpacity>
        </Box>

        <Confetti />
      </Gradient>
    </ViewShot>
  );
};

export default CircleDrawResult;
