import React, { useRef, useEffect } from 'react';
import CosmicNebulaMastercard from '@/components/ui/cursor-wander-card';
import { motion, useMotionValue, useSpring, useTransform, animate, useInView } from 'framer-motion';

export const ContactInfoSection: React.FC<{ sectionId?: string }> = ({ sectionId = 'contacts' }) => {
  // Motion values реагируют на положение курсора
  const transX = useMotionValue(0);
  const transY = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const smoothX = useSpring(transX, { stiffness: 120, damping: 18 });
  const smoothY = useSpring(transY, { stiffness: 120, damping: 18 });
  const smoothTiltX = useSpring(tiltX, { stiffness: 140, damping: 22 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 140, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const AMP_T = 20; // px translation
      const AMP_TILT = 10; // degrees tilt
      transX.set(nx * AMP_T);
      transY.set(ny * AMP_T);
      tiltX.set(ny * AMP_TILT);
      tiltY.set(-nx * AMP_TILT);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [transX, transY, tiltX, tiltY]);

  // Независимые коэффициенты для параграфов
  const factors = [1, 0.8, 1.2, 0.6];
  const xVals = factors.map((f) => useTransform(smoothX, (v) => v * f));
  const yVals = factors.map((f) => useTransform(smoothY, (v) => v * f));
  const tiltXVals = factors.map((f) => useTransform(smoothTiltX, (v) => v * f));
  const tiltYVals = factors.map((f) => useTransform(smoothTiltY, (v) => v * f));
  // Плавающие оффсеты для мягкого вертикального «дыхания»
  const floatOffsets = factors.map(() => useMotionValue(0));
  const combinedYVals = factors.map((_, idx) =>
    useTransform([yVals[idx], floatOffsets[idx]], ([cursorY, floatY]) => (cursorY as number) + (floatY as number))
  );
  // Запускаем бесконечную анимацию «плавания» один раз
  useEffect(() => {
    const controls = floatOffsets.map((offset, i) =>
      animate(offset, [0, -8, 0, 8, 0], {
        duration: 12 - i, // разные скорости: 12,11,10,9
        repeat: Infinity,
        ease: 'easeInOut',
      })
    );
    return () => controls.forEach((c) => c.stop && c.stop());
  }, []);

  // Уникальная одноразовая анимация заголовка: 3D flip + underline sweep
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.6 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageInView = useInView(imageRef, { once: true, amount: 0.6 });

  return (
  <div
    id={sectionId}
    className="contact-info-section w-full flex flex-col gap-8 pt-10"
  >
    <h2
      ref={titleRef}
      className="section-title text-accent text-center mb-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
      style={{ position: 'relative' }}
    >
      <span
        className="flex flex-col items-center md:items-start leading-tight text-center md:text-left"
        style={{ position: 'relative', transformStyle: 'preserve-3d', perspective: 800 }}
      >
        <motion.span
          className="text-3xl sm:text-5xl md:text-8xl text-yellow-400"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: titleInView ? 0 : 90, opacity: titleInView ? 1 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'bottom center' }}
        >
          Наши
        </motion.span>
        <motion.span
          className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] text-yellow-400"
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: titleInView ? 0 : 90, opacity: titleInView ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          style={{ transformOrigin: 'bottom center' }}
        >
          контакты
        </motion.span>

        {/* underline sweep – пробежала и исчезла, без точки */}
        <motion.i
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            titleInView
              ? { scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15, times: [0, 0.6, 0.8, 1] }}
          style={{
            position: 'absolute',
            left: 0,
            bottom: -12,
            height: 6,
            width: '100%',
            background: 'linear-gradient(90deg, rgba(255,199,0,0.0) 0%, #ffc700 25%, #ffc700 75%, rgba(255,199,0,0.0) 100%)',
            transformOrigin: 'left center',
            borderRadius: 9999,
          }}
        />
      </span>
      {/* Контейнер изображения с материализацией из точек */}
      <span ref={imageRef as any} className="relative inline-block">
        <motion.img
          src="/animation_transparent_400.webp"
          alt="Анимация"
          width={400}
          height={400}
          className="block w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] object-contain"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={imageInView ? { opacity: 1, filter: 'blur(0px)' } : undefined}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
        />

        {/* Материализация из точек, волной слева направо, синхронно с линией */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={imageInView ? { opacity: [0, 1, 0] } : undefined}
          transition={{ duration: 1.6, times: [0, 0.45, 1], delay: 0.18 }}
        >
          {Array.from({ length: 14 * 10 }).map((_, idx) => {
            const cols = 14;
            const rows = 10;
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const left = `${((col + 0.5) / cols) * 100}%`;
            const top = `${((row + 0.5) / rows) * 100}%`;
            const size = 8; // px
            const delay = 0.18 + (col / cols) * 0.7 + (row / rows) * 0.08; // волна слева направо, чуть по диагонали
            return (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0 }}
                animate={imageInView ? { opacity: [0, 1, 0], scale: [0, 1, 0.6] } : undefined}
                transition={{ duration: 0.9, delay }}
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: size,
                  height: size,
                  marginLeft: -(size / 2),
                  marginTop: -(size / 2),
                  borderRadius: 9999,
                  background: '#ffc700',
                  filter: 'drop-shadow(0 0 6px rgba(255,199,0,0.55))',
                  mixBlendMode: 'screen',
                }}
              />
            );
          })}
        </motion.div>
      </span>
    </h2>
    <p className="text-center text-[#888888] text-xl md:text-3xl mb-6">работаем с 10 до 22</p>
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-between items-start">
        <div className="w-full max-w-[800px] mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
          <CosmicNebulaMastercard
          cardholderName="SHELF SBORKA"
          logoText={{ topText: "SHELF", bottomText: "SBORKA" }}
          phone="+7 (812) 317-22-00"
          whatsapp="+7 (921) 999-22-00"
          email="shelf.sborka.spb@gmail.com"
          instagram="SHELF_SBORKA_SPB"
          telegram="@SHELF_SBORKA_SPB"
          />
          </motion.div>
        </div>
        {/* Информация о способах связи */}
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="w-full max-w-[1000px] text-[#888888] font-furore text-2xl md:text-3xl leading-relaxed space-y-4"
          style={{ perspective: '800px' }}
        >
        <motion.p
          style={{ x: xVals[0], y: combinedYVals[0], rotateX: tiltXVals[0], rotateY: tiltYVals[0], transformStyle: 'preserve-3d' }}
        >
          Оставьте заявку любым удобным способом — мы ответим в течение рабочего
          дня и предложим ближайшее время для выезда мастеров.
        </motion.p>
        <motion.p
          style={{ x: xVals[1], y: combinedYVals[1], rotateX: tiltXVals[1], rotateY: tiltYVals[1], transformStyle: 'preserve-3d' }}
        >
          Звонок по телефону поможет оперативно уточнить стоимость и согласовать
          время приезда.
        </motion.p>
        <motion.p
          style={{ x: xVals[2], y: combinedYVals[2], rotateX: tiltXVals[2], rotateY: tiltYVals[2], transformStyle: 'preserve-3d' }}
        >
          В WhatsApp или Telegram удобно отправить фотографии мебели — так мы
          заранее подберём нужные крепежи и инструмент.
        </motion.p>
        <motion.p
          style={{ x: xVals[3], y: combinedYVals[3], rotateX: tiltXVals[3], rotateY: tiltYVals[3], transformStyle: 'preserve-3d' }}
        >
          Для подробных технических заданий или коммерческих предложений пишите
          на почту — менеджер быстро подготовит документы.
        </motion.p>
        </motion.div>
        {/* Анимация перенесена к заголовку */}
      </div>
    </div>
  </div>
  );
};
