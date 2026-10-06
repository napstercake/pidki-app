import { Theme } from '@/theme';
import React from 'react';
import { Box } from './Box';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof Theme['spacing'] | number;
  margin?: keyof Theme['spacing'];
  marginTop?: keyof Theme['spacing'];
  marginBottom?: keyof Theme['spacing'];
  marginLeft?: keyof Theme['spacing'];
  marginRight?: keyof Theme['spacing'];
  backgroundColor?: keyof Theme['colors'];
  shadow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'm',
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  backgroundColor = 'white',
  shadow = true,
}) => {
  return (
    <Box
      backgroundColor={backgroundColor}
      borderRadius="m"
      padding={typeof padding === 'number' ? undefined : padding}
      style={typeof padding === 'number' ? { padding } : undefined}
      margin={margin}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      shadowColor="gray800"
      shadowOffset={{ width: 0, height: shadow ? 2 : 0 }}
      shadowOpacity={shadow ? 0.1 : 0}
      shadowRadius={shadow ? 8 : 0}
      elevation={shadow ? 3 : 0}
      borderWidth={shadow ? 0 : 1}
      borderColor="border"
    >
      {children}
    </Box>
  );
};

export default Card; 