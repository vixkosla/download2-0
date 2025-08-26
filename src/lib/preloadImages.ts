export const preloadImages = (paths: string[]): Promise<void> => {
  return new Promise((resolve) => {
    if (!paths.length) {
      resolve();
      return;
    }
    let loaded = 0;
    const total = paths.length;
    paths.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded === total) {
          resolve();
        }
      };
      img.src = src;
    });
  });
}; 