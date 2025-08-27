'use client';

import React from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { SmoothFrameAnimation } from '@/components/ui/smooth-frame-animation';
import { animation4Frames } from '@/lib/animation4Frames';

interface InteractivePriceGalleryProps {
  sectionId?: string;
}

export const InteractivePriceGallery: React.FC<InteractivePriceGalleryProps> = ({
  sectionId,
}) => {
  // Sentinel для надёжного триггера анимаций в Chrome (элемент не клипится)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const reveal = useInView(sentinelRef, { once: true, amount: 0.2 });

  return (
    <section
      id={sectionId || 'pricing-gallery'}
      className="w-screen py-16 md:py-24 min-h-screen relative overflow-visible"
    >
      {/* Sentinel для IntersectionObserver */}
      <div ref={sentinelRef} style={{ position: 'absolute', top: '20vh', left: 0, width: 1, height: 1, pointerEvents: 'none', opacity: 0 }} />
      {/* Нижний слой: фон 7-1 и иконки */}
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/textures/7-1.PNG)',
            backgroundSize: '100% 78%',
            backgroundPosition: 'calc(50% + 50px) calc(50% - 130px)',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            willChange: 'clip-path, opacity, transform',
          }}
          initial={{ clipPath: 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)', opacity: 0.001 }}
          animate={reveal ? { clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)', opacity: 1 } : { clipPath: 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)', opacity: 0.001 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
        {/* Контент (заголовок, иконки) */}
        <div
          className="container mx-auto relative flex items-center justify-center"
          style={{ transform: 'translateY(-300px)' }}
        >
          <h2
            className="section-title text-[11rem] flex items-end justify-center gap-12 mb-12 md:mb-16 text-center"
            style={{ color: '#ffc700' }}
          >
            <motion.span
              className="font-furore text-accent leading-none"
              initial={{ x: -220, opacity: 0, rotate: -6, filter: 'blur(6px)' }}
              whileInView={{ x: 0, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.8, margin: '-25% 0px -25% 0px' }}
            >
              НАШИ
            </motion.span>
            <motion.div
              className="self-end"
              initial={{ y: -240, opacity: 0, rotate: 0, scale: 0.9, filter: 'blur(8px)' }}
              whileInView={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.8, margin: '-25% 0px -25% 0px' }}
            >
              <SmoothFrameAnimation
                images={animation4Frames}
                className="self-end"
                width={280}
                height={280}
                baseFps={43.2}
                speedRanges={[{ startIndex: 5, endIndex: 25, multiplier: 1.4 }]}
              />
            </motion.div>
            <motion.span
              className="font-furore text-accent leading-none"
              initial={{ x: 220, opacity: 0, rotate: 6, filter: 'blur(6px)' }}
              whileInView={{ x: 0, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.8, margin: '-25% 0px -25% 0px' }}
            >
              ЦЕНЫ
            </motion.span>
          </h2>
        </div>
        <motion.div
          className='w-[95vw] translate-x-[7vw] absolute top-0 left-0'
          style={{ willChange: 'clip-path, opacity, transform' }}
          initial={{ clipPath: 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)', opacity: 0.001 }}
          animate={reveal ? { clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)', opacity: 1 } : { clipPath: 'polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)', opacity: 0.001 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <AllIconsGallery />
        </motion.div>
      </div>
      {/* Верхний слой: рулон 7-2, край рулона и тень */}
      <motion.div
        className="absolute inset-0 overflow-visible z-10"
        style={{
          transformOrigin: 'left',
          pointerEvents: 'none',
        }}
        initial={{ x: 0, scaleX: 1 }} // Начальное состояние: полная ширина
        whileInView={{
          x: 'calc(100vw - min(15%, 100px))', // Сдвиг вправо на ширину экрана минус 15% или 200px
          scaleX: 0.5, // Уменьшение ширины в 2 раза в конце анимации
        }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Текстура бумаги (рулон) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '30%',
            maxWidth: '200px',
            height: '80%',
            backgroundImage: 'url(/images/textures/7-2.png)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'left center',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 1,
          }}
        />
        {/* Тень от рулона */}
        <div
          style={{
            position: 'absolute',
            top: '64%',
            left: 180,
            width: 60,
            height: 40,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 0%, #0003 60%, transparent 100%)',
            zIndex: 1,
            filter: 'blur(2px)',
            pointerEvents: 'none',
          }}
        />
        {/* 3. The shadow on the edge of the cover */}
        <div
          className="absolute top-0 bottom-0 h-4/5 w-24"
          style={{
            left: 200,
            background: 'linear-gradient(to right, hsla(var(--background), 1), hsla(var(--background), 0.9) 20%, hsla(0, 0%, 0%, 0.5) 80%, hsla(0, 0%, 0%, 0.8))',
          }}
        />
      </motion.div>
    </section>
  );
};

