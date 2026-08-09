import type { ImageCrop } from './types';

export type ResolvedCrop = {
  left: number;
  top: number;
  width: number;
  height: number;
};

// Converts a percentage-based ImageCrop (Figma's image-fill transform,
// e.g. left: "-12.49%") into concrete numeric pixel values against a given
// box size. We resolve to plain numbers rather than passing percentage
// *strings* straight into style — RN's Yoga layout engine (native) and
// react-native-web's CSS output don't necessarily agree on percentage
// position resolution, and this was never actually verified on-device
// (only in a browser, which trivially supports CSS percentages). Numbers
// are unambiguous on every platform.
export function resolveCrop(crop: ImageCrop, boxWidth: number, boxHeight: number): ResolvedCrop {
  const pct = (value: `${number}%`) => parseFloat(value) / 100;
  return {
    left: pct(crop.left) * boxWidth,
    top: pct(crop.top) * boxHeight,
    width: pct(crop.width) * boxWidth,
    height: pct(crop.height) * boxHeight,
  };
}
