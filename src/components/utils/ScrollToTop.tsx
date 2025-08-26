'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  // Disable browser scroll restoration so page always starts at top/hero on reload
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Remove any hash from the url on first load to prevent automatic anchor scrolling
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      // Preserve query params but drop the hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    // Scroll to top on initial mount and on pathname change
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]); // Dependency on pathname ensures scroll on route change

  return null; // This component doesn't render anything visible
}
