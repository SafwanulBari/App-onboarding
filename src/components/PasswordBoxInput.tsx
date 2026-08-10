import React, { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { colors, useScale } from '../theme/theme';
import { toWesternDigits } from '../utils/bengaliDigits';

type Props = {
  length: number;
  value: string;
  onChangeValue: (value: string) => void;
  disabled?: boolean;
};

// A 6-box numeric password entry on "7. Registration - Set Pasword"
// (Figma node 54:1870, boxes 54:1908 for the password field and 54:1924
// for confirm-password). Same invisible-TextInput-over-visual-boxes
// pattern as OtpBoxInput, but: a tighter box gap (16.8 vs 20, per this
// screen's own metadata), a white/gray300-border empty state instead of
// OTP's gray200 default, entered digits render as a masked dot rather
// than the plain numeral (this is a password, not a one-time code shown
// in an SMS), and an optional `disabled` prop — the design shows the
// confirm-password field in a visibly inactive gray50 state until the
// first password is complete; RegistrationPasswordScreen drives that.
export default function PasswordBoxInput({ length, value, onChangeValue, disabled }: Props) {
  const scale = useScale();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleChangeText = (text: string) => {
    onChangeValue(toWesternDigits(text).replace(/\D/g, '').slice(0, length));
  };

  const activeIndex = isFocused ? Math.max(0, value.length - 1) : -1;
  const gap = 16.8;

  return (
    <View
      style={{ width: scale(48 * length + gap * (length - 1)), height: scale(54) }}
      onTouchEnd={() => {
        if (!disabled) inputRef.current?.focus();
      }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <View style={{ flexDirection: 'row', gap: scale(gap) }}>
        {Array.from({ length }).map((_, i) => {
          const isFilled = !!value[i];
          const isActive = i === activeIndex;

          let backgroundColor: string = disabled ? colors.gray50 : colors.white;
          if (isActive) backgroundColor = colors.accent100;

          return (
            <View
              key={i}
              style={{
                width: scale(48),
                height: scale(54),
                borderRadius: scale(12),
                backgroundColor,
                borderWidth: isActive ? scale(2) : scale(1),
                borderColor: isActive ? colors.primary500 : colors.gray300,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isFilled && (
                <View
                  style={{
                    width: scale(10),
                    height: scale(10),
                    borderRadius: scale(5),
                    backgroundColor: colors.gray900,
                  }}
                />
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
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
      />
    </View>
  );
}
