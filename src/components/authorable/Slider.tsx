import { Theme } from "@/theme";
import { formatCurrency } from "@/utils/common";
import { useTheme } from "@shopify/restyle";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import { Box } from "./Box";
import { Text } from "./Text";

const THUMB_SIZE = 25;
const TRACK_HEIGHT = 9;

interface SliderProps {
  minimumValue: number;
  maximumValue: number;
  value?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  formatLabel?: (value: number) => string;
  showLabels?: boolean;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  minimumValue,
  maximumValue,
  value,
  step = 1,
  onValueChange,
  onSlidingComplete,
  formatLabel = (v) => formatCurrency(v, false),
  showLabels = true,
  disabled = false,
}) => {
  const theme = useTheme<Theme>();
  const [containerWidth, setContainerWidth] = useState(0);
  const trackWidth = Math.max(0, containerWidth - THUMB_SIZE);
  const [internalValue, setInternalValue] = useState(value ?? minimumValue);

  const currentValue = value ?? internalValue;

  const clamp = (v: number) =>
    Math.min(maximumValue, Math.max(minimumValue, v));

  const snapToStep = (v: number) => {
    const stepped = Math.round((v - minimumValue) / step) * step + minimumValue;
    return clamp(stepped);
  };

  const valueToX = (v: number, width: number) => {
    const ratio = (v - minimumValue) / (maximumValue - minimumValue || 1);
    return ratio * width;
  };

  const xToValue = (x: number, width: number) => {
    const ratio = width === 0 ? 0 : x / width;
    return snapToStep(minimumValue + ratio * (maximumValue - minimumValue));
  };

  const dragStartX = useRef(0);

  // Latest props/derived values for the gesture handlers, so the PanResponder
  // can be created once without capturing stale closures.
  const latest = useRef({
    currentValue,
    trackWidth,
    disabled,
    valueToX,
    xToValue,
    onValueChange,
    onSlidingComplete,
  });
  useLayoutEffect(() => {
    latest.current = {
      currentValue,
      trackWidth,
      disabled,
      valueToX,
      xToValue,
      onValueChange,
      onSlidingComplete,
    };
  });

  // The handlers below only run in response to gestures, never during render.
  // eslint-disable-next-line react-hooks/refs
  const [panResponder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled,
      onMoveShouldSetPanResponder: () => !latest.current.disabled,
      onPanResponderGrant: () => {
        const { currentValue, trackWidth, valueToX } = latest.current;
        dragStartX.current = valueToX(currentValue, trackWidth);
      },
      onPanResponderMove: (_, gestureState) => {
        const { trackWidth: width, xToValue, onValueChange } = latest.current;
        const nextX = dragStartX.current + gestureState.dx;
        const clampedX = Math.min(width, Math.max(0, nextX));
        const nextValue = xToValue(clampedX, width);
        setInternalValue(nextValue);
        onValueChange?.(nextValue);
      },
      onPanResponderRelease: () => {
        latest.current.onSlidingComplete?.(latest.current.currentValue);
      },
    }),
  );

  const thumbX = trackWidth > 0 ? valueToX(currentValue, trackWidth) : 0;

  return (
    <Box>
      <View
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        style={{
          height: THUMB_SIZE + 12,
          justifyContent: "center",
        }}
      >
        <Box
          height={TRACK_HEIGHT}
          borderRadius="round"
          backgroundColor="gray300"
          borderWidth={1}
          borderColor="border"
          overflow="hidden"
        >
          <Box
            height={TRACK_HEIGHT}
            borderRadius="round"
            style={{
              width: thumbX + THUMB_SIZE / 2,
              backgroundColor: theme.colors.primary,
            }}
          />
        </Box>

        <Animated.View
          {...panResponder.panHandlers}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={{
            position: "absolute",
            left: thumbX,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: theme.colors.white,
            borderWidth: 4,
            borderColor: theme.colors.primary,
            shadowColor: theme.colors.gray800,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </View>

      {showLabels && (
        <Box flexDirection="row" justifyContent="space-between" marginTop="xs">
          <Text variant="caption" color="gray800">
            {formatLabel(minimumValue)}
          </Text>
          <Text variant="caption" color="gray800">
            {formatLabel(maximumValue)}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Slider;
