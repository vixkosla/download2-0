'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useMotionValue, useTransform, animate } from 'framer-motion';
import { Globe, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 2L11 13"></path>
    <path d="M22 2L15 22l-4-9-9-4 20-6z"></path>
  </svg>
);

interface LogoData {
  src: string;
  alt: string;
  dataAiHint?: string;
  height?: number;
  width?: number;
  websiteUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
}

const logos: LogoData[] = [
  {
    src: '/images/logo/logo1.png',
    alt: 'BestMebel',
    width: 994,
    height: 200,
    websiteUrl: 'https://www.bestmebelshop.ru/',
    instagramUrl: 'https://www.instagram.com/bestmebelshop.ru/',
    telegramUrl: 'https://t.me/bestmebelshop',
  },
  {
    src: '/images/logo/logo2.png',
    alt: 'Volhov',
    width: 975,
    height: 200,
    websiteUrl: 'https://volhovamebel.ru/',
    },
  {
    src: '/images/logo/logo3.png',
    alt: 'Divan',
    width: 924,
    height: 200,
    websiteUrl: 'https://www.divan.ru/',
    instagramUrl: 'https://www.instagram.com/official_divan_ru/',
    telegramUrl: 'https://t.me/officialdivanru',
  },
  {
    src: '/images/logo/logo17.png',
    alt: 'hoff',
    width: 404,
    height: 200,
    websiteUrl: 'https://hoff.ru',
  },
  {
    src: '/images/logo/logo5.png',
    alt: 'lazurit',
    width: 1349,
    height: 200,
    websiteUrl: 'https://lazurit.com/',
  },
  {
    src: '/images/logo/logo6.png',
    alt: 'lemanapro',
    width: 697,
    height: 200,
    websiteUrl: 'https://lemanapro.ru/',
  },
  {
    src: '/images/logo/logo7.png',
    alt: 'ld',
    width: 746,
    height: 200,
    websiteUrl: 'https://lubidom.ru/',
  
  },
  {
    src: '/images/logo/logo8.png',
    alt: 'maxidom',
    width: 586,
    height: 200,
    websiteUrl: 'https://www.maxidom.ru',
    instagramUrl: 'https://t.me/maxidom',
  },
  {
    src: '/images/logo/logo9.png',
    alt: 'mnogomebeli',
    width: 398,
    height: 200,
    websiteUrl: 'https://mnogomebeli.com/',
    instagramUrl: 'https://t.me/mnogomebeliofficial',

  },
  {
    src: '/images/logo/logo10.png',
    alt: '3+2',
    width: 699,
    height: 200,
    websiteUrl: 'https://mf78.ru',
  },
  {
    src: '/images/logo/logo11.png',
    alt: 'nonton',
    width: 1248,
    height: 200,
    websiteUrl: 'https://nonton.ru/',
    instagramUrl: 'https://www.instagram.com/nonton_mebel',
    telegramUrl: 'https://t.me/nonton_mebel',
  },
  {
    src: '/images/logo/logo12.png',
    alt: 'pm',
    width: 1424,
    height: 200,
    websiteUrl: 'https://spb.pm.ru',

  },
  {
    src: '/images/logo/logo13.png',
    alt: 'robust',
    width: 1385,
    height: 200,
    websiteUrl: 'https://vk.com/robust_spb',
    },
  {
    src: '/images/logo/logo14.png',
    alt: 'stolplit',
    width: 1369,
    height: 200,
    websiteUrl: 'https://spb.stolplit.ru/',
  },
  {
    src: '/images/logo/logo15.png',
    alt: 'brw',
    width: 1051,
    height: 200,
    websiteUrl: 'https://brw.ru/',

  },
  {
    src: '/images/logo/logo16.png',
    alt: 'maria',
    width: 681,
    height: 200,
    websiteUrl: 'https://www.marya.ru',
    telegramUrl: 'https://t.me/mf_marya',
  },
  {
    src: '/images/logo/logo4.png',
    alt: 'dsv',
    width: 580,
    height: 200,
    websiteUrl: 'https://dsv-mebel.ru/',
  },
  {
    src: '/images/logo/logo18.png',
    alt: 'shatura',
    width: 905,
    height: 200,
    websiteUrl: 'https://www.shatura.com/',
  },
  {
    src: '/images/logo/logo19.png',
    alt: 'mrdors',
    width: 486,
    height: 200,
    websiteUrl: 'https://www.mrdoors.ru/',
    telegramUrl: 'https://t.me/mrdoors_russia',
  },
  {
    src: '/images/logo/logo20.png',
    alt: 'olisys',
    width: 512,
    height: 200,
    websiteUrl: 'https://olissys.com/',
  },
];

