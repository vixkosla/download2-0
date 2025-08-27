'use client';

import { useState, useEffect, type ReactNode, useRef, useLayoutEffect } from 'react';
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero } from '@/components/sections/Hero';
import { HydrationErrorBoundary } from '@/components/utils/HydrationErrorBoundary';
// import { CreativePricing } from "@/components/ui/creative-pricing"; // Removed
// import type { PricingTier } from "@/components/ui/creative-pricing"; // Removed
// import { PortfolioGallery } from '@/components/sections/PortfolioGallery'; // Removed
import { InteractivePriceGallery } from '@/components/sections/InteractivePriceGallery';
import type { FurnitureCategory, PortfolioItem } from '@/types'; // Assuming types will be in a shared file

// import { AboutUsSection } from '@/components/sections/AboutUsSection';
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import type { Testimonial } from "@/components/ui/animated-testimonials";
import { Wrench, Package, Hammer } from 'lucide-react';
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { SmoothFrameAnimation } from "@/components/ui/smooth-frame-animation";
import { animation2Frames } from "@/lib/animation2Frames";
import { preloadImages } from "@/lib/preloadImages";
// import { AppCarousel, type SlideData } from '@/components/ui/custom-app-carousel'; // AppCarousel might be used inside InteractivePriceGallery
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Dialog might be used inside InteractivePriceGallery
import { Button } from '@/components/ui/button';
import { ServicesSection } from '@/components/sections/ServicesSection';
// import { CollapsibleDoorSection } from '@/components/ui/collapsible-door-section'; // Might be used inside InteractivePriceGallery
import { createPortal } from 'react-dom';
import { ItemDetailView } from '@/components/ui/ItemDetailView';
import { ContactInfoSection } from '@/components/sections/ContactInfoSection';
import { ContactFormSection } from '@/components/sections/ContactFormSection';

import { AboutSection } from '@/components/sections/AboutSection';


