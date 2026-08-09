import { SWIRL_SVG_XML as SWIRL_1_XML } from '../assets/svg/swirl1';
import { SWIRL_SVG_XML as SWIRL_2_XML } from '../assets/svg/swirl2';
import { SWIRL_SVG_XML as SWIRL_3_XML } from '../assets/svg/swirl3';
import type { OnboardingSlideData } from './types';

// Total pagination dots shown across the onboarding intro (per Figma's
// 3-dot pagination on every splash screen).
export const TOTAL_ONBOARDING_DOTS = 3;

// Design-px distance from the top of the header text block (i.e. right after
// the 32px safe-area padding) down to the top of the pagination dots. This is
// identical across all 3 Figma splash screens (dots always sit at frame-y=667,
// header always starts at frame-y=76) — e.g. slide 1: 88 + 95 + 338 + 70 = 591;
// slide 2: 124 + 109 + 320 + 38 = 591; slide 3: 124 + 101 + 307 + 59 = 591.
// Because it's constant, the header+hero block can be a fixed-height sliding
// viewport while the dots/CTA footer below stay sticky (not part of the slide).
export const SLIDE_CONTENT_HEIGHT = 591;

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
  heroBox: { left: 20, top: 0, width: 372, height: 320 },
  imageCrop: { left: '-12.49%', top: '-73.49%', width: '127.46%', height: '321.99%' },
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
  heroBox: { left: 20, top: 0, width: 372, height: 320 },
  imageCrop: { left: '-5.38%', top: '-49.11%', width: '110.75%', height: '279.78%' },
};

// Figma: "Splash Screen 11" — node 54:18480
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-18480
// Hero section anchor here is the topmost element (the logo badge, y=301
// frame-absolute); everything below is expressed relative to that.
const slide3: OnboardingSlideData = {
  id: 'shikho-ai',
  title: 'সম্পূর্ণ বাংলায় দেশের প্রথম \nআর্টিফিশিয়াল ইন্টেলিজেন্স',
  subtitle: 'জাতীয় পাঠ্যক্রম অনুযায়ী বিষয়ভিত্তিক যেকোনো প্রশ্নের ইনস্ট্যান্ট সমাধান এখন হাতের মুঠোয়',
  subtitleWidth: 293,
  gapBeforeHero: 101,
  heroHeight: 307,
  swirl: { xml: SWIRL_3_XML, top: 110, height: 197 },
  image: require('../../assets/onboarding/hero-splash-3.png'),
  heroBox: { left: 61, top: 4, width: 320, height: 292 },
  imageCrop: { left: '0%', top: '0%', width: '100%', height: '109.59%' },
  logoBadge: {
    left: 150.59,
    top: 0,
    width: 149,
    height: 49,
    rotationDeg: 6.07,
    iconSize: 34,
    icon: require('../../assets/onboarding/badge-icon-3.png'),
    iconCrop: { left: '-135.58%', top: '-106.75%', width: '588.96%', height: '331.29%' },
  },
};

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [slide1, slide2, slide3];