interface LogoCarouselProps {
  sectionId?: string;
  active?: boolean; // новый проп для анимации
}

// Удаляю AnimatedRuler

export function LogoCarousel({ sectionId, active = false }: LogoCarouselProps) {
  const x = useMotionValue(0);
  // Боковой буфер слева/справа (динамический: на мобилке меньше)
  const [sideBuffer, setSideBuffer] = useState(500);
  const [isDragging, setIsDragging] = useState(false);
  // Убираем лишние дубликаты — оставляем только одну копию массива логотипов
  const duplicated = logos;
  // Limit background shift so texture stays in view (avoids huge offsets where browsers stop repeating)
  const [textureWidth, setTextureWidth] = useState(1024);  // Default value, will be updated after image loads
  // Ensure we always return a non-negative offset (some browsers drop the texture when the value is
  // negative and the image is set to repeat). We take a safe modulo that wraps into
  // the 0‥textureWidth range.
  const backgroundPositionX = useTransform(x, (latestX) => {
    const width = textureWidth > 0 ? textureWidth : 1024;
    // JS % operator can return negative numbers. Convert into the positive 0‥width-1 interval.
    const safeOffset = ((latestX % width) + width) % width;
    return `${safeOffset}px`;
  });
  const [containerWidth, setContainerWidth] = useState(0); // общая ширина трека
  const [visibleWidth, setVisibleWidth] = useState(0);      // ширина видимой области
  const trackRef = useRef<HTMLDivElement>(null);
  const BASE_DURATION = 120; // секунд на полную ленту (ещё медленнее)
  const socialIconStyle = { width: 60, height: 60 };
  const animationInstance = useRef<any>(null);
  const OVERSHOOT = 60; // пикселей дополнительного хода за край для «iOS-bounce»
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // --- Новое для эффекта планшета ---
  const [isHovered, setIsHovered] = useState(false);
  // Track mouse position without triggering React re-renders
  const mouseRef = useRef({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  // Для плавного анимирования transform
  const scale = useMotionValue(1);
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      // Возвращаем позицию плавно, когда курсор покидает секцию
      animate(translateX, 0, { duration: 0.45, ease: 'easeOut' });
      animate(translateY, 0, { duration: 0.45, ease: 'easeOut' });
    }
  }, [isHovered, translateX, translateY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y }; // stored for potential future use without re-render
    // Центрируем смещение относительно центра секции
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Чем дальше от центра, тем больше смещение (ограничим до 30px)
    const maxOffset = 30;
    const offsetX = ((x - centerX) / centerX) * maxOffset;
    const offsetY = ((y - centerY) / centerY) * maxOffset;
    // Перемещаем ленту вслед за мышью. Масштаб изменяется один раз при наведении.
    translateX.set(offsetX);
    translateY.set(offsetY);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
    // Плавно увеличиваем масштаб лишь один раз при входе курсора.
    animate(scale, 1.06, { duration: 0.35, ease: 'easeOut' });
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Возвращаем масштаб в исходное состояние
    animate(scale, 1, { duration: 0.45, ease: 'easeOut' });
  };
  // --- конец нового ---

  useEffect(() => {
    // Вычисляем фактическую ширину одной копии логотипов
    const copiesCount = duplicated.length / logos.length; // сколько раз продублирован массив
    const updateWidth = () => {
      if (trackRef.current) {
        const fullWidth = trackRef.current.scrollWidth || trackRef.current.offsetWidth;
        setContainerWidth(fullWidth / copiesCount);
        // ширина видимой области = ширина секции (родителя)
        const parentWidth = trackRef.current.parentElement?.clientWidth || 0;
        // динамически считаем буфер в зависимости от ширины экрана
        const isMobileNow = window.innerWidth <= 640;
        const localBuffer = isMobileNow ? 16 : 500;
        setIsMobile(isMobileNow);
        setSideBuffer(localBuffer);
        // видимая часть меньше ширины секции на два буфера
        setVisibleWidth(Math.max(parentWidth - localBuffer * 2, 0));
      }
    };

    // Обновляем при монтировании
    updateWidth();

    // Отслеживаем изменения размеров (например, после загрузки изображений)
    const resizeObserver = new ResizeObserver(() => updateWidth());
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    // Также реагируем на ресайз окна
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const img = document.createElement('img');
    img.src = '/images/partners/IMG_6107.jpg';
    img.onload = () => {
      setTextureWidth(img.width);
    };
  }, []);

  // Запуск анимации только после того, как известна ширина ленты
  useEffect(() => {
    if (containerWidth > 0) {
      startAnimation(x.get(), direction);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth, direction]);

  // Функция для маятниковой автопрокрутки
  const startAnimation = (fromX: number, dir: 'forward' | 'backward') => {
    if (!containerWidth) return;
    const maxShift = Math.max(containerWidth - visibleWidth, 0); // расстояние до появления последнего логотипа
    let toX = dir === 'forward' ? -maxShift : 0;
    const distance = Math.abs(toX - fromX);
    const duration = (distance / containerWidth) * BASE_DURATION;
    if (animationInstance.current) {
      animationInstance.current.stop();
    }
    animationInstance.current = animate(x, toX, {
      type: 'tween',
      ease: 'linear',
      duration,
      onComplete: () => {
        setDirection((prev) => (prev === 'forward' ? 'backward' : 'forward'));
      },
    });
  };

  // Прокрутка по стрелкам
  const handlePrevClick = () => {
    if (!containerWidth) return;
    const logoWidth = containerWidth / logos.length;
    const delta = logoWidth; // на 1 логотип вправо (лента смещается влево)
    x.stop();
    // Новая позиция, допускаем overshoot для bounce
    const rawTarget = x.get() + delta;
    const target = rawTarget > 0 ? Math.min(OVERSHOOT, rawTarget) : rawTarget;
    // Фиксируем новое направление
    setDirection('backward');
    animate(x, target, {
      type: 'tween',
      ease: 'linear',
      duration: 0.7,
      onComplete: () => {
        // Если мы ушли в overshoot, подпружиним назад
        const maxShift = Math.max(containerWidth - visibleWidth, 0);
        if (target > 0) {
          animate(x, 0, {
            type: 'spring',
            stiffness: 300,
            damping: 22,
            onComplete: () => startAnimation(0, 'backward'),
          });
        } else {
          startAnimation(target, 'backward');
        }
      },
    });
  };
  const handleNextClick = () => {
    if (!containerWidth) return;
    const logoWidth = containerWidth / logos.length;
    const delta = -logoWidth; // на 1 логотип влево (лента смещается вправо)
    x.stop();
    // Новая позиция, допускаем overshoot для bounce
    const maxShift = Math.max(containerWidth - visibleWidth, 0);
    const rawTarget = x.get() + delta;
    const target = rawTarget < -maxShift ? Math.max(-(maxShift + OVERSHOOT), rawTarget) : rawTarget;
    // Фиксируем новое направление
    setDirection('forward');
    animate(x, target, {
      type: 'tween',
      ease: 'linear',
      duration: 0.7,
      onComplete: () => {
        if (target < -maxShift) {
          animate(x, -maxShift, {
            type: 'spring',
            stiffness: 300,
            damping: 22,
            onComplete: () => startAnimation(-maxShift, 'forward'),
          });
        } else {
          startAnimation(target, 'forward');
        }
      },
    });
  };

  const renderSocialIcon = (url: string | undefined, IconComponent: React.ElementType, label: string) => {
    const isActive = url && url !== '#';
    const iconClasses = 'w-5 h-5 sm:w-6 sm:h-6';
    if (isActive) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <IconComponent className={iconClasses} />
        </a>
      );
    }
    return (
      <span className="opacity-50 cursor-not-allowed">
        <IconComponent className={iconClasses} />
      </span>
    );
  };

  return (
    <motion.section
      id={sectionId}
      ref={sectionRef}
      animate={active ? {
        // Сначала летим вверх с увеличенным масштабом, затем zoom-out до нормального
        y: [1000, 0],       // пролетаем путь ~1000px до финальной позиции
        scale: [1.5, 1.5, 1.0],    // держим крупный размер и только в конце уменьшаем
        opacity: [0, 0.9, 1],
      } : {
        y: 1000,
        scale: 1.5,   // начальное состояние — увеличенный размер
        rotateX: 0,
        opacity: 0,
      }}
      transition={{
        y:      { duration: 0.35, ease: [0.42, 0, 0.58, 1] },
        scale:  { duration: 0.35, ease: [0.42, 0, 0.58, 1] },
        opacity:{ duration: 0.20, ease: 'linear' },
      }}
      className="w-screen h-[130px] sm:h-[200px] overflow-hidden relative partners-carousel z-[30000]"
      style={{
        backgroundImage: "url('/images/partners/IMG_6107.jpg')",
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
        backgroundPositionY: 'bottom',
        backgroundColor: '#2D1B3B',
        backgroundPositionX,
        paddingLeft: sideBuffer,
        paddingRight: sideBuffer,
        transform: 'none',
        scale,
        x: translateX,
        y: translateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Кастомные стрелки */}
      <button
        onClick={handlePrevClick}
        className={
          `carousel-arrow-prev absolute top-1/2 -translate-y-1/2 z-50 w-[60px] h-[60px] md:w-[80px] md:h-[80px] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[36px] md:before:w-[48px] before:h-[36px] md:before:h-[48px] before:border-l-[5px] before:border-b-[5px] before:border-yellow-500 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:origin-center hover:before:border-yellow-400 focus:outline-none transition-transform duration-150 hover:scale-125 ` +
          (isHovered ? ' left-[370px] md:left-[370px]' : ' left-[15px] md:left-[40px]')
        }
        style={{ filter: 'drop-shadow(0 0 8px #ffc700)' }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(2.5) drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099)'}
        onMouseLeave={e => e.currentTarget.style.filter = 'drop-shadow(0 0 8px #ffc700)'}
        aria-label="Previous slide"
      />
      <button
        onClick={handleNextClick}
        className={
          `carousel-arrow-next absolute top-1/2 -translate-y-1/2 z-50 w-[60px] h-[60px] md:w-[80px] md:h-[80px] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[36px] md:before:w-[48px] before:h-[36px] md:before:h-[48px] before:border-l-[5px] before:border-b-[5px] before:border-yellow-500 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-[135deg] before:origin-center hover:before:border-yellow-400 focus:outline-none transition-transform duration-150 hover:scale-125 ` +
          (isHovered ? ' right-[370px] md:right-[370px]' : ' right-[15px] md:right-[40px]')
        }
        style={{ filter: 'drop-shadow(0 0 8px #ffc700)' }}
        onMouseEnter={e => e.currentTarget.style.filter = 'brightness(2.5) drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099)'}
        onMouseLeave={e => e.currentTarget.style.filter = 'drop-shadow(0 0 8px #ffc700)'}
        aria-label="Next slide"
      />
      <motion.div
        ref={trackRef}
        className="absolute bottom-0 flex gap-16 sm:gap-32 w-max z-20 cursor-grab active:cursor-grabbing"
        style={{ x, touchAction: 'pan-y' }}
        drag="x"
        dragConstraints={{ left: -(Math.max(containerWidth - visibleWidth, 0) + OVERSHOOT), right: OVERSHOOT }}
        onDragStart={() => {
          x.stop();
          setIsDragging(true);
        }}
        onDragEnd={() => {
          setIsDragging(false);
          // Эффект «резинки» при выходе за пределы
          let currentX = x.get();
          const maxShift = Math.max(containerWidth - visibleWidth, 0);
          if (currentX > 0) {
            // выехали правее края → bounce назад
            animate(x, 0, {
              type: 'spring',
              stiffness: 300,
              damping: 22,
              onComplete: () => startAnimation(0, direction),
            });
          } else if (currentX < -maxShift) {
            // выехали левее края → bounce назад
            animate(x, -maxShift, {
              type: 'spring',
              stiffness: 300,
              damping: 22,
              onComplete: () => startAnimation(-maxShift, direction),
            });
            currentX = -maxShift;
          } else {
            // В пределах нормы — продолжаем обычную анимацию
            startAnimation(currentX > -maxShift ? currentX : -maxShift, direction);
          }
        }}
        onMouseEnter={() => {
          if (animationInstance.current) {
            animationInstance.current.stop();
          }
          x.stop();
        }}
        onMouseLeave={() => {
          startAnimation(x.get(), direction);
        }}
      >
        {duplicated.map((logo, index) => {
          const factor = isMobile ? 0.5 : 0.6;
          const scaledWidth = logo.width ? Math.round(logo.width * factor) : undefined;
          const scaledHeight = logo.height ? Math.round(logo.height * factor) : undefined;
          return (
            <div
              key={index}
              className="flex-shrink-0 flex items-center justify-center h-[130px] sm:h-[200px] cursor-pointer group relative min-w-[160px] sm:min-w-[240px]"
            >
              {logo.websiteUrl ? (
                <a 
                  href={logo.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform duration-150 hover:scale-110"
                  onMouseDown={e => e.stopPropagation()}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={scaledWidth}
                    height={scaledHeight}
                    className={cn('grayscale hover:grayscale-0 transition-all duration-300 object-contain')}
                    data-ai-hint={logo.dataAiHint}
                    style={{ pointerEvents: 'auto' }}
                    draggable={false}
                  />
                </a>
              ) : (
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={scaledWidth}
                  height={scaledHeight}
                  className={cn('peer grayscale group-hover:grayscale-0 peer-hover:grayscale-0 transition-all duration-300 object-contain')}
                  data-ai-hint={logo.dataAiHint}
                  style={{ pointerEvents: 'auto' }}
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </motion.div>
      {/* Добавляем верхнюю и нижнюю границу */}
      <div className="top-border absolute top-0 left-0 w-full h-[3px] bg-transparent" />
      <div className="bottom-border absolute bottom-0 left-0 w-full h-[3px] bg-transparent" />

      <style jsx global>{`
        .partners-carousel {
          transition: box-shadow 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        
        /* При ховере подсвечиваем рамку и добавляем глубокую тень */
        .partners-carousel:hover {
          box-shadow: 0 0 12px 4px #ffc70099, 24px 32px 64px 0 rgba(0,0,0,0.95);
        }
        
        .partners-carousel .top-border,
        .partners-carousel .bottom-border {
          background-color: transparent;
          transition: background-color 0.25s ease, box-shadow 0.25s ease;
        }
        
        .partners-carousel:hover .top-border {
          background-color: #ffc700;
          box-shadow: 
            0 -5px 10px 1px rgba(255, 199, 0, 0.9),
            0 -10px 20px 2px rgba(255, 199, 0, 0.7),
            0 -15px 30px 3px rgba(255, 199, 0, 0.5),
            0 -20px 40px 4px rgba(255, 199, 0, 0.3);
        }

        .partners-carousel:hover .bottom-border {
          background-color: #ffc700;
          box-shadow: 
            0 5px 10px 1px rgba(255, 199, 0, 0.9),
            0 10px 20px 2px rgba(255, 199, 0, 0.7),
            0 15px 30px 3px rgba(255, 199, 0, 0.5),
            0 20px 40px 4px rgba(255, 199, 0, 0.3);
        }
      `}</style>
    </motion.section>
  );
}
