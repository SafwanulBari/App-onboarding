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
  gray100: '#F5F5F5',
  gray200: '#EFEFEF',
  gray400: '#BEBEBE',
  gray600: '#767676',
  gray700: '#626262',
  gray800: '#434343',
  gray900: '#222222',
  secondaryNeutral950: '#0A0A0A',
  secondary500: '#E2008D',
  primary500: '#5468FF',
  accent100: '#E4EEF5',
  dotInactive: 'rgba(255,255,255,0.2)',
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
};
