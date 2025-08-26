'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SpriteMeta {
  width: number;
  height: number;
  fps: number;
  frames: number;
  frames_per_row: number;
  rows: number;
  image: string; // e.g. "sprite.webp"
}

interface SpritePlayerProps {
  metaUrl?: string; // default "/meta.json"
  width?: number; // desired display width per frame (scales sprite)
  height?: number; // desired display height per frame (scales sprite)
  holdFirstMs?: number; // delay before first frame advances
  holdLastMs?: number; // delay when showing last frame
  speedMultiplier?: number; // 1 = normal speed; <1 slower; >1 faster
  className?: string;
}

const SpritePlayer: React.FC<SpritePlayerProps> = ({
  metaUrl = '/meta.json',
  width,
  height,
  holdFirstMs = 0,
  holdLastMs = 0,
  speedMultiplier = 1,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [meta, setMeta] = useState<SpriteMeta | null>(null);

  // Load sprite metadata
  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      try {
        const res = await fetch(metaUrl, { cache: 'force-cache' });
        if (!res.ok) return;
        const data = (await res.json()) as SpriteMeta;
        if (!isCancelled) setMeta(data);
      } catch {
        // noop
      }
    };
    load();
    return () => {
      isCancelled = true;
    };
  }, [metaUrl]);

  // Start animation loop once meta is available
  useEffect(() => {
    if (!meta || !containerRef.current) return;

    const element = containerRef.current;

    // Determine display size (scale)
    const frameWidth = width ?? meta.width;
    const frameHeight = height ?? meta.height;
    const sheetWidth = frameWidth * meta.frames_per_row;
    const sheetHeight = frameHeight * meta.rows;

    // Initial styles
    element.style.width = `${frameWidth}px`;
    element.style.height = `${frameHeight}px`;
    // Resolve image URL relative to meta.json path
    const lastSlash = metaUrl.lastIndexOf('/');
    const basePath = lastSlash >= 0 ? metaUrl.slice(0, lastSlash) : '';
    const imageUrl = `${basePath}/${meta.image}`.replace(/\\/g, '/').replace(/\/\//g, '/').replace(/\/+/, '/');
    // Normalize URL (avoid duplicate slashes)
    const normalizedUrl = imageUrl.replace(/\/+/, '/').replace(/\/\/+/, '/');
    element.style.backgroundImage = `url(${normalizedUrl})`;
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = `${sheetWidth}px ${sheetHeight}px`;
    element.style.backgroundPosition = '0px 0px';
    element.style.willChange = 'background-position';

    let frameIndex = 0;
    let lastTime = performance.now();
    let accumulatorMs = 0;
    let holdingMs = 0;
    const effectiveFps = Math.max(0.0001, meta.fps * speedMultiplier);
    const msPerFrame = 1000 / effectiveFps;
    const firstIndex = 0;
    const lastIndex = meta.frames - 1;

    const updateBackgroundPosition = (index: number) => {
      const col = index % meta.frames_per_row;
      const row = Math.floor(index / meta.frames_per_row);
      element.style.backgroundPosition = `${-col * frameWidth}px ${-row * frameHeight}px`;
    };

    updateBackgroundPosition(frameIndex);

    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      // Apply holds on first and last frames (do not accumulate animation time while holding)
      if ((frameIndex === firstIndex && holdFirstMs > 0) || (frameIndex === lastIndex && holdLastMs > 0)) {
        holdingMs += dt;
        const target = frameIndex === firstIndex ? holdFirstMs : holdLastMs;
        if (holdingMs < target) {
          rafRef.current = requestAnimationFrame(loop);
          return; // keep showing current frame
        }
        holdingMs = 0; // reset hold once satisfied
      }

      accumulatorMs += dt;
      while (accumulatorMs >= msPerFrame) {
        accumulatorMs -= msPerFrame;
        frameIndex = (frameIndex + 1) % meta.frames;
      }
      updateBackgroundPosition(frameIndex);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [meta, width, height, holdFirstMs, holdLastMs, speedMultiplier, metaUrl]);

  return <div ref={containerRef} className={className} aria-hidden />;
};

export default SpritePlayer;