// Компонент иконки с тултипом
const PriceIconWithTooltip: React.FC = () => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer', width: 220, height: 300 }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={hovered ? 'open' : 'closed'}
          src={encodeURI(hovered ? '/app/шкаф-открыт.png' : '/app/шкаф-закрыт.png')}
          alt={hovered ? 'Шкаф открыт' : 'Шкаф закрыт'}
          width={220}
          height={300}
          style={{ position: 'absolute', transition: '0.2s' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.2 }}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/logo.svg';
          }}
        />
      </AnimatePresence>
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full bg-white border border-yellow-400 rounded-xl shadow-lg px-8 py-4 text-2xl font-furore text-yellow-500 z-20"
            style={{ minWidth: 180, marginTop: -30 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Цена от 2000 ₽
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Начало: Галерея иконок ---

const ICON_GROUPS = [
  {
    room: 'СПАЛЬНЯ',
    icons: [
      { name: 'Шкаф', closed: '/app/1-шкаф-закрыт.png', open: '/app/1-шкаф-открыт.png', price: 3500, small: false, large: false, offsetY: 0, translateY: 30, width: 115, height: 145 },
      { name: 'Тумбочка', closed: '/app/5-тумбочка-закрыта-с.png', open: '/app/5-тумбочка-открыта-с.png', price: 1200, small: false, large: false, offsetY: 0, translateY: 80, width: 80, height: 100 },
      { name: 'Кровать', closed: '/app/6-кровать-с.png', open: '/app/6-кровать-с.png', price: 8000, small: false, large: false, offsetY: 0, translateY: 30, width: 180, height: 160 },
    ],
  },
  {
    room: 'ДЕТСКАЯ',
    icons: [
      { name: '2 тумбочка-закрыта-телевизор', closed: '/app/2-тумбочка-закрыта-телевизор.png', open: '/app/2-тумбочка-открыта-телевизор.png', price: 1500, small: false, large: false, offsetY: 0, translateY: 20, width: 110, height: 140 },
      { name: '3 компстол с', closed: '/app/3-компстол-закрыт-с.png', open: '/app/3-компстол-открыт-с.png', price: 2500, small: false, large: false, offsetY: 0, translateY: 10, width: 190, height: 180 },
      // { name: '12 полка', closed: '/app/12-полка.png', price: 1800, small: false, large: false, offsetY: 10, width: 100, height: 40 },
      { name: '10-пенал-закрыт', closed: '/app/10-пенал-закрыт.png', open: '/app/10-пенал-открыт.png', price: 3000, small: false, large: false, offsetY: 0, translateY: 20, width: 110, height: 140 },
    ],
  },
  {
    room: 'ГОСТИНАЯ',
    icons: [
      { name: '4 кресло', closed: '/app/4-кресло.png', price: 2500, small: false, large: false, offsetY: 0, translateY: 55, width: 80, height: 160 },
      { name: '7 трехстворчатый', closed: '/app/7-трехствр-закрытый.png', open: '/app/7-трехствр-открытый.png', price: 6000, small: false, large: false, offsetY: 0, translateY: 37, width: 180, height: 160 },
    ],
  },
  {
    room: 'КУХНЯ',
    icons: [
      { name: '16 кухня без', closed: '/app/16-кухня-закрыта-без.png', open: '/app/16-кухня-открыта-без.png', price: 4000, small: false, large: false, offsetY: 0, translateY: 5, width: 230, height: 180 },
      { name: '11 стол и стулья', closed: '/app/11-стол-и-стулья.png', price: 3000, small: false, large: false, offsetY: 0, translateY: 23, width: 230, height: 180 },
    ],
  },
  {
    room: 'ПРИХОЖАЯ',
    icons: [
      { name: '9 прихожая без', closed: '/app/9-прихожая-закрыта-без.png', open: '/app/9-прихожая-открыта-без.png', price: 2800, small: false, large: false, offsetY: 0, translateY: 38, width: 120, height: 160 },
      { name: '9 прихожая с', closed: '/app/9-прихожая-закрыта-с.png', open: '/app/9-прихожая-открыта-с.png', price: 3200, small: false, large: false, offsetY: 0, translateY: 52, width: 120, height: 160 },
    ],
  },
  {
    room: '',
    icons: [
      { name: '8 диван', closed: '/app/8-диван.png', price: 7000, small: false, large: false, offsetY: 0, translateY: 70, width: 200, height: 120 },
      { name: '18 гостиная', closed: '/app/18-гостиная-закрыта-с.png', open: '/app/18-гостиная-открыта-с.png', price: 8000, small: false, large: false, offsetY: 0, translateY: 30, width: 220, height: 160 },
    ],
  },
];

const GalleryIcon: React.FC<{
  name: string;
  closed: string;
  open?: string;
  price?: number;
  onHover: (hovered: boolean, name: string) => void;
  large?: boolean;
  small?: boolean;
  offsetY?: number;
  translateY?: number;
  width?: number;
  height?: number;
}> = ({ name, closed, open, price, onHover, large, small, offsetY, translateY, width, height }) => {
  const [hovered, setHovered] = React.useState(false);
  React.useEffect(() => {
    onHover(hovered, name);
    // eslint-disable-next-line
  }, [hovered]);
  // Размеры иконки
  let ICON_WIDTH = width ?? 135;
  let ICON_HEIGHT = height ?? 165;
  if (large) {
    ICON_WIDTH = 520;
    ICON_HEIGHT = 280;
  } else if (small) {
    ICON_WIDTH = 240;
    ICON_HEIGHT = 240;
  }

  const src = encodeURI(open && hovered ? open : closed);

  const translate = (translateY ?? offsetY ?? 0);

  return (
    <div
      className="relative flex flex-col items-end justify-end m-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: open ? 'pointer' : 'default', width: ICON_WIDTH, height: ICON_HEIGHT }}
    >
      <div
        style={{
          width: ICON_WIDTH,
          height: ICON_HEIGHT,
          position: 'relative',
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'center',
          transform: `translateY(${translate}px)`,
          willChange: 'transform',
        }}
        className="transition-transform duration-200 md:scale-90"
      >
        {open ? (
          <img
            src={src}
            alt={name}
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
            style={{ position: 'absolute', left: 0, top: 0, width: ICON_WIDTH, height: ICON_HEIGHT, objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/logo.svg';
            }}
          />
        ) : (
          <motion.img
            src={encodeURI(closed)}
            alt={name}
            width={ICON_WIDTH}
            height={ICON_HEIGHT}
            style={{ position: 'absolute', left: 0, top: 0, width: ICON_WIDTH, height: ICON_HEIGHT, objectFit: 'contain', pointerEvents: 'none', userSelect: 'none' }}
            animate={hovered ? { x: [0, -8, 8, -8, 8, 0], rotate: [-7, 7, -7, 7, 0] } : { x: 0, rotate: 0 }}
            transition={hovered ? { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } : { duration: 0 }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/logo.svg';
            }}
          />
        )}
        {/* Цена (привязана к внутреннему контейнеру, который смещается translateY) */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: 0 }}
            exit={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 22, duration: 0.38 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '100%',
              transform: 'translate(-50%, 48px) scale(1)',
              color: 'white',
              fontSize: 20,
              fontFamily: 'Furore, sans-serif',
              fontWeight: 600,
              pointerEvents: 'none',
              textShadow: '0 2px 8px #0008',
              background: 'none',
              whiteSpace: 'nowrap',
              minHeight: 24,
              zIndex: 2,
            }}
          >
            {`от ${price ?? 2000} р`}
          </motion.div>
        )}
      </div>
      <div className="relative mt-44 text-center text-xs font-semibold w-full truncate" title={name}>{name}</div>
    </div>
  );
};

