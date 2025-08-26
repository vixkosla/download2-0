'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SpeedRange {
  startIndex: number; // inclusive, zero-based
  endIndex: number;   // inclusive, zero-based
  multiplier: number; // >1 = faster, <1 = slower
}

interface LoopSegment {
  startIndex: number; // inclusive, zero-based
  endIndex: number;   // inclusive, zero-based
  // How many TOTAL times to play this segment consecutively.
  // Example: times = 3 means: play segment once in normal flow + 2 extra repeats appended right after.
  times: number;
}

interface SmoothFrameAnimationProps {
  images: string[]; // Full paths starting with /
  baseFps?: number; // default 60
  className?: string;
  width?: number | string;  // CSS width (e.g. 40, '2em')
  height?: number | string; // CSS height
  speedRanges?: SpeedRange[];
  // Optional: repeat specific subranges several times in-place during a single pass
  loopSegments?: LoopSegment[];
}

/**
 * Optimised frame-by-frame animation: preloads all images and switches background-image
 * via requestAnimationFrame for ultra-smooth playback (similar to Hero section).
 */
export const SmoothFrameAnimation: React.FC<SmoothFrameAnimationProps> = ({
  images,
  baseFps = 60,
  className = '',
  width = '1em',
  height = '1em',
  speedRanges = [],
  loopSegments = [],
}) => {
  const TOTAL_FRAMES = images.length;

  // Build sequence considering speed multipliers by duplicating frames (slower) or
  // skipping duplicates (faster). We keep an overall 60fps animation loop; duration per
  // frame is constant, but frames might be shown multiple times through sequence reps.
  const sequenceRef = useRef<number[]>([]);

  useEffect(() => {
    const seq: number[] = [];
    const baseRepeat = 4; // how many times we repeat a normal-speed frame (baseFPS / 4)

    // Normalize loop segments: valid ranges only and times >= 2
    const validSegments = (loopSegments || [])
      .filter(seg => seg && seg.times && seg.times >= 2)
      .map(seg => ({
        startIndex: Math.max(0, Math.min(TOTAL_FRAMES - 1, seg.startIndex)),
        endIndex: Math.max(0, Math.min(TOTAL_FRAMES - 1, seg.endIndex)),
        times: seg.times,
      }))
      .filter(seg => seg.endIndex >= seg.startIndex);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const range = speedRanges.find(
        (r) => i >= r.startIndex && i <= r.endIndex,
      );
      const multiplier = range ? range.multiplier : 1;
      // Faster → fewer repeats; Slower → more repeats
      const repeat = Math.max(1, Math.round(baseRepeat / multiplier));
      for (let k = 0; k < repeat; k++) seq.push(i);

      // If current frame is the end of any loop segment, append that segment (times - 1) more times
      const endingSegments = validSegments.filter(seg => seg.endIndex === i);
      if (endingSegments.length > 0) {
        for (const seg of endingSegments) {
          const extraRepeats = seg.times - 1; // we have already played it once in the normal flow
          for (let rep = 0; rep < extraRepeats; rep++) {
            for (let j = seg.startIndex; j <= seg.endIndex; j++) {
              const r2 = speedRanges.find(
                (r) => j >= r.startIndex && j <= r.endIndex,
              );
              const m2 = r2 ? r2.multiplier : 1;
              const repeat2 = Math.max(1, Math.round(baseRepeat / m2));
              for (let k2 = 0; k2 < repeat2; k2++) seq.push(j);
            }
          }
        }
      }
    }
    sequenceRef.current = seq;
  }, [TOTAL_FRAMES, speedRanges, loopSegments]);

  // Preload images once
  const preloadedImages = useRef<Record<number, HTMLImageElement>>({});
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const uniqueFrames = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);
    uniqueFrames.forEach((idx) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          setAllLoaded(true);
        }
      };
      img.src = images[idx];
      preloadedImages.current[idx] = img;
    });
  }, [images, TOTAL_FRAMES]);

  // Animation loop
  const idxRef = useRef(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const prevTimeRef = useRef<number | null>(null);
  const frameDuration = 1000 / baseFps; // ms per frame at 60fps ~16.67

  const loop = useCallback((time: number) => {
    if (!prevTimeRef.current) prevTimeRef.current = time;
    const delta = time - prevTimeRef.current;
    if (delta >= frameDuration) {
      prevTimeRef.current = time - (delta % frameDuration);
      idxRef.current = (idxRef.current + 1) % sequenceRef.current.length;
      const frameIdx = sequenceRef.current[idxRef.current];
      if (frameRef.current) {
        frameRef.current.style.backgroundImage = `url(${images[frameIdx]})`;
      }
    }
    requestAnimationFrame(loop);
  }, [frameDuration, images]);

  useEffect(() => {
    if (!allLoaded) return;
    // Set initial frame
    if (frameRef.current) {
      frameRef.current.style.backgroundImage = `url(${images[0]})`;
    }
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [allLoaded, loop, images]);

  // While first frame not loaded, render nothing (keeps layout)
  if (!allLoaded) return null;

  return (
    <div
      ref={frameRef}
      className={className}
      style={{
        width,
        height,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'inline-block',
      }}
    />
  );
}; 