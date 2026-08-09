import type { ImageSourcePropType } from 'react-native';

type Percent = `${number}%`;

export type ImageCrop = {
  left: Percent;
  top: Percent;
  width: Percent;
  height: Percent;
};

export type LogoBadgeData = {
  /** Design-px position/size within the hero section, frame-relative (matches swirl's convention). */
  left: number;
  /** Design-px top offset within the hero section. */
  top: number;
  width: number;
  height: number;
  rotationDeg: number;
  iconSize: number;
  icon: ImageSourcePropType;
  iconCrop: ImageCrop;
};

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
  /** Design-px total height of the hero section (image + swirl + badge, whichever extends furthest). */
  heroHeight: number;
  swirl: {
    xml: string;
    /** Design-px top offset of the swirl within the hero section. */
    top: number;
    height: number;
  };
  image: ImageSourcePropType;
  /** Design-px position/size of the hero image box, frame-relative. */
  heroBox: {
    left: number;
    /** Design-px top offset within the hero section. */
    top: number;
    width: number;
    height: number;
  };
  /** Percentage-based crop matching Figma's image-fill transform exactly. */
  imageCrop: ImageCrop;
  /** Optional rotated "SHIKHO AI" wordmark lockup floating over the hero (slide 3). */
  logoBadge?: LogoBadgeData;
  /** Design-px gap between the hero section and the pagination dots. */
  gapAfterHero: number;
  activeDotIndex: number;
};
