import { SWIRL_SVG_XML as SWIRL_1_XML } from '../assets/svg/swirl1';
import { SWIRL_SVG_XML as SWIRL_2_XML } from '../assets/svg/swirl2';
import type { OnboardingSlideData } from './types';

// Total pagination dots shown across the onboarding intro (per Figma's
// 3-dot pagination on every splash screen so far).
export const TOTAL_ONBOARDING_DOTS = 3;

// Figma: "Splash Screen 9" — node 54:18407
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-18407
const slide1: OnboardingSlideData = {
  id: 'welcome',
  title: "Shikho'র দুনিয়ায় স্বাগত!",
  subtitle:
    'ইন্টারঅ্যাকটিভ ভিডিও লেসন, লাইভ ক্লাস এবং ব্যক্তিগতকৃত শেখার অভিজ্ঞতার মাধ্যমে প্রতিটি বিষয় আত্মবিশ্বাসের সঙ্গে বুঝে শেখো।',
  gapBeforeHero: 95,
  heroHeight: 338,
  swirl: { xml: SWIRL_1_XML, top: 141, height: 197 },
  image: require('../../assets/onboarding/hero-splash.png'),
  imageCrop: { left: '-12.49%', top: '-73.49%', width: '127.46%', height: '321.99%' },
  gapAfterHero: 70,
  activeDotIndex: 0,
};

// Figma: "Splash Screen 10" — node 54:18443
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-18443
const slide2: OnboardingSlideData = {
  id: 'curriculum',
  title: '৬ষ্ঠ শ্রেণি থেকে SSC-HSC ও \nএডমিশন টেস্টের কমপ্লিট সল্যুশন',
  subtitle:
    'বুয়েট-ঢাবি-মেডিকেল পাস শিক্ষক, লাইভ ক্লাস ও এক্সাম\nঅ্যানিমেটেড ভিডিয়ো, প্র্যাকটিস বুক, গাইডলাইন',
  subtitleWidth: 330,
  gapBeforeHero: 109,
  heroHeight: 320,
  swirl: { xml: SWIRL_2_XML, top: 107, height: 211 },
  image: require('../../assets/onboarding/hero-splash-2.png'),
  imageCrop: { left: '-5.38%', top: '-49.11%', width: '110.75%', height: '279.78%' },
  gapAfterHero: 38,
  activeDotIndex: 1,
};

// Slide 3 (dot index 2) not yet provided by design — append here when it is;
// OnboardingCarouselScreen auto-advances through whatever is in this list.
export const ONBOARDING_SLIDES: OnboardingSlideData[] = [slide1, slide2];
