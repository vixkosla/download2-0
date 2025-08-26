'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Instagram } from 'lucide-react'; // Added Phone

const icons = [
  '/icons/1.png', '/icons/2.png', '/icons/3.png', '/icons/4.png', '/icons/5.png',
  '/icons/7.png', '/icons/8.png', '/icons/11.png', '/icons/13.png',
];

const iconStyles = [
  { top: 10, left: 20, width: 48, rotate: -18 },
  { top: 40, left: 120, width: 36, rotate: 12 },
  { bottom: 30, left: 60, width: 60, rotate: -8 },
  { top: 60, right: 40, width: 40, rotate: 22 },
  { bottom: 36, left: 180, width: 50, rotate: -25 },
  { top: 120, right: 30, width: 70, rotate: 15 },
  { bottom: 24, right: 36, width: 60, rotate: -10 },
  { top: 30, right: 120, width: 38, rotate: 30 },
  { bottom: 40, right: 60, width: 54, rotate: -32 },
];

export const ContactCard: React.FC = () => {
  const [flipped, setFlipped] = useState(false);
  const [activeBounceBullet, setActiveBounceBullet] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep observer placeholder, but do NOT auto-flip so the front (icons) stays visible
    const observer = new window.IntersectionObserver(() => {}, { threshold: 0.3 });
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBounceBullet(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative flex items-center justify-center"
      style={{ perspective: 1200, width: '100%', minHeight: 280, boxShadow: '0 8px 40px 0 rgba(0,0,0,0.35)' }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          zIndex: flipped ? 1 : 2,
        }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="contact__form-yellow-border contact__form-yellow-border--texture contact__form-yellow-border--left flex flex-col items-center justify-center relative overflow-visible w-full h-full" style={{ minHeight: 280, background: 'transparent', border: '3px solid transparent' }}>
          {/* Декоративные иконки (внутри границ) */}
          {icons.map((src, i) => {
            const style = { ...iconStyles[i] };
            const { rotate, ...pos } = style;
            return (
              <img
                key={src}
                src={src}
                alt="decor"
                style={{
                  position: 'absolute',
                  ...pos,
                  opacity: 0.2,
                  filter: 'grayscale(1) brightness(0.3)',
                  zIndex: 1,
                  pointerEvents: 'none',
                  transform: `rotate(${rotate}deg)`,
                  maxWidth: '25%',
                  maxHeight: '25%'
                }}
              />
            );
          })}
          {/* Основной контент карточки */}
          <div className="w-full flex flex-col items-center justify-center relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl text-accent text-center mb-4 md:mb-8 tracking-wide uppercase font-furore" style={{ letterSpacing: '0.04em' }}>Профессиональная сборка вашей мебели</h3>
            <div className="w-full flex flex-col md:flex-row justify-between items-stretch gap-6 md:gap-8 px-2 md:px-6">
              {/* Левая колонка: услуги */}
              <div className="flex flex-col justify-center items-start flex-1 text-center md:text-left">
                <div className="text-white text-lg sm:text-xl md:text-2xl font-furore leading-relaxed tracking-wide mb-1.5 md:mb-4" style={{ letterSpacing: '0.04em' }}>СБОРКА</div>
                <div className="text-white text-lg sm:text-xl md:text-2xl font-furore leading-relaxed tracking-wide mb-1.5 md:mb-4" style={{ letterSpacing: '0.04em' }}>РЕМОНТ</div>
                <div className="text-white text-lg sm:text-xl md:text-2xl font-furore leading-relaxed tracking-wide" style={{ letterSpacing: '0.04em' }}>МОДЕРНИЗАЦИЯ</div>
              </div>
              {/* Вертикальный разделитель */}
              <div 
                className="hidden md:block w-[3px] bg-accent md:mx-6 lg:mx-12"
                style={{ height: '60%', alignSelf: 'center', borderRadius: 1 }}
              />
              {/* Правая колонка: контакты */}
              <div className="flex flex-col justify-center items-start flex-1 gap-2.5 md:gap-4 text-white text-base sm:text-lg md:text-xl font-furore">
                <a href="tel:+78123172200" className="flex items-center gap-3 hover:text-accent transition-colors">
                  <motion.span
  animate={activeBounceBullet === 0 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  className="flex items-center"
>
  <Phone className={`h-5 w-5 sm:h-6 sm:w-6 text-accent${activeBounceBullet === 0 ? ' bounce-check' : ''}`} />
</motion.span>
                  +7 (812) 317-22-00
                </a>
                <a href="tel:+79219992200" className="flex items-center gap-3 hover:text-accent transition-colors">
                  <motion.span
  animate={activeBounceBullet === 1 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  className="flex items-center"
  style={{ color: '#25D366', fontSize: 24, display: 'flex', alignItems: 'center' }}
>
  <svg className={`${activeBounceBullet === 1 ? 'bounce-check' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
</motion.span>
                  +7 (921) 999-22-00
                </a>
                <a href="mailto:shelf.sborka.spb@gmail.com" className="flex items-center gap-3 hover:text-accent transition-colors">
                  <motion.span
  animate={activeBounceBullet === 2 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  className="flex items-center"
>
  <Mail className={`h-5 w-5 sm:h-6 sm:w-6${activeBounceBullet === 2 ? ' bounce-check' : ''}`} style={{ color: '#888888' }} />
</motion.span>
                  shelf.sborka.spb@gmail.com
                </a>
                <a href="https://instagram.com/shelf_sborka_spb" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors">
                  <motion.span
  animate={activeBounceBullet === 3 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  className="flex items-center"
>
  <Instagram className={`h-5 w-5 sm:h-6 sm:w-6 text-[#E1306C]${activeBounceBullet === 3 ? ' bounce-check' : ''}`} />
</motion.span>
                  SHELF_SBORKA_SPB
                </a>
                <a href="https://t.me/shelf_sborka_spb" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors">
                  <motion.span
  animate={activeBounceBullet === 4 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
  className="flex items-center"
  style={{ color: '#229ED9', fontSize: 24, display: 'flex', alignItems: 'center' }}
>
  <svg className={`${activeBounceBullet === 4 ? 'bounce-check' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="#229ED9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22l-4-9-9-4 20-6z" stroke="#229ED9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
</motion.span>
                  @SHELF_SBORKA_SPB
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Оборотная сторона */}
      <motion.div
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          zIndex: flipped ? 2 : 1,
        }}
        animate={{ rotateY: flipped ? 0 : 180 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <div className="contact__form-yellow-border contact__form-yellow-border--texture contact__form-yellow-border--right w-full h-full flex items-center justify-center" style={{ minHeight: 320, background: 'transparent', border: '3px solid transparent' }}>
          <img
            src="/images/logo.png"
            alt="Логотип"
            style={{ maxWidth: '55%', maxHeight: '55%', objectFit: 'contain' }}
            data-ai-hint="company logo"
            />
        </div>
      </motion.div>
    </div>
  );
};
