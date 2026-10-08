import { Box } from '@/components/authorable/Box';
import { Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';

export default function SuccessAnimation() {
  const [scaleAnim] = useState(() => new Animated.Value(0));
  const [opacityAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <Box justifyContent="center" alignItems="center" backgroundColor="transparent">
      <Animated.View
        style={[
          { alignItems: 'center', justifyContent: 'center' },
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Box
          width={100}
          height={100}
          borderRadius="round"
          backgroundColor="success"
          alignItems="center"
          justifyContent="center"
          shadowColor="gray900"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={8}
          elevation={8}
        >
          <Check size={60} color="white" />
        </Box>
      </Animated.View>
    </Box>
  );
}