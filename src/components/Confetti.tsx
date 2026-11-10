import React, { useEffect, useState } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";

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

export default Confetti;