const AllIconsGallery: React.FC = () => {
  const [hoveredGroup, setHoveredGroup] = React.useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = React.useState<string | null>(null);

  const handleHover = (hovered: boolean, name: string) => {
    if (hovered) {
      setHoveredIcon(name);
    } else {
      setHoveredIcon(null);
    }
  };

  const handleGroupHover = (groupName: string) => {
    setHoveredGroup(groupName);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-[140px] md:gap-y-[80px] lg:gap-y-[60px] xl:gap-y-[80px] gap-x-[10px] py-1 px-0 place-items-center 
    translate-x-[-25px] translate-y-[-250px] scale-[0.7] 
    md:translate-x-[-50px] md:translate-y-[5px] md:scale-[0.85]
    lg:scale-[1.0]">
      {/* Первая строка: Спальня, Детская */}
      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-furore text-yellow-400 mb-8 text-center w-full tracking-wider z-20 relative min-h-[60px] flex items-center justify-center transition-all duration-200">
          {hoveredGroup === ICON_GROUPS[0].room && hoveredIcon ? hoveredIcon : ICON_GROUPS[0].room}
        </h3>
        <div className="flex flex-row items-end justify-center gap-[10px] w-full">
          {ICON_GROUPS[0].icons.map((icon) => (
            <GalleryIcon key={icon.name} {...icon} onHover={handleHover} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-furore text-yellow-400 mb-8 text-center w-full tracking-wider z-20 relative min-h-[60px] flex items-center justify-center transition-all duration-200">
          {hoveredGroup === ICON_GROUPS[1].room && hoveredIcon ? hoveredIcon : ICON_GROUPS[1].room}
        </h3>
        <div className="flex flex-row items-end justify-center gap-[0px] w-full">
          {ICON_GROUPS[1].icons.map((icon) => (
            <GalleryIcon key={icon.name} {...icon} onHover={handleHover} />
          ))}
        </div>
      </div>
      {/* Вторая строка: Кухня (центрировано) */}
      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-furore text-yellow-400 mb-8 text-center w-full tracking-wider z-20 relative min-h-[60px] flex items-center justify-center transition-all duration-200">
          {hoveredGroup === ICON_GROUPS[3].room && hoveredIcon ? hoveredIcon : ICON_GROUPS[3].room}
        </h3>
        <div className="flex flex-row items-end justify-center gap-[0px] w-full">
          {ICON_GROUPS[3].icons.map((icon) => (
            <GalleryIcon key={icon.name} {...icon} onHover={handleHover} />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-furore text-yellow-400 mb-8 text-center w-full tracking-wider z-20 relative min-h-[60px] flex items-center justify-center transition-all duration-200">
          {hoveredGroup === ICON_GROUPS[4].room && hoveredIcon ? hoveredIcon : ICON_GROUPS[4].room}
        </h3>
        <div className="flex flex-row items-end justify-center gap-[0px] w-full">
          {ICON_GROUPS[4].icons.map((icon) => (
            <GalleryIcon key={icon.name} {...icon} onHover={handleHover} />
          ))}
        </div>
      </div>

      {/* Вторая строка: Гостиная, Прихожая */}
      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-furore text-yellow-400 mb-8 text-center w-full tracking-wider z-20 relative min-h-[60px] flex items-center justify-center transition-all duration-200">
          {hoveredGroup === ICON_GROUPS[2].room && hoveredIcon ? hoveredIcon : ICON_GROUPS[2].room}
        </h3>
        <div className="flex flex-row items-end justify-center gap-[0px] w-full">
          {ICON_GROUPS[2].icons.map((icon) => (
            <GalleryIcon key={icon.name} {...icon} onHover={handleHover} />
          ))}
        </div>
      </div>

            <div className="flex flex-col items-center">
        <h3 className="text-3xl font-furore text-yellow-400 mb-8 text-center w-full tracking-wider z-20 relative min-h-[60px] flex items-center justify-center transition-all duration-200">
          {hoveredGroup === ICON_GROUPS[5].room && hoveredIcon ? hoveredIcon : ICON_GROUPS[5].room}
        </h3>
        <div className="flex flex-row items-end justify-center gap-[0px] w-full">
          {ICON_GROUPS[5].icons.map((icon) => (
            <GalleryIcon key={icon.name} {...icon} onHover={handleHover} />
          ))}
        </div>
      </div>
    </div>
  );
};