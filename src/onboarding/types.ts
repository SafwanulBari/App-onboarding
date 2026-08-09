import type { ImageSourcePropType } from 'react-native';

type Percent = `${number}%`;

export type OnboardingSlideData = {
  id: string;
  /** Headline text. Use "\n" only where Figma authored an explicit line break. */
  title: string;
  /** Body text. Use "\n" only where Figma authored an explicit line break. */
  subtitle: string;
  /** Design-px max width for the subtitle block; omit to span the full content width. */
  subtitleWidth?: number;
  /** Design-px gap between the header block and the hero section below it. */
  gapBeforeHero: number;
  /** Design-px total height of the hero section (image + swirl, whichever extends lower). */
  heroHeight: number;
  swirl: {
    xml: string;
    /** Design-px top offset of the swirl within the hero section. */
    top: number;
    height: number;
  };
  image: ImageSourcePropType;
  /** Percentage-based crop matching Figma's image-fill transform exactly. */
  imageCrop: {
    left: Percent;
    top: Percent;
    width: Percent;
    height: Percent;
  };
  /** Design-px gap between the hero section and the pagination dots. */
  gapAfterHero: number;
  activeDotIndex: number;
};
