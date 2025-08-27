'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Phone, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  appReadyForAnimation?: boolean;
  startHeroAnimations?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ appReadyForAnimation = false, startHeroAnimations = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Блокируем обновление activeLink из scroll-обработчика на время плавного скролла,
  // чтобы старая рамка не успевала «возвратиться» до завершения анимации
  const [scrollLocked, setScrollLocked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Tracks if the main bounce animation has run
  const [navAnimated, setNavAnimated] = useState(false); // Tracks if nav link text animation has started
  const [showOrderBtn, setShowOrderBtn] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const headerRef = useRef<HTMLElement>(null);


  const navLinks = [
    { href: '#about', label: 'О нас' },
    { href: '#pricing-gallery', label: 'Цены' },
    { href: '#partners', label: 'Партнёры' },
    { href: '#contacts', label: 'Контакты' },
    { href: '#order-form', label: 'Заказать' },
  ];

  const WORD_ANIMATION_DELAY_INCREMENT = 0.12;
  const WORD_ANIMATION_DURATION = 0.3; 
  // Additional offset (in pixels) to delay navigation link activation on scroll.
  const NAV_ACTIVATION_OFFSET = 100; // distance in pixels the section must scroll past the header before nav activates

  useEffect(() => {
    setIsMounted(true);
    const headerElement = headerRef.current;
    if (!headerElement) return;
    
    const sections = navLinks
      .map(link => {
          const id = link.href.substring(1);
          if (id) return document.getElementById(id);
          return null;
      })
      .filter(Boolean) as HTMLElement[];

    const handleScroll = () => {
      const currentHeader = headerRef.current; 
      if (!currentHeader) return;

      // Если активен ручной (плавный) скролл – пропускаем обновление
      if (scrollLocked) return;

      const offset = window.scrollY;
      setIsScrolled(offset > 50);

      let newActiveLink = '';
      const headerHeight = currentHeader.clientHeight || 140;
      const checkPoint = offset + headerHeight + NAV_ACTIVATION_OFFSET;

      const heroElement = document.querySelector('.video-hero') as HTMLElement | null;

      if (heroElement && offset < heroElement.offsetHeight * 0.7) {
        newActiveLink = ''; 
      } else {
        // Iterate through sections in reverse order to handle overlapping sections correctly.
        // This allows deeper/later sections (e.g., "order-form") to take precedence over earlier ones (e.g., "contacts").
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (!section) continue;
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (sectionTop <= checkPoint && (sectionTop + sectionHeight) > checkPoint) {
            newActiveLink = section.id;
            break;
          }
        }
        
        const aboutSectionWrapper = document.getElementById('about');
        if (aboutSectionWrapper && !newActiveLink && navLinks.some(link => link.href === '#about')) {
            const aboutSectionTop = aboutSectionWrapper.offsetTop;
            const aboutSectionHeight = aboutSectionWrapper.offsetHeight;
            if (aboutSectionTop <= checkPoint && (aboutSectionTop + aboutSectionHeight) > checkPoint) {
                newActiveLink = 'about';
            }
        }
      }
      
      // Removed forced activation of "contacts" when reaching the bottom of the page.
      // This ensures the nav highlight corresponds to the true section in view (e.g., "order-form").
      
      setActiveLink(newActiveLink);
    };


    if (isMounted && (appReadyForAnimation || startHeroAnimations) && !hasAnimated) {
      headerElement.classList.add('header--bounce');
      setHasAnimated(true);
      setTimeout(() => {
        setNavAnimated(true);
        
        let totalAnimatedUnits = 0;
        navLinks.forEach(link => {
          const labelParts = link.label.split(' ');
          totalAnimatedUnits += labelParts.length > 1 ? labelParts.length : 1;
        });

        const lastUnitGlobalIndex = totalAnimatedUnits > 0 ? totalAnimatedUnits - 1 : 0;
        const animationStartTimeForLastUnit = lastUnitGlobalIndex * WORD_ANIMATION_DELAY_INCREMENT;
        const animationEndTimeForLastUnit = animationStartTimeForLastUnit + WORD_ANIMATION_DURATION;
        const totalDelayMsForNavAnimationStart = animationStartTimeForLastUnit * 1000;
        const totalDelayMsForNavAnimationEnd = animationEndTimeForLastUnit * 1000;

        // Показываем телефон почти сразу после начала анимации пункта «Заказать»
        setTimeout(() => {
          setShowPhone(true);
        }, totalDelayMsForNavAnimationStart + 150);

        // Затем, по завершении анимации всех пунктов, можем отобразить дополнительную кнопку (если потребуется)
        setTimeout(() => {
          setShowOrderBtn(true);
        }, totalDelayMsForNavAnimationEnd + 50);

      }, 900); 
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted, appReadyForAnimation, startHeroAnimations, hasAnimated, navLinks]);

   const handleScrollTo = (
     e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>, 
     targetId: string
   ) => {
       e.preventDefault();

       // Определяем id секции без символа «#»
       const plainId = targetId.startsWith('#') ? targetId.substring(1) : targetId;

       // Мгновенно выставляем активный пункт меню, чтобы анимации шли одновременно
       setActiveLink(plainId);

       // Блокируем scroll-обработчик на время анимации (0.7 s) + небольший запас
       setScrollLocked(true);
       setTimeout(() => setScrollLocked(false), 900);

       const targetElement = document.getElementById(plainId);
       if (targetElement) {
           const headerHeight = headerRef.current?.clientHeight || 80;
           window.scrollTo({
               top: targetElement.offsetTop - headerHeight,
               behavior: 'smooth',
           });
       }

       // Снимаем фокус, чтобы после клика не оставалось состояния :focus, из-за которого линия подчёркивания могла «зависать»
       (e.currentTarget as HTMLElement)?.blur();

       // Закрываем мобильное меню, если оно было открыто
       setIsMobileMenuOpen(false);
   };

  const renderAnimatedUnit = (text: string, unitGlobalIndex: number) => {
    return (
      <span
        key={`${text}-${unitGlobalIndex}`}
        className={cn('nav__word', navAnimated && 'nav__word--in')} 
        style={{
          display: 'inline-block',
          transform: navAnimated ? 'translateY(0)' : 'translateY(-120%)',
          opacity: navAnimated ? 1 : 0,
          transition: `transform ${WORD_ANIMATION_DURATION}s cubic-bezier(.7,0,.3,1), opacity ${WORD_ANIMATION_DURATION}s cubic-bezier(.7,0,.3,1)`,
          transitionDelay: navAnimated ? `${unitGlobalIndex * WORD_ANIMATION_DELAY_INCREMENT}s` : '0s',
        }}
      >
        {text === ' ' ? '\u00A0' : text}
      </span>
    );
  };

  const renderNavLinks = (mobile: boolean = false) => (
    <ul ref={navRef} className={cn("nav__list", mobile && "flex-col space-x-0 space-y-4 items-start text-lg")}>
      {navLinks.map((link, linkIdx) => {
        const isActive = activeLink === (link.href.startsWith('#') ? link.href.substring(1) : link.href);
        
        let cumulativeUnitIndex = 0;
        for(let i=0; i<linkIdx; i++) {
            const labelParts = navLinks[i].label.split(' ');
            cumulativeUnitIndex += labelParts.length > 1 ? labelParts.length : 1;
        }

        const labelParts = link.label.split(' ');

        return (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className={cn(
                "nav__link",
                isActive && "active" // цвет ссылки
                // убираем static "active-border" – теперь обводка выводится SVG-анимацией ниже
              )}
              tabIndex={navAnimated && !mobile ? 0 : (mobile ? 0 : -1) }
              aria-label={link.label}
              style={{ position: 'relative', display: 'inline-block' }}
            >

              {/* Контент ссылки */}
              {labelParts.length > 1 ? (
                labelParts.map((word, wIdx) => (
                  <React.Fragment key={wIdx}>
                    {mobile ? word : renderAnimatedUnit(word, cumulativeUnitIndex + wIdx)}
                    {wIdx !== labelParts.length - 1 && ' '}
                  </React.Fragment>
                ))
              ) : (
                mobile ? link.label : renderAnimatedUnit(link.label, cumulativeUnitIndex)
              )}

              {/* SVG-обводка */}
              {!mobile && (
                <svg
                  className={cn(
                    "svg-border",
                    isActive && isMounted && "svg-border--active"
                  )}
                  width="100%"
                  height="100%"
                  viewBox="0 0 120 40"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                >
                  {/* Левая половина рамки */}
                  <path
                    className="svg-border__path svg-border__path--left"
                    d="M60 38 L15 38 A12 12 0 0 1 3 26 L3 14 A12 12 0 0 1 15 2 L60 2"
                    pathLength="1"
                  />
                  {/* Правая половина рамки */}
                  <path
                    className="svg-border__path svg-border__path--right"
                    d="M60 38 L105 38 A12 12 0 0 0 117 26 L117 14 A12 12 0 0 0 105 2 L60 2"
                    pathLength="1"
                  />
                </svg>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  // useEffect removed – paths rely on fixed pathLength attribute for animation

  return (
    <header ref={headerRef} className={cn('header', isScrolled && 'scrolled', hasAnimated && 'header--bounce')} style={{ minHeight: 140 }}>
      <div className="container header__content flex items-center justify-between gap-0 md:gap-4 lg:gap-8 pl-[0] lg:pl-[20px] ml-[0] 2xl:ml-[auto]">
        <Link href="/" className="logo group flex flex-col  items-center justify-center gap-1 relative min-h-[100px] scale-[0.55] md:scale-[0.8] lg:scale-[1]" aria-label="Перейти на главную страницу">
            <Image src="/images/logo.svg" alt="SHELF Сборка Мебели Logo" width={60} height={60} className="logo__image" data-ai-hint="logo company" />
            <p className="header__subtitle">Профессиональная</p>
            <p className="header__subtitle leading-none">Сборка мебели</p>
        </Link>
        <div className="flex items-center justify-between gap-8">
          <nav className="nav hidden md:flex justify-center items-center ml-2">
             {renderNavLinks()}
          </nav>
           <div
              className={cn(
                "relative flex items-center min-w-[220px] gap-2 ml-auto align-bottom",
                !showPhone && "pointer-events-none"
              )}
              style={{
                transform: showPhone ? 'translateY(-6px)' : 'translateY(-120%)',
                opacity: showPhone ? 1 : 0,
                transition: 'transform 0.3s cubic-bezier(.7,0,.3,1), opacity 0.3s cubic-bezier(.7,0,.3,1)'
              }}
            >
              <a
                href="tel:+79219992200"
                className="flex items-center gap-2 text-white hover:text-accent transition-colors"
                aria-label="Позвонить"
              >
                <span className="select-text whitespace-nowrap text-lg md:text-xl">
                  +7 (921) 999-22-00
                </span>
                <Image src="/images/icons/phone.svg" alt="Телефон" width={42} height={42} className="phone-shake whitespace-nowrap" />
              </a>
              <span className="absolute left-0 top-full mt-1.5 font-bold select-text whitespace-nowrap w-full text-center text-base md:text-lg" style={{ color: '#b0b0b0', lineHeight: 0.5, letterSpacing: '0.02em'}}>
                без выходных 10-22
              </span>
            </div>
          <Link href="#" className="cart-icon md:hidden" aria-label="Корзина">
             <ShoppingCart />
          </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
             <SheetTrigger asChild>
                <button className="mobile-menu-toggle md:hidden" aria-label="Открыть меню">
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-primary p-6 border-l border-accent">
                <nav className="flex flex-col space-y-6 mt-10">
                   {renderNavLinks(true)}
                   <a href="tel:+79219992200" className="flex items-center justify-center gap-2 text-foreground hover:text-accent transition-colors mt-4 text-lg" aria-label="Позвонить">
                     <Image src="/images/icons/phone.svg" alt="Телефон" width={42} height={42} className="phone-shake whitespace-nowrap" />
                      <span>+7 (921) 999-22-00</span>
                   </a>
                </nav>
              </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
