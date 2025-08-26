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
  const containerRef = useRef<HTMLDivElement>(null)
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
      const rotateX = y * 10;
      const rotateY = -x * 10;
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
    parallaxRef.current = { x: 0, y: 0 };
    applyParallaxTransform(isHovered ? 1.05 : 1);
  };

  // Update transform when hover / flip changes
  useEffect(() => {
    applyParallaxTransform(isHovered ? 1.05 : 1);
  }, [isHovered, flipped]);

  // --- Обработчики для hover ---
  const handleMouseEnter = () => {
    setIsHovered(true);
  }
  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <div
      ref={inViewRef}
      className={`perspective-3000 ${className}`}
      style={{ perspective: "3000px", width: width ?? '100%', ...(height ? { height } : { aspectRatio: '2 / 1' }) }}
      onClick={() => setFlipped(f => !f)}
      onMouseMove={handleParallax}
      onMouseLeave={resetParallax}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full transition-shadow duration-300"
        style={{
          border: isHovered ? '4px solid #ffc700' : '4px solid transparent',
          borderRadius: 0,
          transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s cubic-bezier(.4,2,.6,1)',
          transformStyle: 'preserve-3d',
          // transform will be handled imperatively in applyParallaxTransform
          width: '100%',
          height: '100%',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Back side (теперь первая, по умолчанию) */}
        <div
          className="absolute w-full h-full flex items-center justify-center rounded-none overflow-hidden bg-[#2D1B3B]"
          style={{
            backfaceVisibility: "hidden",
            boxShadow: isHovered 
              ? '0 0 18px 0 #ffc700cc, 0 0 8px 0 #ffc70099, 32px 32px 128px 0 rgba(0,0,0,0.9), 8px 16px 32px 0 rgba(0,0,0,0.36)'
              : 'none',
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
          className="absolute w-full h-full rounded-none overflow-hidden bg-[#2D1B3B]"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: isHovered 
              ? '0 0 18px 0 #ffc700cc, 0 0 8px 0 #ffc70099, 32px 32px 128px 0 rgba(0,0,0,0.9), 8px 16px 32px 0 rgba(0,0,0,0.36)'
              : 'none',
          }}
        >
          {/* Случайные иконки только на стороне с контактами */}
          {flipped && icons.map((icon, idx) => (
          <img
            key={idx}
            src={icon.src}
            alt="icon"
            style={{
              position: 'absolute',
              top: `${icon.top}%`,
              left: `${icon.left}%`,
              width: 'min(9vw, 48px)',
              height: 'min(9vw, 48px)',
              transform: `translate(-50%, -50%) rotate(${icon.rotate}deg)`,
              pointerEvents: 'none',
              filter: 'grayscale(1) brightness(0.7)',
              opacity: 0.2,
              zIndex: 1,
            }}
            draggable={false}
          />
        ))}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Заголовок */}
            <div className="w-full text-center mb-4">
              <span
                className={`text-accent font-furore text-3xl md:text-4xl font-bold uppercase tracking-wide transition-colors duration-200 ${hoveredText === 'ЗАГОЛОВОК' ? 'text-yellow-400' : ''}`}
                onMouseEnter={() => setHoveredText('ЗАГОЛОВОК')}
                onMouseLeave={() => setHoveredText(null)}
              >
                ПРОФЕССИОНАЛЬНАЯ СБОРКА ВАШЕЙ МЕБЕЛИ
              </span>
            </div>
            {/* Контент: две колонки */}
            <div className="flex flex-row w-full flex-1">
              {/* Левая колонка */}
              <div className="flex flex-col justify-center items-start flex-1 pl-2">
                <span className="text-white font-furore text-xl md:text-2xl tracking-wide uppercase transition-colors duration-200">СБОРКА</span>
                <span className="text-white font-furore text-xl md:text-2xl tracking-wide uppercase transition-colors duration-200">РЕМОНТ</span>
                <span className="text-white font-furore text-xl md:text-2xl tracking-wide uppercase transition-colors duration-200">МОДЕРНИЗАЦИЯ</span>
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
                  className="flex items-center gap-2 text-white font-furore text-lg md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 text-white font-furore text-lg md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 text-white font-furore text-lg md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 text-white font-furore text-lg md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 text-white font-furore text-lg md:text-xl hover:text-yellow-400 transition-colors cursor-pointer"
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

      <style>
        {`
        @keyframes holographicShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        @keyframes aurora {
          0% { transform: translate(5%, 5%) scale(1.0); opacity: 0.7; }
          50% { transform: translate(-5%, -5%) scale(1.2); opacity: 0.9; }
          100% { transform: translate(5%, 5%) scale(1.0); opacity: 0.7; }
        }
        
        @keyframes pulse-slow {
          0% { opacity: 0.6; }
          50% { opacity: 0.9; }
          100% { opacity: 0.6; }
        }

        @keyframes pulse-glow {
          0% { filter: blur(5px) brightness(1); }
          50% { filter: blur(7px) brightness(1.3); }
          100% { filter: blur(5px) brightness(1); }
        }
        
        .stars-small, .stars-medium, .stars-large, .stars-twinkle {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .stars-small {
          background-image: radial-gradient(1px 1px at 20px 30px, white, rgba(0,0,0,0)),
                          radial-gradient(1px 1px at 40px 70px, white, rgba(0,0,0,0)),
                          radial-gradient(1px 1px at 50px 160px, white, rgba(0,0,0,0)),
                          radial-gradient(1px 1px at 90px 40px, white, rgba(0,0,0,0)),
                          radial-gradient(1px 1px at 130px 80px, white, rgba(0,0,0,0)),
                          radial-gradient(1px 1px at 160px 120px, white, rgba(0,0,0,0));
          background-size: 200px 200px;
          opacity: 0.4;
        }
        
        .stars-medium {
          background-image: radial-gradient(1.5px 1.5px at 150px 150px, white, rgba(0,0,0,0)),
                          radial-gradient(1.5px 1.5px at 220px 220px, white, rgba(0,0,0,0)),
                          radial-gradient(1.5px 1.5px at 80px 250px, white, rgba(0,0,0,0)),
                          radial-gradient(1.5px 1.5px at 180px 80px, white, rgba(0,0,0,0));
          background-size: 300px 300px;
          opacity: 0.4;
        }
        
        .stars-large {
          background-image: radial-gradient(2px 2px at 100px 100px, white, rgba(0,0,0,0)),
                          radial-gradient(2px 2px at 200px 200px, white, rgba(0,0,0,0)),
                          radial-gradient(2px 2px at 300px 300px, white, rgba(0,0,0,0));
          background-size: 400px 400px;
          opacity: 0.5;
          animation: stars-move 100s linear infinite;
        }

        .stars-twinkle {
          background-image: radial-gradient(2px 2px at 50px 50px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
                          radial-gradient(2px 2px at 150px 150px, rgba(255,255,255,0.8), rgba(0,0,0,0)),
                          radial-gradient(2px 2px at 250px 250px, rgba(255,255,255,0.8), rgba(0,0,0,0));
          background-size: 300px 300px;
          opacity: 0;
          animation: twinkle 4s ease-in-out infinite alternate;
        }

        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 15% 15%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 20% 20%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 25% 25%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 30% 30%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 35% 35%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 40% 40%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 50% 50%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 55% 55%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 60% 60%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 65% 65%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 70% 70%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 75% 75%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 80% 80%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 85% 85%, rgba(255,255,255,0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90% 90%, rgba(51, 195, 240, 0.8), rgba(0,0,0,0)),
            radial-gradient(1px 1px at 95% 95%, rgba(255,255,255,0.8), rgba(0,0,0,0));
          background-size: 150% 150%;
          animation: particles-float 20s ease infinite;
          opacity: 0.6;
        }
        
        @keyframes stars-move {
          0% { background-position: 0px 0px, 0px 0px, 0px 0px; }
          100% { background-position: 400px 400px, 300px 300px, 200px 200px; }
        }

        @keyframes twinkle {
          0% { opacity: 0.1; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }

        @keyframes particles-float {
          0% { background-position: 0% 0%; }
          50% { background-position: 75% 75%; }
          100% { background-position: 0% 0%; }
        }
        
        .animate-holographicShift {
          animation: holographicShift 5s ease infinite;
        }
        
        .animate-aurora {
          animation: aurora 15s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .perspective-3000 {
          perspective: 3000px;
        }

        .chip-glow {
          position: relative;
        }

        .chip-glow::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(51, 195, 240, 0.2) 0%, rgba(51, 195, 240, 0) 100%);
          opacity: 0;
          animation: chip-pulse 4s ease-in-out infinite;
        }

        @keyframes chip-pulse {
          0% { opacity: 0; }
          50% { opacity: 0.7; }
          100% { opacity: 0; }
        }
      `}
      </style>
    </div>
  )
}

export default CosmicNebulaMastercard 