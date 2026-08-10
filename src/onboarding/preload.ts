// Every local image `require()`d across the app's screens, listed once so
// App.tsx can preload/cache them all via expo-asset before anything tries to
// render them. Without this, the very first render of each image (e.g.
// slide 1's hero photo on cold start, or every time the carousel loops back
// to a slide since OnboardingCarouselScreen mounts a fresh <Image> per
// transition) has to fetch/decode from scratch, showing blank or a "blink"
// pop-in.
export const APP_IMAGE_MODULES = [
  require('../../assets/onboarding/hero-splash.png'),
  require('../../assets/onboarding/hero-splash-2.png'),
  require('../../assets/onboarding/hero-splash-3.png'),
  require('../../assets/onboarding/badge-icon-3.png'),
  require('../../assets/login/flag-bd.png'),
  require('../../assets/registration/mascot.png'),
  require('../../assets/registration/mascot-thumbsup.png'),
  require('../../assets/registration/group-science.png'),
  require('../../assets/registration/group-business.png'),
  require('../../assets/registration/group-humanities.png'),
  require('../../assets/confirmation/mascot-celebrate.png'),
];
