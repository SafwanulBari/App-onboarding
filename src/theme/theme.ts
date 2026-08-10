import { useWindowDimensions } from 'react-native';

// Figma reference frame: "Splash Screen 9" (node 54:18407) is 412 design-px wide.
// useScale() maps a design-px value to the current device's dp so spacing/sizing
// stays proportionally faithful to the Figma mock across screen widths. It reads
// width from useWindowDimensions (not Dimensions.get, which is captured once and
// goes stale on resize/rotation/web) so it stays correct as the window changes.
const FIGMA_FRAME_WIDTH = 412;

export function useScale() {
  const { width } = useWindowDimensions();
  return (size: number) => Math.round((size * width) / FIGMA_FRAME_WIDTH);
}

export const colors = {
  gradientStart: '#4a28be',
  gradientEnd: '#030003',
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EFEFEF',
  gray300: '#E1E1E1',
  gray400: '#BEBEBE',
  gray500: '#9F9F9F',
  gray600: '#767676',
  gray700: '#626262',
  gray800: '#434343',
  gray900: '#222222',
  secondaryNeutral600: '#525252',
  secondaryNeutral700: '#404040',
  secondaryNeutral950: '#0A0A0A',
  secondary500: '#E2008D',
  primary500: '#5468FF',
  accent100: '#E4EEF5',
  dotInactive: 'rgba(255,255,255,0.2)',
  success600: '#16A34A',
  error500: '#EF4444',
  // "2. Registration - Name" screen background gradient (light blue -> white)
  registrationGradientStart: '#E8F1FC',
  registrationGradientEnd: '#FFFFFF',
  // Post-registration "Confirmation Page" (node 54:1541) background
  // gradient (saturated blue -> white).
  confirmationGradientStart: '#388BE9',
  // The class-numeral glyphs on "4. Registration - Class" (node 54:2297) are
  // a radial gradient (primary500 -> a dark navy) in the design. Reproducing
  // gradient text in RN needs a native masked-view, which this project
  // deliberately avoids (see RegistrationClassOptionCard) — this flat color
  // is the gradient's visual midtone (its 50% stop) as the closest safe
  // single-color approximation, rather than the lighter flat primary500.
  classNumeralBlue: '#3341B9',
};

// Baloo Da 2 supports Bengali glyphs and is the family used throughout the design.
export const fonts = {
  regular: 'BalooDa2_400Regular',
  medium: 'BalooDa2_500Medium',
  semiBold: 'BalooDa2_600SemiBold',
  bold: 'BalooDa2_700Bold',
  // Space Grotesk is used only for the "SHIKHO AI" wordmark lockup (slide 3).
  spaceGroteskLight: 'SpaceGrotesk_300Light',
  spaceGroteskBold: 'SpaceGrotesk_700Bold',
  // Noto Sans Bengali is used only for the large class-numeral glyphs on the
  // "4. Registration - Class" screen (Figma node 54:2297) — the design
  // specs that one element in a different family from the rest of the UI.
  notoSansBengaliSemiBold: 'NotoSansBengali_600SemiBold',
};
