import theme from "@/theme";
import React from "react";
import Svg, { Path } from "react-native-svg";

interface PizzaStepperProps {
  currentStep: number;
  totalSteps: number;
  size?: number;
  onGradient?: boolean;
}

const GAP_DEGREES = 6;

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
};

const describeSlice = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

const PizzaStepper: React.FC<PizzaStepperProps> = ({
  currentStep,
  totalSteps,
  size = 30,
  onGradient = false,
}) => {
  const activeColor = onGradient ? theme.colors.white : theme.colors.primary;
  const inactiveColor = onGradient
    ? "rgba(255,255,255,0.35)"
    : theme.colors.gray200;

  const center = size / 2;
  const radius = size / 2;
  const anglePerSlice = 360 / totalSteps;
  const gap = totalSteps > 1 ? GAP_DEGREES : 0;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const sliceStart = i * anglePerSlice + gap / 2;
        const sliceEnd = (i + 1) * anglePerSlice - gap / 2;
        return (
          <Path
            key={i}
            d={describeSlice(center, center, radius, sliceStart, sliceEnd)}
            fill={i < currentStep ? activeColor : inactiveColor}
          />
        );
      })}
    </Svg>
  );
};

export default PizzaStepper;
