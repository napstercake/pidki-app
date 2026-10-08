import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const CYCLE = 2400;

const Sleepy = () => {
  const theme = useTheme<Theme>();

  const z1o = useSharedValue(0); const z1y = useSharedValue(0);
  const z2o = useSharedValue(0); const z2y = useSharedValue(0);
  const z3o = useSharedValue(0); const z3y = useSharedValue(0);

  const z1Style = useAnimatedStyle(() => ({ opacity: z1o.value, transform: [{ translateY: z1y.value }] }));
  const z2Style = useAnimatedStyle(() => ({ opacity: z2o.value, transform: [{ translateY: z2y.value }] }));
  const z3Style = useAnimatedStyle(() => ({ opacity: z3o.value, transform: [{ translateY: z3y.value }] }));

  useEffect(() => {
    const animateZ = (o: typeof z1o, y: typeof z1y, delay: number) => {
      const rest = CYCLE - 1100;
      o.value = withDelay(delay, withRepeat(withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
        withDelay(500, withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })),
        withDelay(rest, withTiming(0, { duration: 0 })),
      ), -1, false));
      y.value = withDelay(delay, withRepeat(withSequence(
        withTiming(-24, { duration: 800, easing: Easing.out(Easing.ease) }),
        withDelay(300, withTiming(0, { duration: 0 })),
        withDelay(rest, withTiming(0, { duration: 0 })),
      ), -1, false));
    };
    animateZ(z1o, z1y, 0);
    animateZ(z2o, z2y, 600);
    animateZ(z3o, z3y, 1200);
  }, [z1o, z1y, z2o, z2y, z3o, z3y]);

  return (
    <View style={{ width: 160, height: 140 }}>
      <Animated.Text style={[{ position: "absolute", top: 0, left: 48, fontSize: 16, fontWeight: "700", color: theme.colors.gray600 }, z1Style]}>z</Animated.Text>
      <Animated.Text style={[{ position: "absolute", top: -8, left: 68, fontSize: 20, fontWeight: "700", color: theme.colors.gray600 }, z2Style]}>z</Animated.Text>
      <Animated.Text style={[{ position: "absolute", top: -18, left: 90, fontSize: 26, fontWeight: "700", color: theme.colors.gray600 }, z3Style]}>z</Animated.Text>
      <Image
        source={require("../../../../assets/images/pig.png")}
        style={{ position: "absolute", bottom: 0, left: 0, width: 160, height: 110 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Sleepy;
