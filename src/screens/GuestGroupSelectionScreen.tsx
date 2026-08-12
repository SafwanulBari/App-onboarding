import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
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

type GroupOption = {
  id: string;
  label: string;
  icon: ReturnType<typeof require>;
  iconWidth: number;
  iconHeight: number;
  iconLeft: number;
  iconTop: number;
};

// Same options/copy/icons/row chrome as the main registration flow's own
// group step (RegistrationGroupOptionCard, RegistrationFlowScreen's
// GROUP_OPTIONS) — confirmed pixel-identical against this design node's
// own icon dimensions (66.59x73.874/13,-13, 57.219x73.982/17,-14,
// 71.72x73.962/10,-14, all exact matches), so reused directly rather
// than duplicated, same as the guest batch step.
const GROUP_OPTIONS: GroupOption[] = [
  { id: 'science', label: 'বিজ্ঞান', icon: scienceIcon, iconWidth: 66.59, iconHeight: 73.874, iconLeft: 13, iconTop: -13 },
  { id: 'business', label: 'ব্যবসায় শিক্ষা', icon: businessIcon, iconWidth: 57.219, iconHeight: 73.982, iconLeft: 17, iconTop: -14 },
  { id: 'humanities', label: 'মানবিক', icon: humanitiesIcon, iconWidth: 71.72, iconHeight: 73.962, iconLeft: 10, iconTop: -14 },
];

type Props = {
  onBack?: () => void;
  onSelectGroup?: (groupId: string) => void;
};

// Figma: "6. Registration - Group" — node 54:20171, the guest-mode group
// picker reached after picking a batch on GuestBatchSelectionScreen — the
// last step of the guest funnel (its progress pill is fully filled,
// 336/336, unlike the class/batch steps before it).
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-20171
export default function GuestGroupSelectionScreen({ onBack, onSelectGroup }: Props) {
  const scale = useScale();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

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
        <RegistrationHeader progress={1} onBack={onBack} />

        <View style={{ marginTop: scale(28) }}>
          <RegistrationMascotCard
            title="গ্রুপ সিলেক্ট করো"
            subtitle="তোমার গ্রুপ অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।"
          />
        </View>

        <ScrollView
          style={{ marginTop: scale(72) }}
          contentContainerStyle={{ paddingHorizontal: scale(20), gap: scale(30), paddingBottom: scale(24) }}
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
