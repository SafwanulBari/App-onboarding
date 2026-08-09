import React from 'react';
import { View } from 'react-native';
import { colors, useScale } from '../theme/theme';

type Props = {
  count: number;
  activeIndex: number;
};

// Figma node 54:18438 "Frame 1707482004": active pill 18x8, inactive dots 8x8, gap 4.
export default function PaginationDots({ count, activeIndex }: Props) {
  const scale = useScale();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: scale(4) }}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <View
            key={i}
            style={{
              height: scale(8),
              width: isActive ? scale(18) : scale(8),
              borderRadius: isActive ? scale(50) : scale(10),
              backgroundColor: isActive ? colors.secondary500 : colors.dotInactive,
            }}
          />
        );
      })}
    </View>
  );
}
