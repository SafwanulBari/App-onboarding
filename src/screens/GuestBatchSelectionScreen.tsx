import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegistrationBatchOptionCard from '../components/RegistrationBatchOptionCard';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, useScale } from '../theme/theme';

// Same options/copy/row chrome as the main registration flow's own batch
// step (RegistrationBatchOptionCard, RegistrationFlowScreen's
// BATCH_OPTIONS) — this design node has no visual differences from that
// row style (unlike the guest class step, which does), so it's reused
// directly rather than duplicated.
const BATCH_OPTIONS = ['২০২৪', '২০২৫', '২০২৬'];

type Props = {
  onBack?: () => void;
  onSelectBatch?: (batch: string) => void;
};

// Figma: "5. Registration - Batch" — node 54:20121, the guest-mode batch
// picker reached after picking a class on GuestClassSelectionScreen.
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-20121
export default function GuestBatchSelectionScreen({ onBack, onSelectBatch }: Props) {
  const scale = useScale();
  // The design shows ২০২৪ (the current year) pre-selected (darker text)
  // — same default as the main flow's own batch step.
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
        {/* progress: 248/336 measured off this frame's own pill fill —
            further along than the guest class step's 108/336, matching
            this being the next step in the same shorter guest funnel. */}
        <RegistrationHeader progress={248 / 336} onBack={onBack} />

        <View style={{ marginTop: scale(28) }}>
          <RegistrationMascotCard
            title="তোমার এইচএসসি পরীক্ষার ব্যাচ সিলেক্ট করো"
            subtitle="তোমার ব্যাচের জন্য প্রাসঙ্গিক পড়াশোনা ও পরীক্ষার প্রস্তুতি সাজিয়ে দেখানো হবে।"
            bubbleSize="tall"
          />
        </View>

        <ScrollView
          style={{ marginTop: scale(72) }}
          contentContainerStyle={{ paddingHorizontal: scale(20), gap: scale(20), paddingBottom: scale(24) }}
          showsVerticalScrollIndicator={false}
        >
          {BATCH_OPTIONS.map((batch) => (
            <RegistrationBatchOptionCard
              key={batch}
              label={batch}
              selected={batch === selectedBatch}
              onPress={() => handleSelect(batch)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
