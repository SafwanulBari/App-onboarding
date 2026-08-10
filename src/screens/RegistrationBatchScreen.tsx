import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegistrationBatchOptionCard from '../components/RegistrationBatchOptionCard';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, useScale } from '../theme/theme';

// Progress fill = 223/336, the exact ratio Figma shows on node 54:2452.
const PROGRESS = 223 / 336;

const BATCH_OPTIONS = ['২০২৪', '২০২৫', '২০২৬'];

type Props = {
  onBack?: () => void;
  onSelectBatch?: (batch: string) => void;
};

// Figma: "5. Registration - Batch" — node 54:2452
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-2452
export default function RegistrationBatchScreen({ onBack, onSelectBatch }: Props) {
  const scale = useScale();
  // The design shows the current/first year already selected (darker
  // label) rather than nothing selected — reproduced by defaulting to it.
  const [selectedBatch, setSelectedBatch] = useState(BATCH_OPTIONS[0]);

  const handleSelect = (batch: string) => {
    setSelectedBatch(batch);
    onSelectBatch?.(batch);
  };

  return (
    <LinearGradient
      colors={[colors.registrationGradientStart, colors.registrationGradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <RegistrationHeader progress={PROGRESS} onBack={onBack} />

        <View style={{ marginTop: scale(28) }}>
          <RegistrationMascotCard
            bubbleSize="tall"
            title="তোমার এইচএসসি পরীক্ষার ব্যাচ সিলেক্ট করো"
            subtitle="তোমার ব্যাচের জন্য প্রাসঙ্গিক পড়াশোনা ও পরীক্ষার প্রস্তুতি সাজিয়ে দেখানো হবে।"
          />
        </View>

        <View style={{ marginTop: scale(72), paddingHorizontal: scale(20), gap: scale(20) }}>
          {BATCH_OPTIONS.map((batch) => (
            <RegistrationBatchOptionCard
              key={batch}
              label={batch}
              selected={batch === selectedBatch}
              onPress={() => handleSelect(batch)}
            />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
