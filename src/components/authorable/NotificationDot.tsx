import { Theme } from '@/theme';
import React from 'react';
import { Box } from './Box';

interface NotificationDotProps {
  size?: 'xs' | 's' | 'm';
  color?: keyof Theme['colors'];
}

export const NotificationDot: React.FC<NotificationDotProps> = ({ 
  size = 's', 
  color = 'error' 
}) => {
  const getDotSize = () => {
    switch (size) {
      case 'xs':
        return 6;
      case 'm':
        return 10;
      default:
        return 8;
    }
  };
  
  const dotSize = getDotSize();
  
  return (
    <Box
      width={dotSize}
      height={dotSize}
      backgroundColor={color}
      position="absolute"
      top={-2}
      right={-2}
      style={{
        borderRadius: dotSize / 2,
      }}
    />
  );
};

export default NotificationDot; 