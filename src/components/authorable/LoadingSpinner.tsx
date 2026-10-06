import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text,
  fullScreen = false,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 450,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [bounceAnim]);

  const content = (
    <Box alignItems="center" justifyContent="center">
      <Animated.Image
        source={require("../../../assets/images/logo-loading.png")}
        style={{
          width: 96,
          height: 96,
          transform: [
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -14],
              }),
            },
            {
              scaleX: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.94],
              }),
            },
            {
              scaleY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.06],
              }),
            },
          ],
        }}
        resizeMode="contain"
      />
      {text && (
        <Box marginTop="m">
          <Text variant="body" color="white" textAlign="center">
            {text}
          </Text>
        </Box>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        flex={1}
        backgroundColor="primary"
        alignItems="center"
        justifyContent="center"
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;
