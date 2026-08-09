// Every local image `require()`d by the onboarding slides, listed once so
// App.tsx can preload/cache them all via expo-asset before the carousel ever
// tries to render them. Without this, the very first render of each image
// (especially slide 1's hero photo on cold start, and again on every loop
// pass since OnboardingCarouselScreen mounts a fresh <Image> per transition)
// has to fetch/decode from scratch, showing blank or a "blink" pop-in.
export const ONBOARDING_IMAGE_MODULES = [
  require('../../assets/onboarding/hero-splash.png'),
  require('../../assets/onboarding/hero-splash-2.png'),
  require('../../assets/onboarding/hero-splash-3.png'),
  require('../../assets/onboarding/badge-icon-3.png'),
];
