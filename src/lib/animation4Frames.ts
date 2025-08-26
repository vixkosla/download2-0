export const animation4Frames: string[] = Array.from({ length: 51 }, (_, i) => {
  // Frames are named IMG_6664.PNG up to IMG_6714.PNG located in public/animation4/
  const frameNumber = 6664 + i;
  return `/animation4/IMG_${frameNumber}.PNG`;
}); 