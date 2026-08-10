import React from 'react';
import { Pressable, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ARROW_LEFT_SVG_XML } from '../assets/svg/arrowLeft';
import RegistrationProgressBar from './RegistrationProgressBar';
import { useScale } from '../theme/theme';

type Props = {
  progress: number;
  onBack?: () => void;
};

// Top row of every registration step: an optional back button (absent on
// the first step, e.g. "2. Registration - Name" 54:3221; present from
// "4. Registration - Class" 54:2297 onward) plus the progress pill, which
// takes up the full row width when there's no back button and shares it
// otherwise.
export default function RegistrationHeader({ progress, onBack }: Props) {
  const scale = useScale();

  return (
    <View
      style={{
        paddingHorizontal: scale(20),
        paddingTop: scale(8),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
      }}
    >
      {onBack && (
        <Pressable onPress={onBack} hitSlop={12} style={{ width: scale(24), height: scale(24) }}>
          <SvgXml xml={ARROW_LEFT_SVG_XML} width={scale(24)} height={scale(24)} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <RegistrationProgressBar progress={progress} />
      </View>
    </View>
  );
}