export default function Home() {
  const [showMiniSections, setShowMiniSections] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [buttonCenter, setButtonCenter] = useState<{ x: number, y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  // const [activeModalSectionId, setActiveModalSectionId] = useState<string | null>(null); // Managed by InteractivePriceGallery
  // const [carouselSlidesData, setCarouselSlidesData] = useState<SlideData[]>([]); // Managed by InteractivePriceGallery
  const [openedMiniIndex, setOpenedMiniIndex] = useState<number | null>(null);
  const [activeLink, setActiveLink] = useState('');
  const [hasShownPartners, setHasShownPartners] = useState(false);
  const [hasShownPartnersTitle, setHasShownPartnersTitle] = useState(false);
  const partnersRef = useRef<HTMLDivElement>(null);
  // const headerRef = useRef<HTMLElement>(null);

  const [itemForDetailView, setItemForDetailView] = useState<PortfolioItem | null>(null);


  const furnitureCategories: FurnitureCategory[] = [
    {
      id: "cat1",
      name: "ШКАФ",
      icon: <Wrench className="w-8 h-8" />,
    },
    {
      id: "cat2",
      name: "КОМОД",
      icon: <Package className="w-8 h-8" />,
    },
    {
      id: "cat3",
      name: "ТУМБА",
      icon: <Hammer className="w-8 h-8" />,
    },
    {
      id: "cat4",
      name: "КУХНЯ",
      icon: <Wrench className="w-8 h-8" />,
    },
    {
      id: "cat5",
      name: "ГАРДЕРОБНАЯ",
      icon: <Package className="w-8 h-8" />,
    },
    {
      id: "cat6",
      name: "СТОЛ",
      icon: <Hammer className="w-8 h-8" />,
    },
    {
      id: "cat7",
      name: "КРОВАТЬ",
      icon: <Wrench className="w-8 h-8" />,
    },
    {
      id: "cat8",
      name: "ДИВАН",
      icon: <Package className="w-8 h-8" />,
    },
    {
      id: "cat9",
      name: "СТУЛ",
      icon: <Hammer className="w-8 h-8" />,
    },
    {
      id: "cat10",
      name: "НАВЕСНАЯ ПОЛКА",
      icon: <Wrench className="w-8 h-8" />,
    },
    {
      id: "cat11",
      name: "ПЕНАЛ",
      icon: <Package className="w-8 h-8" />,
    },
    {
      id: "cat12",
      name: "КОМП. СТОЛ И СТУЛ",
      icon: <Hammer className="w-8 h-8" />,
    },
  ];

  const portfolioItems: PortfolioItem[] = [
    { id: 1, title: 'Кухня "Лофт"', description: 'Сборка кухонного гарнитура в стиле лофт, фасады МДФ, фурнитура Blum. Установка встроенной техники.', imageUrl: 'https://picsum.photos/seed/kitchen1/800/600', category: 'КУХНЯ', dataAiHint: "kitchen loft island", price: 12000 },
    { id: 2, title: 'Шкаф "Палермо"', description: 'Сборка большого пятидверного распашного шкафа с зеркальными центральными дверями и антресолями.', imageUrl: 'https://picsum.photos/seed/wardrobe1/800/600', category: 'ШКАФ', dataAiHint: "wardrobe mirrored doors", price: 5500 },
    { id: 3, title: 'Кровать "Афина"', description: 'Сборка двуспальной кровати 160х200 с мягким изголовьем из велюра и подъемным механизмом на газлифтах.', imageUrl: 'https://picsum.photos/seed/bed1/800/600', category: 'КРОВАТЬ', dataAiHint: "bed double upholstered", price: 3500 },
    { id: 4, title: 'Стол "Директор"', description: 'Сборка массивного письменного стола из МДФ для кабинета, с выдвижными ящиками и тумбой.', imageUrl: 'https://picsum.photos/seed/desk1/800/600', category: 'СТОЛ', dataAiHint: "office desk executive", price: 4000 },
    { id: 5, title: 'Стенка "Верона"', description: 'Сборка модульной гостиной стенки из 5 элементов с глянцевыми фасадами и интегрированной светодиодной подсветкой.', imageUrl: 'https://picsum.photos/seed/living1/800/600', category: 'ГАРДЕРОБНАЯ', dataAiHint: "living wall unit", price: 7000 }, // Example: "ГАРДЕРОБНАЯ" might be a better fit for a wall unit
    { id: 6, title: 'Кухня "Прованс"', description: 'Сборка и установка угловой кухни в стиле прованс, с патинированными фасадами и стеклянными витринами.', imageUrl: 'https://picsum.photos/seed/kitchen2/800/600', category: 'КУХНЯ', dataAiHint: "kitchen provence style", price: 15000 },
    { id: 7, title: 'Комод "Венеция"', description: 'Сборка классического комода на 4 ящика с фрезерованными фасадами и металлическими ручками.', imageUrl: 'https://picsum.photos/seed/komod1/800/600', category: 'КОМОД', dataAiHint: "dresser classic wood", price: 2500 },
    { id: 8, title: 'Тумба "Сканди"', description: 'Сборка подвесной ТВ-тумбы в скандинавском стиле с двумя выдвижными ящиками.', imageUrl: 'https://picsum.photos/seed/tumba1/800/600', category: 'ТУМБА', dataAiHint: "tv stand scandinavian", price: 2200 },
    { id: 9, title: 'Диван "Честер"', description: 'Сборка трехместного дивана "Честерфилд" из экокожи с каретной стяжкой.', imageUrl: 'https://picsum.photos/seed/divan1/800/600', category: 'ДИВАН', dataAiHint: "sofa chesterfield leather", price: 4800 },
    { id: 10, title: 'Стул "Эймс"', description: 'Сборка дизайнерского пластикового стула на деревянных ножках.', imageUrl: 'https://picsum.photos/seed/chair1/800/600', category: 'СТУЛ', dataAiHint: "chair modern plastic", price: 800 },
    { id: 11, title: 'Полка "Лофт-1"', description: 'Монтаж навесной металлической полки в индустриальном стиле.', imageUrl: 'https://picsum.photos/seed/shelf1/800/600', category: 'НАВЕСНАЯ ПОЛКА', dataAiHint: "shelf industrial metal", price: 1200 },
    { id: 12, title: 'Пенал "Модерн"', description: 'Сборка узкого высокого шкафа-пенала для ванной комнаты.', imageUrl: 'https://picsum.photos/seed/penal1/800/600', category: 'ПЕНАЛ', dataAiHint: "cabinet tall narrow", price: 1800 },
    { id: 13, title: 'Компьютерный стол "Геймер"', description: 'Сборка эргономичного игрового стола с надстройкой и кабель-каналами.', imageUrl: 'https://picsum.photos/seed/compdesk1/800/600', category: 'КОМП. СТОЛ И СТУЛ', dataAiHint: "gaming desk ergonomic", price: 3200 },
    { id: 14, title: 'Офисный стул "Комфорт"', description: 'Сборка компьютерного кресла с регулировками и сетчатой спинкой.', imageUrl: 'https://picsum.photos/seed/officechair1/800/600', category: 'КОМП. СТОЛ И СТУЛ', dataAiHint: "office chair mesh", price: 1500 },
    { id: 15, title: 'Шкаф-купе "Аллегро"', description: 'Сборка двухдверного шкафа-купе с системой раздвижных дверей Raumplus.', imageUrl: 'https://picsum.photos/seed/coupe1/800/600', category: 'ШКАФ', dataAiHint: "sliding wardrobe modern", price: 6500 },
  ];


  const teamMembers: Testimonial[] = [
    {
      quote:
        "Точность и аккуратность — мои главные принципы. Люблю, когда после моей работы мебель выглядит идеально, как с картинки.",
      name: "Алексей Иванов",
      designation: "Старший мастер по сборке",
      src: "https://picsum.photos/seed/master1/500/500",
      dataAiHint: "male craftsman",
    },
    {
      quote:
        "Сборка кухонь — моя страсть. Знаю все нюансы подключения техники и установки сложных модулей. Ваша кухня будет безупречна!",
      name: "Дмитрий Петров",
      designation: "Специалист по кухонным гарнитурам",
      src: "https://picsum.photos/seed/master2/500/500",
      dataAiHint: "male kitchen installer",
    },
    {
      quote:
        "Скорость и качество — вот что важно для клиента. Собираю мебель быстро, надежно и без лишнего шума. Опыт позволяет!",
      name: "Сергей Смирнов",
      designation: "Мастер универсал",
      src: "https://picsum.photos/seed/master3/500/500",
      dataAiHint: "male furniture assembler",
    },
    {
      quote:
        "Обожаю собирать сложную дизайнерскую мебель. Каждая деталь имеет значение, и я слежу, чтобы все было безупречно. Ваш интерьер будет произведением искусства!",
      name: "Виктор Козлов",
      designation: "Специалист по дизайнерской мебели",
      src: "https://picsum.photos/seed/master4/500/500",
      dataAiHint: "male designer furniture",
    },
  ];

  useEffect(() => {
    const navLinks = [
      { href: '#about', label: 'О нас' },
      { href: '#pricing-gallery', label: 'Цены' },
      { href: '#partners', label: 'Партнёры' },
      { href: '#contacts', label: 'Контакты' },
      { href: '#order-form', label: 'Заказать' },
    ];
    const sections = navLinks
      .map(link => {
        const id = link.href.substring(1);
        if (id) return document.getElementById(id);
        return null;
      })
      .filter(Boolean) as HTMLElement[];
    const handleScroll = () => {
      const offset = window.scrollY;
      let newActiveLink = '';
      const headerElement = document.querySelector('header');
      const headerHeight = headerElement?.clientHeight || 140;
      const checkPoint = offset + headerHeight + (window.innerHeight * 0.3);
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
      setActiveLink(newActiveLink);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Анимация заголовка запускается, когда блок partners появляется в зоне видимости
  useEffect(() => {
    if (hasShownPartnersTitle) return;
    const ref = partnersRef.current;
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHasShownPartnersTitle(true);
            setTimeout(() => setHasShownPartners(true), 800);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [hasShownPartnersTitle]);

  // Preload partner animation frames once on mount
  useEffect(() => {
    preloadImages(animation2Frames);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative scale-0.5">
      <HydrationErrorBoundary>
        <Hero />
      </HydrationErrorBoundary>
      <AboutSection />
      {/* <div id="about" className="min-h-screen flex flex-col justify-center relative">
          <div ref={aboutSectionRef} className="relative z-10">
                <AboutUsSection
              onToggleDetailedInfo={() => {
                if (buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  setButtonCenter({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2 + window.scrollY,
                  });
                }
                setShowMiniSections(true);
                setTimeout(() => setStartAnimation(true), 10);
              }}
              buttonRef={buttonRef}
            />
          </div>
          {showMiniSections && aboutSectionRef.current && createPortal(
            <MiniSectionsFlyout
              startAnimation={startAnimation}
              buttonCenter={buttonCenter}
              containerRef={aboutSectionRef}
              teamMembers={teamMembers}
              onBack={() => {
                setShowMiniSections(false);
                setStartAnimation(false);
              }}
            />, 
            aboutSectionRef.current
          )}
        </div> */}

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore - Gallery currently doesn't accept extra props, will refactor later */}
      <InteractivePriceGallery
        sectionId="pricing-gallery" // ID для навигации
      />

      {itemForDetailView && (
        <ItemDetailView
          item={itemForDetailView}
          onClose={() => setItemForDetailView(null)}
        />
      )}

      {/* Партнёрский блок: оборачиваем заголовок и карусель в контейнер с ID "partners" */}
      <div id="partners" ref={partnersRef}>
        <div className="section-title-wrapper py-12 blur md:blur-sm lg:blur-none ">
          <motion.h2
            className="section-title text-[10rem] md:text-[12rem] 
              
              leading-none mb-12 flex items-center justify-center gap-8"
            style={{ color: '#ffc700' }}
            initial="hidden"
            animate={hasShownPartnersTitle ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 120, scale: 0.7, rotate: -8, filter: 'blur(12px)' },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                filter: 'blur(0px)',
                transition: {
                  type: 'spring',
                  stiffness: 60,
                  damping: 18,
                  delay: 0.1,
                },
              },
            }}
          >
            <motion.div
              initial="hidden"
              animate={hasShownPartnersTitle ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, x: -120, scale: 0.6, rotate: -12, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  rotate: 0,
                  filter: 'blur(0px)',
                  transition: {
                    type: 'spring',
                    stiffness: 80,
                    damping: 16,
                    delay: 0.25,
                  },
                },
              }}
              className="align-middle mr-6"
            >
              <SmoothFrameAnimation
                images={animation2Frames}
                baseFps={60}
                speedRanges={[{ startIndex: 7, endIndex: 76, multiplier: 2.8 }]}
                // Repeat frames IMG_6519..IMG_6523 (indices 84..88) three times total
                loopSegments={[{ startIndex: 84, endIndex: 88, times: 3 }]}
                width="400px"
                height="400px"
              />
            </motion.div>
            <motion.span
              className="text-center leading-none text-[#ffc700]"
              initial="hidden"
              animate={hasShownPartnersTitle ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.35 },
                },
              }}
            >
              {['Н', 'а', 'ш', 'и'].map((l, i) => (
                <motion.span
                  key={l + i}
                  style={{ display: 'inline-block', color: '#ffc700' }}
                  initial={{ opacity: 0, y: 60, scale: 0.7, rotate: -10 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                >{l}</motion.span>
              ))}
              <br />
              {['П', 'а', 'р', 'т', 'н', 'ё', 'р', 'ы'].map((l, i) => (
                <motion.span
                  key={l + i + 10}
                  style={{ display: 'inline-block', color: '#ffc700' }}
                  initial={{ opacity: 0, y: 80, scale: 0.7, rotate: 10 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 90, damping: 14 }}
                >{l}</motion.span>
              ))}
            </motion.span>
          </motion.h2>
        </div>
        {/* Передаём другой id, чтобы избежать дубликатов */}
        <div className='scale-80 md:scale-100'>
          <LogoCarousel sectionId="partners-carousel" active={hasShownPartners} />
        </div>

        {/* Supplier description below carousel */}
        <motion.div
          className="supplier-note text-center font-furore text-xl md:text-3xl px-4 mt-24 mx-auto"
          style={{ maxWidth: 900, color: '#888888' }}
          initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
          animate={hasShownPartners ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.6 }}
        >
          Наши поставщики — люди, которые знают, как выглядит идеальная полка. И даже если вы не знаете, они всё равно привезут лучшее!
        </motion.div>
      </div>
      <div className="contacts-form-columns container mx-auto grid grid-cols-1 md:grid-cols-1 gap-10 items-stretch">
        <div className="flex justify-center items-center " style={{ marginBottom: '200px' }}>
          <ContactInfoSection sectionId="contacts" />
        </div>
        <div className="flex justify-center items-center " style={{ marginTop: '100px' }}>
          <ContactFormSection sectionId="order-form" />
        </div>
      </div>
    </div>
  );
}

