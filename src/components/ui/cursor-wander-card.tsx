"use client"

import * as React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Phone, Mail, Instagram, Send, MessageCircle } from 'lucide-react'
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface CosmicNebulaMastercardProps {
  cardholderName?: string
  className?: string
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    glowColor?: string
  }
  logoText?: {
    topText?: string
    bottomText?: string
  }
  height?: string | number
  width?: string | number
  phone?: string
  whatsapp?: string
  email?: string
  instagram?: string
  telegram?: string
}

const CosmicNebulaMastercard: React.FC<CosmicNebulaMastercardProps> = ({
  cardholderName = "CARDHOLDER NAME",
  className = "",
  theme = {
    primaryColor: "#0FA0CE", // Enhanced bright blue
    secondaryColor: "#0056b3", // Deep space blue
    glowColor: "rgba(15, 160, 206, 0.8)", // Enhanced bright blue glow
  },
  logoText = { topText: "NEBULA", bottomText: "FLUX" },
  height = undefined,
  width = undefined,
  phone,
  whatsapp,
  email,
  instagram,
  telegram,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [time, setTime] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number>(0)
  const timeAnimationRef = useRef<number>(0)
  const rotationRef = useRef({ x: 15, y: 20, z: 5 })
  const rotationSpeedRef = useRef({ x: 0.2, y: 0.3, z: 0.05 })
  const [flipped, setFlipped] = useState(false)
  const [activeBounceBullet, setActiveBounceBullet] = useState(0)
  const isHoveredRef = useRef(false)
  const flippedRef = useRef(false)
  // Для подсветки текста
  const [hoveredText, setHoveredText] = useState<string | null>(null)
  // Для плавного поворота
  const targetRotation = useRef({ x: 0, y: 0, z: 0 })
  const currentRotation = useRef({ x: 0, y: 0, z: 0 })
  const smoothAnimationRef = useRef<number>(0)
  // Для иконок
  const iconCount = 12
  // Фиксированные позиции по сетке 3x4 (4 столбца, 3 строки)
  const iconGrid = [
    { top: 15, left: 15 }, { top: 15, left: 40 }, { top: 15, left: 65 }, { top: 15, left: 85 },
    { top: 40, left: 15 }, { top: 40, left: 40 }, { top: 40, left: 65 }, { top: 40, left: 85 },
    { top: 70, left: 15 }, { top: 70, left: 40 }, { top: 70, left: 65 }, { top: 70, left: 85 },
  ]
  const icons = useMemo(() => {
    return Array.from({ length: iconCount }, (_, i) => {
      const size = 48
      const { top, left } = iconGrid[i]
      // Нарушенная сетка: небольшое случайное смещение ±7%
      const topOffset = top + (Math.random() * 14 - 7)
      const leftOffset = left + (Math.random() * 14 - 7)
      const rotate = Math.random() * 360
      return {
        src: `/images/icons/${i + 1}.png`,
        size,
        top: topOffset,
        left: leftOffset,
        rotate,
      }
    })
  }, [])

  // Базовые размеры макета карточки (фиксируем внутренний лейаут)
  const DESIGN_WIDTH = 900
  const DESIGN_HEIGHT = 450
  const [scaleFactor, setScaleFactor] = useState(1)

  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 });
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (inView && !flipped) {
      flipTimeoutRef.current = setTimeout(() => setFlipped(true), 1000);
    }
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, [inView, flipped]);

  // Комбинированный ref, чтобы и inView работал, и измерять контейнер
  const setContainerRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node
    inViewRef(node)
  }

  // Следим за шириной контейнера и масштабируем карту как единое целое
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      const s = cr.width / DESIGN_WIDTH
      setScaleFactor(s > 0 ? s : 1)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Sync refs to avoid stale values inside rAF loops
  useEffect(() => { isHoveredRef.current = isHovered }, [isHovered])
  useEffect(() => { flippedRef.current = flipped }, [flipped])

  // Cycle active icon for bounce animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBounceBullet(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animation loop for continuous rotation when not hovered
  const animate = () => {
    if (!cardRef.current || isHoveredRef.current) return

    rotationRef.current.x += rotationSpeedRef.current.x
    rotationRef.current.y += rotationSpeedRef.current.y
    rotationRef.current.z += rotationSpeedRef.current.z

    // Limit rotation angles to create a nice swaying effect
    if (Math.abs(rotationRef.current.x) > 15) rotationSpeedRef.current.x *= -1
    if (Math.abs(rotationRef.current.y) > 15) rotationSpeedRef.current.y *= -1
    if (Math.abs(rotationRef.current.z) > 5) rotationSpeedRef.current.z *= -1

    const extraFlip = flippedRef.current ? 180 : 0
    cardRef.current.style.transform = `
      rotateX(${rotationRef.current.x}deg) 
      rotateY(${rotationRef.current.y + extraFlip}deg) 
      rotateZ(${rotationRef.current.z}deg)
    `

    animationRef.current = requestAnimationFrame(animate)
  }

  // Animation for time-based effects
  const animateTime = () => {
    setTime((prev) => prev + 0.01)
    timeAnimationRef.current = requestAnimationFrame(animateTime)
  }

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return

    // Плавная анимация поворота
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n
    const smoothRotate = () => {
      currentRotation.current.x = lerp(currentRotation.current.x, targetRotation.current.x, 0.15)
      currentRotation.current.y = lerp(currentRotation.current.y, targetRotation.current.y, 0.15)
      currentRotation.current.z = lerp(currentRotation.current.z, targetRotation.current.z, 0.15)
      if (card) {
        card.style.transform = `rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg) rotateZ(${currentRotation.current.z}deg)`
        card.style.transition = "transform 0.1s linear"
      }
      smoothAnimationRef.current = requestAnimationFrame(smoothRotate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      // Чуть больше движения (было * 10, стало * 18)
      const angleX = ((e.clientY - centerY) / (rect.height / 2)) * 18
      const angleY = (-(e.clientX - centerX) / (rect.width / 2)) * 18
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      // Устанавливаем целевой угол, а не применяем сразу
      targetRotation.current.x = angleX
      targetRotation.current.y = angleY
      targetRotation.current.z = Math.min(Math.abs(angleX) + Math.abs(angleY), 20) / 10
    }

    const handleResize = () => {
      if (card) {
        setDimensions({
          width: card.offsetWidth,
          height: card.offsetHeight,
        })
      }
    }

    handleResize()
    animationRef.current = requestAnimationFrame(animate)
    timeAnimationRef.current = requestAnimationFrame(animateTime)

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      cancelAnimationFrame(timeAnimationRef.current)
      cancelAnimationFrame(smoothAnimationRef.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [isHovered])

  // Parallax via refs to avoid excessive re-renders
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const parallaxRaf = useRef<number | null>(null);

  const applyParallaxTransform = (hoverScale: number) => {
    if (cardRef.current) {
      const { x, y } = parallaxRef.current;
      const rotateX = y * 4;
      const rotateY = -x * 4;
      cardRef.current.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${hoverScale}) ${flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}`;
    }
  };

  const handleParallax = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 ... 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 ... 1
    parallaxRef.current = { x, y };
    if (parallaxRaf.current === null) {
      parallaxRaf.current = requestAnimationFrame(() => {
        applyParallaxTransform(isHovered ? 1.05 : 1);
        parallaxRaf.current = null;
      });
    }
  };

  const resetParallax = () => {
    if (isHovered) return; // Не сбрасываем, если карта в состоянии hover
    parallaxRef.current = { x: 0, y: 0 };
    applyParallaxTransform(isHovered ? 1.05 : 1);
  };

  // Update transform when hover / flip changes
  useEffect(() => {
    applyParallaxTransform(isHovered ? 1.05 : 1);

    // Cleanup on unmount
    return () => {
      clearTimeout(hoverTimeout.current);
    };
  }, [isHovered, flipped]);

  // --- Обработчики для hover ---
  const hoverTimeout = useRef<NodeJS.Timeout>();
  const isProcessingFlip = useRef(false);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      if (!isProcessingFlip.current) {
        setIsHovered(true);
      }
    }, 50);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    if (!isProcessingFlip.current) {
      setIsHovered(false);
    }
  };

const handleCardClick = (e: React.MouseEvent) => {
  const el = e.target as HTMLElement;
  if (el.closest('a, button, [role="button"], input, textarea, select')) {
    return; // не флипать, если клик по интерактиву
  }
  if (isProcessingFlip.current) return;
  isProcessingFlip.current = true;
  setFlipped(f => !f);
  setTimeout(() => { isProcessingFlip.current = false; }, 500);
};

  return (
    <div
      ref={setContainerRefs}
      className={className}
      style={{
        perspective: "3000px",
        width: width ?? '100%',
        height: height ?? `${Math.round(DESIGN_HEIGHT * scaleFactor)}px`,
        position: 'relative',
        overflow: 'visible',
      }}
      onClick={handleCardClick}
      onMouseMove={handleParallax}
      onMouseLeave={resetParallax}
    >
      {/* Scale wrapper: фиксированный макет, масштабируется целиком */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `translate(-50%, -50%) scale(${scaleFactor})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          ref={cardRef}
          className="relative w-full h-full transition-all duration-300 will-change-transform"
          style={{
            border: isHovered ? '4px solid #ffc700' : '4px solid transparent',
            borderRadius: 0,
            boxShadow: isHovered
              ? '0 0 18px 0 #ffc700cc, 0 0 8px 0 #ffc70099, 32px 32px 128px 0 rgba(0,0,0,0.9), 8px 16px 32px 0 rgba(0,0,0,0.36)'
              : 'none',
            transitionProperty: 'box-shadow, border-color, transform',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            transitionDuration: '0.3s',
            transformStyle: 'preserve-3d',
            // transform will be handled imperatively in applyParallaxTransform
            width: '100%',
            height: '100%',
            // backfaceVisibility: 'hidden',
            // pointerEvents: 'none'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Back side (теперь первая, по умолчанию) */}
          <div
            className={`absolute w-full h-full flex items-center justify-center rounded-none overflow-hidden bg-[#2D1B3B] ${flipped ? "pointer-events-none" : "pointer-events-auto"
              }`}
            style={{
              backfaceVisibility: "hidden",
              boxShadow: isHovered
                ? "0 0 18px 0 #ffc700cc, 0 0 8px 0 #ffc70099, 32px 32px 128px 0 rgba(0,0,0,0.9), 8px 16px 32px 0 rgba(0,0,0,0.36)"
                : "none",
            }}
          >
            <img
              src="/images/logo.png"
              alt="Логотип"
              style={{
                maxWidth: "70%",
                maxHeight: "70%",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 12px #0008)",
              }}
            />
          </div>

          {/* Front side (теперь после переворота) */}
          <div
            className={`absolute w-full h-full rounded-none overflow-hidden bg-[#2D1B3B] ${flipped ? "pointer-events-auto" : "pointer-events-none"
              }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: isHovered
                ? "0 0 18px 0 #ffc700cc, 0 0 8px 0 #ffc70099, 32px 32px 128px 0 rgba(0,0,0,0.9), 8px 16px 32px 0 rgba(0,0,0,0.36)"
                : "none",
            }}
          >
            {/* Случайные иконки только на стороне с контактами */}
            {flipped &&
              icons.map((icon, idx) => (
                <img
                  key={idx}
                  src={icon.src}
                  alt="icon"
                  style={{
                    position: "absolute",
                    top: `${icon.top}%`,
                    left: `${icon.left}%`,
                    width: "48px",
                    height: "48px",
                    transform: `translate(-50%, -50%) rotate(${icon.rotate}deg)`,
                    pointerEvents: "none",
                    filter: "grayscale(1) brightness(0.7)",
                    opacity: 0.2,
                    zIndex: 1,
                  }}
                  draggable={false}
                />
              ))}
            <div className="absolute inset-0 flex flex-col justify-between p-6 ">
              {/* Заголовок */}
              <div className="w-full text-center mb-4">
                <span
                  className={`text-accent font-furore text-2xl font-bold uppercase tracking-wide transition-colors duration-200 ${hoveredText === 'ЗАГОЛОВОК' ? 'text-yellow-400' : ''}`}
                  onMouseEnter={() => setHoveredText('ЗАГОЛОВОК')}
                  onMouseLeave={() => setHoveredText(null)}
                >
                  ПРОФЕССИОНАЛЬНАЯ СБОРКА ВАШЕЙ МЕБЕЛИ
                </span>
              </div>
              {/* Контент: две колонки */}
              <div className="flex flex-row w-full flex-1 ">
                {/* Левая колонка */}
                <div className="flex flex-col justify-center items-start flex-1 pl-2">
                  <span className="text-white font-furore text-2xl tracking-wide uppercase transition-colors duration-200">СБОРКА</span>
                  <span className="text-white font-furore text-2xl tracking-wide uppercase transition-colors duration-200">РЕМОНТ</span>
                  <span className="text-white font-furore text-2xl tracking-wide uppercase transition-colors duration-200">МОДЕРНИЗАЦИЯ</span>
                </div>
                {/* Вертикальная линия */}
                <div
                  className="w-[3px] bg-accent mr-12"
                  style={{ height: '70%', alignSelf: 'center', borderRadius: 1 }}
                />
                {/* Правая колонка */}
                <div className="flex flex-col justify-center items-start flex-1 gap-3">
                  {/* Телефон */}
                  <a
                    href="tel:+78123172200"
                    className="flex items-center gap-2 text-white font-furore text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.span
                      animate={activeBounceBullet === 0 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                      className="flex items-center"
                    >
                      <Phone className={`text-accent w-6 h-6${activeBounceBullet === 0 ? ' bounce-check' : ''}`} />
                    </motion.span>
                    +7 (812) 317-22-00
                  </a>
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/79219992200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white font-furore text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.span
                      animate={activeBounceBullet === 1 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                      className="flex items-center"
                    >
                      <MessageCircle className={`w-6 h-6${activeBounceBullet === 1 ? ' bounce-check' : ''}`} style={{ color: '#25D366' }} />
                    </motion.span>
                    +7 (921) 999-22-00
                  </a>
                  {/* Email */}
                  <a
                    href="mailto:SHELF.SBORKA.SPB@GMAIL.COM"
                    className="flex items-center gap-2 text-white font-furore text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.span
                      animate={activeBounceBullet === 2 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                      className="flex items-center"
                    >
                      <Mail className={`w-6 h-6${activeBounceBullet === 2 ? ' bounce-check' : ''}`} style={{ color: '#888' }} />
                    </motion.span>
                    SHELF.SBORKA.SPB@GMAIL.COM
                  </a>
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/SHELF_SBORKA_SPB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white font-furore text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.span
                      animate={activeBounceBullet === 3 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                      className="flex items-center"
                    >
                      <Instagram className={`w-6 h-6${activeBounceBullet === 3 ? ' bounce-check' : ''}`} style={{ color: '#E1306C' }} />
                    </motion.span>
                    SHELF_SBORKA_SPB
                  </a>
                  {/* Telegram */}
                  <a
                    href="https://t.me/SHELF_SBORKA_SPB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white font-furore text-xl hover:text-yellow-400 transition-colors cursor-pointer"
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.span
                      animate={activeBounceBullet === 4 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                      className="flex items-center"
                    >
                      <Send className={`w-6 h-6${activeBounceBullet === 4 ? ' bounce-check' : ''}`} style={{ color: '#229ED9' }} />
                    </motion.span>
                    @SHELF_SBORKA_SPB
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CosmicNebulaMastercard