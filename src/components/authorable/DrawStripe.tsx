import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { Box } from "./Box";
import { Text } from "./Text";

interface DrawStripeProps {
  participants: number;
}

interface SlotItem {
  label: string;
  isExtra?: boolean;
  extraCount?: number;
}

function buildSlots(participants: number): SlotItem[] {
  if (participants <= 3) {
    return Array.from({ length: participants }, (_, i) => ({
      label: `Ronda ${i + 1}`,
    }));
  }
  return [
    { label: "Ronda 1" },
    {
      label: `+${participants - 2}`,
      isExtra: true,
      extraCount: participants - 2,
    },
    { label: `Ronda ${participants}` },
  ];
}

function Slot({ item, index }: { item: SlotItem; index: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      index * 150,
      withSpring(1, { damping: 12, stiffness: 120 }),
    );
    opacity.value = withDelay(index * 150, withSpring(1));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animStyle}>
      <Box alignItems="center" gap="xs">
        <Box
          width={52}
          height={52}
          borderRadius="round"
          alignItems="center"
          justifyContent="center"
          backgroundColor={item.isExtra ? "gray100" : "white"}
          borderWidth={1.5}
          borderColor="gray300"
          style={item.isExtra ? undefined : { borderStyle: "dashed" }}
        >
          <Text
            variant={item.isExtra ? "captionBold" : "bodyBold"}
            color="textLight"
          >
            {item.isExtra ? item.label : "?"}
          </Text>
        </Box>
        <Text
          variant="captionUpperBold"
          color="textLight"
          style={{ fontSize: 10 }}
        >
          {item.isExtra ? "más" : item.label}
        </Text>
      </Box>
    </Animated.View>
  );
}

function Arrow({ index }: { index: number }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(index * 150 + 75, withSpring(1));
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animStyle}>
      <Box paddingBottom="m">
        <Text variant="body" color="gray300">
          →
        </Text>
      </Box>
    </Animated.View>
  );
}

export default function DrawStripe({ participants }: DrawStripeProps) {
  const slots = buildSlots(participants);

  return (
    <Box
      backgroundColor="white"
      borderRadius="l"
      borderWidth={1}
      borderColor="border"
      padding="m"
      gap="m"
      marginBottom="m"
    >
      <Text
        variant="captionUpperBold"
        color="textLight"
        style={{ letterSpacing: 0.8 }}
      >
        ORDEN DE TURNOS
      </Text>

      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="xs"
      >
        {slots.map((item, index) => (
          <React.Fragment key={index}>
            <Slot item={item} index={index} />
            {index < slots.length - 1 && <Arrow index={index} />}
          </React.Fragment>
        ))}
      </Box>

      <Text
        variant="captionItalic"
        color="textSecondary"
        style={{ textAlign: "center" }}
      >
        El sorteo asignará una ronda a cada persona
      </Text>
    </Box>
  );
}