function MiniSectionsFlyout({ startAnimation, buttonCenter, containerRef, teamMembers, onBack }: {
  startAnimation: boolean;
  buttonCenter: { x: number, y: number } | null;
  containerRef: React.RefObject<HTMLDivElement>;
  teamMembers: Testimonial[];
  onBack: () => void;
}) {
  const [finalPositions, setFinalPositions] = useState([
    { x: 0, y: 0, scale: 0.8, rotate: -10 },
    { x: 0, y: 0, scale: 1.15, rotate: 8 },
    { x: 0, y: 0, scale: 0.95, rotate: 0 },
  ]);
  const [containerRect, setContainerRect] = useState<{ left: number, top: number, width: number, height: number } | null>(null);
  const [openedMiniIndex, setOpenedMiniIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerRect(rect);
      setFinalPositions([
        { x: rect.width * 0.28, y: rect.height * 0.18, scale: 0.7, rotate: -8 },
        { x: rect.width * 0.52 + 150, y: rect.height * 0.13, scale: 1.0, rotate: 6 },
        { x: rect.width * 0.40 + 260, y: rect.height * 0.38 + 370, scale: 0.85, rotate: 16 },
      ]);
    }
  }, [containerRef, startAnimation]);

  if (!buttonCenter || !containerRect) return null;

  const containerX = containerRect.left + window.scrollX;
  const containerY = containerRect.top + window.scrollY;
  const startX = buttonCenter.x - containerX;
  const startY = buttonCenter.y - containerY;

  const sections = [
    { mini: <ServicesSection key="services-mini" mini={true} />, full: <ServicesSection key="services-full" /> },
    { mini: <AnimatedTestimonials key="team-mini" testimonials={teamMembers} autoplay={false} className="py-0 md:py-0" mini={true} />, full: <AnimatedTestimonials key="team-full" testimonials={teamMembers} autoplay={false} className="py-0 md:py-0" /> },
  ];

  return (
    <div className="absolute inset-0 z-30">
      <div className="absolute inset-0 pointer-events-none" />
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial={{
            position: 'absolute',
            left: startX,
            top: startY,
            opacity: 0,
            scale: 0.3,
            rotate: 0,
            zIndex: 10,
          }}
          animate={startAnimation ? {
            left: finalPositions[i].x,
            top: finalPositions[i].y,
            opacity: 1,
            scale: finalPositions[i].scale,
            rotate: openedMiniIndex === i ? 0 : finalPositions[i].rotate,
            zIndex: 30,
            position: 'absolute',
            transition: { type: 'spring', stiffness: 70, damping: 16, delay: i * 0.08 },
          } : {}}
          style={{
            width: openedMiniIndex === i ? 800 : 160,
            maxWidth: openedMiniIndex === i ? '90vw' : '60vw',
            ...(openedMiniIndex === i ? { margin: '0 auto' } : {}),
            minHeight: openedMiniIndex === i ? 260 : 80,
            pointerEvents: 'auto',
            zIndex: openedMiniIndex === i ? 50 : 30,
            boxShadow: openedMiniIndex === i ? '0 8px 32px rgba(0,0,0,0.25)' : undefined,
            cursor: 'pointer',
          }}
          onClick={() => {
            if (openedMiniIndex === i) setOpenedMiniIndex(null);
            else setOpenedMiniIndex(i);
          }}
        >
          {openedMiniIndex === i ? section.full : section.mini}
        </motion.div>
      ))}
      <div className="w-full flex justify-center mt-8 absolute left-0 right-0" style={{ top: `calc(${finalPositions[0].y + 40}px)` }}>
        <Button
          onClick={() => {
            setOpenedMiniIndex(null);
            onBack();
          }}
          className="btn btn--primary bg-accent text-primary-foreground hover:bg-accent/90 cursor-pointer"
          aria-label="Закрыть мини-разделы"
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
}

