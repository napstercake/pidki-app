import { Star } from 'lucide-react-native';
import React from 'react';
import { Box } from './Box';

interface RateProps {
  score: number; // e.g., 2.3, 4.8
  size?: number;
  color?: string;
  unfilledColor?: string;
}

const MAX_STARS = 5;

const Rate: React.FC<RateProps> = ({ score, size = 20, color = '#FFD700', unfilledColor = '#E0E0E0' }) => {
  // Clamp score between 0 and MAX_STARS
  const clampedScore = Math.max(0, Math.min(score, MAX_STARS));
  const stars = [];
  for (let i = 0; i < MAX_STARS; i++) {
    let fill = unfilledColor;
    if (clampedScore >= i + 1) {
      fill = color;
    } else if (clampedScore > i) {
      // Partial star: use color with opacity for the fraction
      fill = color + '80'; // Add alpha for partial (simple approach)
    }
    stars.push(
      <Star
        key={i}
        size={size}
        color={fill}
        fill={fill}
        style={{ marginRight: i < MAX_STARS - 1 ? 2 : 0 }}
      />
    );
  }
  return <Box flexDirection="row" alignItems="center">{stars}</Box>;
};

export default Rate; 