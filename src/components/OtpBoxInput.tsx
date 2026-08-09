import React, { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors, fonts, useScale } from '../theme/theme';
import { toBengaliDigits, toWesternDigits } from '../utils/bengaliDigits';

type Props = {
  length: number;
  value: string;
  onChangeValue: (value: string) => void;
};

// A 4-box OTP entry (Figma node 54:18611). Implemented as one invisible
// TextInput capturing all keystrokes, overlaid on top of `length` visual
// boxes that render individual digits from `value` — the standard,
// reliable pattern for a multi-box code input in RN (avoids juggling
// separate refs/auto-advance logic across real per-box TextInputs).
export default function OtpBoxInput({ length, value, onChangeValue }: Props) {
  const scale = useScale();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleChangeText = (text: string) => {
    onChangeValue(toWesternDigits(text).replace(/\D/g, '').slice(0, length));
  };

  const activeIndex = value.length < length ? value.length : -1;

  return (
    <View
      style={{ width: scale(48 * length + 20 * (length - 1)), height: scale(54) }}
      onTouchEnd={() => inputRef.current?.focus()}
    >
      <View style={{ flexDirection: 'row', gap: scale(20) }}>
        {Array.from({ length }).map((_, i) => {
          const digit = value[i];
          const isActive = isFocused && i === activeIndex;
          return (
            <View
              key={i}
              style={{
                width: scale(48),
                height: scale(54),
                borderRadius: scale(12),
                backgroundColor: isActive ? colors.accent100 : colors.gray200,
                borderWidth: isActive ? 1 : 0,
                borderColor: colors.primary500,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {digit && (
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: scale(20),
                    color: colors.secondaryNeutral950,
                  }}
                >
                  {toBengaliDigits(digit)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
      />
    </View>
  );
}
