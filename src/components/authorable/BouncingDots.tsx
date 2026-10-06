import { Theme } from "@/theme";
import { useTheme } from "@shopify/restyle";
import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Box } from "./Box";

interface BouncingDotsProps {
  color: keyof Theme["colors"];
  height?: number;
}

export const BouncingDots: React.FC<BouncingDotsProps> = ({
  color,
  height = 6,
}) => {
  const theme = useTheme<Theme>();
  const dotAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const animations = dotAnims.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.delay((dotAnims.length - 1 - index) * 150),
        ]),
      ),
    );
    Animated.parallel(animations).start();
    return () => animations.forEach((anim) => anim.stop());
  }, [dotAnims]);

  return (
    <Box flexDirection="row" alignItems="center" height={height}>
      {dotAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            marginHorizontal: 3,
            backgroundColor: theme.colors[color],
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4],
                }),
              },
            ],
          }}
        />
      ))}
    </Box>
  );
};

export default BouncingDots;
