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
  require('../../assets/home/gift-box-confetti.png'),
  require('../../assets/home/course-thumbnail.jpg'),
  require('../../assets/home/quiz-king.png'),
  require('../../assets/home/icon-live-class.png'),
  require('../../assets/home/icon-animated-video.png'),
  require('../../assets/home/icon-live-mcq.png'),
  require('../../assets/home/icon-notes.png'),
  require('../../assets/profile/chip-notification.png'),
  require('../../assets/profile/chip-profile-edit.png'),
  require('../../assets/profile/chip-syllabus.png'),
  require('../../assets/profile/chip-saved.png'),
  require('../../assets/profile/chip-download.png'),
  require('../../assets/profile/chip-subscriptions.png'),
  require('../../assets/profile/chip-settings.png'),
  require('../../assets/profile/edit-hero-waves.png'),
  require('../../assets/profile/edit-avatars/avatar-01.png'),
  require('../../assets/profile/edit-avatars/avatar-02.png'),
  require('../../assets/profile/edit-avatars/avatar-03.png'),
  require('../../assets/profile/edit-avatars/avatar-04.png'),
  require('../../assets/profile/edit-avatars/avatar-05.png'),
  require('../../assets/profile/edit-avatars/avatar-06.png'),
  require('../../assets/profile/edit-avatars/avatar-07.png'),
  require('../../assets/profile/edit-avatars/avatar-08.png'),
  require('../../assets/profile/edit-avatars/avatar-09.png'),
  require('../../assets/profile/edit-avatars/avatar-10.png'),
  require('../../assets/profile/edit-avatars/avatar-11.png'),
  require('../../assets/profile/edit-avatars/avatar-12.png'),
];
