'use client';

import React, { useEffect, useState } from 'react';

interface FrameAnimationProps {
  /**
   * Array of image URLs to cycle through.
   */
  images: string[];
  /**
   * Base frames per second. Defaults to 12.
   */
  fps?: number;
  /**
   * Optional additional class names for the <img> element.
   */
  className?: string;
  /**
   * Image alt text.
   */
  alt?: string;
  /**
   * Optional array of range speed multipliers. Each object specifies a zero-based start and end index (inclusive)
   * and a multiplier for the base fps. Example: { startIndex: 5, endIndex: 10, multiplier: 3 } will play frames 5-10
   * three times faster.
   */
  rangeSpeedMultipliers?: Array<{ startIndex: number; endIndex: number; multiplier: number }>;
}

/**
 * Displays a simple frame-by-frame animation by swapping the <img> `src` every N milliseconds.
 *
 * Note: All `images` must live in the public/ folder (e.g. /animation2/...).
 */
export const FrameAnimation: React.FC<FrameAnimationProps> = ({
  images,
  fps = 12,
  className = '',
  alt = 'animation',
  rangeSpeedMultipliers = [],
}) => {
  const [index, setIndex] = useState(0);

  // Helper to get effective fps for the current frame index
  const getEffectiveFps = (frameIdx: number): number => {
    const range = rangeSpeedMultipliers.find(
      (r) => frameIdx >= r.startIndex && frameIdx <= r.endIndex,
    );
    return range ? fps * range.multiplier : fps;
  };

  useEffect(() => {
    if (!images.length) return;

    const intervalMs = 1000 / getEffectiveFps(index);

    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length, fps, JSON.stringify(rangeSpeedMultipliers)]);

  if (!images.length) return null;

  return (
    <img
      src={images[index]}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}; 