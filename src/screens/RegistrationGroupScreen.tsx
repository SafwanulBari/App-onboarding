import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegistrationGroupOptionCard from '../components/RegistrationGroupOptionCard';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, useScale } from '../theme/theme';

const scienceIcon = require('../../assets/registration/group-science.png');
const businessIcon = require('../../assets/registration/group-business.png');
const humanitiesIcon = require('../../assets/registration/group-humanities.png');

// Progress fill = 269/336, the exact ratio Figma shows on node 54:2502.
const PROGRESS = 269 / 336;

type GroupOption = {
  id: string;
  label: string;
  icon: ReturnType<typeof require>;
  // Exact per-icon geometry from Figma (each illustration is a different
  // size and floats above the card's top edge by a slightly different
  // amount) — see RegistrationGroupOptionCard.
  iconWidth: number;
  iconHeight: number;
  iconLeft: number;
  iconTop: number;
};

const GROUP_OPTIONS: GroupOption[] = [
  { id: 'science', label: 'বিজ্ঞান', icon: scienceIcon, iconWidth: 66.59, iconHeight: 73.874, iconLeft: 13, iconTop: -13 },
  { id: 'business', label: 'ব্যবসায় শিক্ষা', icon: businessIcon, iconWidth: 57.219, iconHeight: 73.982, iconLeft: 17, iconTop: -14 },
  { id: 'humanities', label: 'মানবিক', icon: humanitiesIcon, iconWidth: 71.72, iconHeight: 73.962, iconLeft: 10, iconTop: -14 },
];

type Props = {
  onBack?: () => void;
  onSelectGroup?: (groupId: string) => void;
};

// Figma: "6. Registration - Group" — node 54:2502
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-2502
export default function RegistrationGroupScreen({ onBack, onSelectGroup }: Props) {
  const scale = useScale();
  // The design shows the first option already selected (darker label),
  // same convention as the Batch screen.
  const [selectedGroup, setSelectedGroup] = useState(GROUP_OPTIONS[0].id);

  const handleSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    onSelectGroup?.(groupId);
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
            title="গ্রুপ সিলেক্ট করো"
            subtitle="তোমার গ্রুপ অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।"
          />
        </View>

        {/* This screen's icons float above each card's top edge, so rows
            need more breathing room (30px) than the plain numeral/label
            rows on the Class/Batch screens (20px) to avoid the next
            card's icon overlapping the previous row. */}
        <View style={{ marginTop: scale(72), paddingHorizontal: scale(20), gap: scale(30) }}>
          {GROUP_OPTIONS.map((option) => (
            <RegistrationGroupOptionCard
              key={option.id}
              icon={option.icon}
              iconWidth={option.iconWidth}
              iconHeight={option.iconHeight}
              iconLeft={option.iconLeft}
              iconTop={option.iconTop}
              label={option.label}
              selected={option.id === selectedGroup}
              onPress={() => handleSelect(option.id)}
            />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
