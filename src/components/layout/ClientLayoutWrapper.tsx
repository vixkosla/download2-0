"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
// furore font class will be applied via RootLayout's html/body or specific components
import { Toaster } from "@/components/ui/toaster";
import { FloatingIcons } from '@/components/animations/FloatingIcons';
import CustomCursor from '@/components/ui/custom-cursor';
import ScrollToTop from '@/components/utils/ScrollToTop';
import LoadingBar from '@/components/ui/LoadingBar';

// Расширяем глобальный интерфейс Window для AboutSection showBook
declare global {
  interface Window {
    __aboutSectionShowBook?: boolean;
  }
}

// ArrowButton component (копия из logo-carousel, но с alert)
const ArrowButton = ({ direction }: { direction: 'prev' | 'next' }) => {
  // Проверяем, находимся ли мы на секции about (можно по hash или по наличию элемента)
  const handleClick = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection && aboutSection.offsetParent !== null) {
      if (direction === 'prev' && window.__aboutSectionHandleCoverClick) {
        window.__aboutSectionHandleCoverClick();
        return;
      }
      if (direction === 'next' && window.__aboutSectionHandleCloseBook) {
        window.__aboutSectionHandleCloseBook();
        return;
      }
    }
    alert(direction === 'prev' ? 'prev' : 'next');
  };
  return (
    <button
      onClick={handleClick}
      className={
        `fixed top-1/2 -translate-y-1/2 z-[9999] w-[60px] h-[60px] md:w-[80px] md:h-[80px] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[36px] md:before:w-[48px] before:h-[36px] md:before:h-[48px] before:border-l-[5px] before:border-b-[5px] before:border-yellow-500 before:transform before:-translate-x-1/2 before:-translate-y-1/2 ` +
        (direction === 'prev'
          ? 'before:rotate-45 left-0 md:left-2'
          : 'before:-rotate-[135deg] right-0 md:right-2') +
        ' hover:before:border-yellow-400 focus:outline-none transition-transform duration-150 hover:scale-125'
      }
      style={{ filter: 'drop-shadow(0 0 8px #ffc700)' }}
      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(2.5) drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099)'}
      onMouseLeave={e => e.currentTarget.style.filter = 'drop-shadow(0 0 8px #ffc700)'}
      aria-label={direction === 'prev' ? 'Previous page' : 'Next page'}
    />
  );
};

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [appReadyForHeaderAnimation, setAppReadyForHeaderAnimation] = useState(false);

  // Показываем основной контент только после завершения прелоадера
  const [showContent, setShowContent] = useState(false);

  // Включаем анимации шапки только после завершения LoadingBar
  useEffect(() => {
    // Всегда ждем свежего события loadingScreenComplete,
    // чтобы контент не монтировался под прелоадером

    const handleLoadingComplete = () => {
      setAppReadyForHeaderAnimation(true);
      setShowContent(true);
      // Снимем слушатель, он больше не нужен
      window.removeEventListener('loadingScreenComplete', handleLoadingComplete);
    };

    if (typeof window !== 'undefined') {
      // Очистим старое значение, чтобы не смонтировать контент преждевременно
      sessionStorage.removeItem('loadingScreenComplete');
      window.addEventListener('loadingScreenComplete', handleLoadingComplete);
    }

    return () => {
      window.removeEventListener('loadingScreenComplete', handleLoadingComplete);
    };
  }, []);

  // Проверяем, нужно ли показывать стрелки (только если открыта книга AboutSection)
  const [showBook, setShowBook] = React.useState(false);

  // === Bottom bounce effect ===
  const bottomMarkerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const isBouncingRef = useRef(false);
  const lastBounceAtRef = useRef<number>(0);
  const lastScrollYRef = useRef<number>(0);

  useEffect(() => {

    // Robust bottom detection using scrollingElement; epsilon for fractional values
    const isAtBottomNow = () => {
      const root = document.scrollingElement || document.documentElement;
      return root.clientHeight + root.scrollTop >= root.scrollHeight - 2;
    };
    const MIN_BOUNCE_INTERVAL_MS = 1400;

    const triggerBounce = () => {
      const now = performance.now();
      if (isBouncingRef.current) return;
      if (now - lastBounceAtRef.current < MIN_BOUNCE_INTERVAL_MS) return;
      if (!isAtBottomNow()) return;
      isBouncingRef.current = true;
      lastBounceAtRef.current = now;
      bottomMarkerRef.current?.classList.add('scroll-bounce');
      setTimeout(() => {
        bottomMarkerRef.current?.classList.remove('scroll-bounce');
        isBouncingRef.current = false;
      }, 520);
    };

    const wheelListener = (e: WheelEvent) => {
      // Проверяем «после кадра», чтобы расчёты высоты были актуальны
      if (e.deltaY > 2) {
        requestAnimationFrame(() => triggerBounce());
      }
    };

    window.addEventListener('wheel', wheelListener, { passive: true });

    const scrollListener = () => {
      lastScrollYRef.current = window.scrollY;
      if (isAtBottomNow()) {
        requestAnimationFrame(() => triggerBounce());
      }
    };
    
    const keydownListener = (e: KeyboardEvent) => {
      // Trigger on keys that commonly scroll down
      const isDownIntent = e.key === 'End' || e.key === 'PageDown' || e.key === 'ArrowDown' || (e.key === ' ' && !e.shiftKey);
      if (isDownIntent) {
        requestAnimationFrame(() => triggerBounce());
      }
    };
    window.addEventListener('scroll', scrollListener, { passive: true });
    window.addEventListener('keydown', keydownListener, { passive: true as unknown as boolean });

    // --- touch support (mobile) ---
    let touchStartY = 0;
    let maxPullUp = 0;
    const touchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      maxPullUp = 0;
    };

    const touchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      if (deltaY > maxPullUp) maxPullUp = deltaY;
    };

    const touchEnd = () => {
      // Триггерим один раз при отпускании пальца, если тянули вверх достаточно и находимся у низа
      if (maxPullUp > 16) {
        requestAnimationFrame(() => triggerBounce());
      }
    };

    window.addEventListener('touchstart', touchStart, { passive: true });
    window.addEventListener('touchmove', touchMove, { passive: true });
    window.addEventListener('touchend', touchEnd, { passive: true });

    // cleanup
    return () => {
      window.removeEventListener('wheel', wheelListener);
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('keydown', keydownListener);
    };
  }, []);
  React.useEffect(() => {
    const checkShowBook = () => {
      setShowBook(!!window.__aboutSectionShowBook);
    };
    checkShowBook();
    window.addEventListener('aboutSectionShowBookChanged', checkShowBook);
    return () => {
      window.removeEventListener('aboutSectionShowBookChanged', checkShowBook);
    };
  }, []);

  return (
    <div
      className={cn(
        'min-h-screen font-furore antialiased flex flex-col relative'
        // bg-background and text-foreground are inherited from body
        // furore.variable is on html, font-furore applies the font family
      )}
    >
      {/* Стрелки на краях экрана только если открыта книга */}
      {showBook && <ArrowButton direction="prev" />}
      {showBook && <ArrowButton direction="next" />}
      {/* mat-overlay удалён, теперь ковер только через background у body */}
      <LoadingBar />

      {/* Основной контент монтируем сразу, но скрываем до события loadingScreenComplete. */}
      <div
        className={cn(!showContent && 'pointer-events-none select-none')}
        style={{
          visibility: showContent ? 'visible' : 'hidden',
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <ScrollToTop />
        <CustomCursor />
        <FloatingIcons />
        <Header appReadyForAnimation={appReadyForHeaderAnimation} />
        <div ref={contentWrapperRef} className="scroll-bounce-wrapper flex flex-col flex-grow">
          <main className="flex-grow relative z-10">{children}</main>
          <Footer />
          {/* Bottom texture bar + overscroll bounce space */}
          <div ref={bottomMarkerRef} className="bottom-marker" />
        </div>
        <Toaster />
      </div>
    </div>
  );
}
