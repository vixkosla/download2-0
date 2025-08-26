import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FlipGallery from '@/components/ui/FlipGallery';
import { SmoothFrameAnimation } from '@/components/ui/smooth-frame-animation';
import { animation6Frames } from '@/lib/animation6Frames';
import SpritePlayer from '@/components/ui/SpritePlayer';

// Расширяем глобальный интерфейс Window для наших функций
declare global {
  interface Window {
    __aboutSectionHandleCoverClick?: () => void;
    __aboutSectionHandleCloseBook?: () => void;
    __aboutSectionShowBook?: boolean;
  }
}

export const AboutSection = () => {
  const [flipped, setFlipped] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hideBack, setHideBack] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  const handleCoverClick = () => {
    if (!showBook && !animating) {
      setFlipped(true);
      setAnimating(true);
      setTimeout(() => {
        setShowBook(true);
        setTimeout(() => {
          setHideBack(true);
          setTimeout(() => {
            setFlipped(false);
            setAnimating(false);
            setHideBack(false);
          }, 200);
        }, 100);
      }, 700);
    }
  };

  const handleCloseBook = () => {
    if (showBook && !animating) {
      setFlipped(true);
      setAnimating(true);
      setHideBack(false);
      setTimeout(() => {
        setShowBook(false);
        setTimeout(() => {
          setFlipped(false);
          setAnimating(false);
        }, 200);
      }, 700);
    }
  };

  useEffect(() => {
    console.log('Flipped state:', flipped);
    window.__aboutSectionHandleCoverClick = handleCoverClick;
    window.__aboutSectionHandleCloseBook = handleCloseBook;
    window.__aboutSectionShowBook = showBook;
    window.dispatchEvent(new Event('aboutSectionShowBookChanged'));
    return () => {
      delete window.__aboutSectionHandleCoverClick;
      delete window.__aboutSectionHandleCloseBook;
      delete window.__aboutSectionShowBook;
      window.dispatchEvent(new Event('aboutSectionShowBookChanged'));
    };
  }, [flipped, showBook, animating]);

  // Trigger appearance animations when the section enters the viewport
  useEffect(() => {
    if (inView || !sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [inView]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center w-full py-16"
    >
      <div className="flex items-center justify-center gap-8 mb-12 transform 
       translate-x-[-25px] translate-y-[350px]
        md:translate-x-[0px] md:translate-y-[350px]
        lg:translate-x-[-50px] lg:translate-y-[300px]
        xl:translate-x-[-100px] xl:translate-y-[300px]
       ">
        {/* Вариант со спрайтом из public/animation6/sprite.webp + meta.json */}
        <div
          className={`align-middle transform transition-all duration-700 ease-out ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {true && (
            <SpritePlayer
              metaUrl="/animation6/meta.json"
              width={500}
              height={400}
              holdFirstMs={0}
              holdLastMs={0}
              speedMultiplier={0.8}
            />
          )}
        </div>
        <motion.h2
          className="about-title font-bold text-accent font-furore uppercase leading-tight text-center
          whitespace-nowrap 
          "
          initial={{ opacity: 0, x: '-120%', y: '20%', scale: 0.9, rotate: -45 }}
          animate={
            inView
              ? {
                  opacity: [0, 1, 1],
                  x: ['-120%', '12%', '0%'],
                  y: ['20%', '0%', '130%'],
                  scale: [0.9, 1.06, 1.0],
                  rotate: [-45, 10, -5],
                }
              : {}
          }
          transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.7, 1] }}
        >
          О нас
        </motion.h2>
      </div>
      <div className="w-full flex justify-center mt-24">
        <FlipGallery />
      </div>
    </section>
  );
};

