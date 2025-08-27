'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Maximize2, Minimize2, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import CustomCursor from '@/components/ui/custom-cursor';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Компонент покадровой анимации
export const FrameAnimation: React.FC = () => {
  // 1) Описываем сегменты: start–end, и сколько "кадров" 60fps показывать каждый спрайт
  const segments = [
    { start: 1,   end: 9,   repeat: 1   },
    { start: 10,  end: 17,  repeat: 4   },
    { start: 18,  end: 26,  repeat: 1   },
    { start: 27,  end: 34,  repeat: 4   },
    { start: 35,  end: 43,  repeat: 1   },
    { start: 44,  end: 51,  repeat: 4   },
    { start: 52,  end: 60,  repeat: 1   },
    { start: 61,  end: 73,  repeat: 4   },
    { start: 74,  end: 74,  repeat: 30  },
    { start: 75,  end: 114, repeat: 4   },
    { start: 115, end: 115, repeat: 30  },
    { start: 116, end: 118, repeat: 2   },
    { start: 119, end: 119, repeat: 30  },
    { start: 120, end: 138, repeat: 4   },
  ];

  // 2) Собираем линейную последовательность
  const sequence: number[] = [];
  segments.forEach(({ start, end, repeat }) => {
    for (let f = start; f <= end; f++) {
      for (let i = 0; i < repeat; i++) {
        sequence.push(f);
      }
    }
  });
  const TOTAL = sequence.length;
  
  // Получаем уникальные номера кадров для загрузки
  const uniqueFrames = Array.from(new Set(sequence));
  
  // Состояние загрузки изображений
  // Первое изображение для мгновенного старта
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
  // флаг полной загрузки всех кадров (необязателен для старта)
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  // Кэш для предзагруженных изображений
  const preloadedImages = useRef<Record<number, HTMLImageElement>>({});
  
  // Текущий индекс в sequence
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  
  // Предварительная загрузка всех изображений
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = uniqueFrames.length;
    
    // Функция для отслеживания загрузки каждого изображения
    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === 1) {
        // первый загруженный кадр – стартуем анимацию
        setFirstFrameLoaded(true);
      }

      if (loadedCount === totalImages) {
        setAllImagesLoaded(true);
        console.log("Все изображения анимации загружены в кэш");
      }
    };
    
    // Загружаем все уникальные кадры
    uniqueFrames.forEach(frameNum => {
      // Используем document.createElement('img') для корректной типизации
      const img = document.createElement('img');
      img.onload = onImageLoad;
      img.src = `/animation/${frameNum}.PNG`;
      preloadedImages.current[frameNum] = img;
    });
    
    // Если изображения уже в кэше, они могут загрузиться мгновенно
    if (loadedCount === totalImages) {
      setAllImagesLoaded(true);
    }
    
    return () => {
      // Очищаем обработчики при размонтировании
      Object.values(preloadedImages.current).forEach(img => {
        if (img) {
          img.onload = null;
        }
      });
    };
  }, [uniqueFrames]);
  
  // Длительность одного кадра (около 60fps, но на 20% быстрее)
  const FRAME_DURATION = 17.67; // ≈ 13.34 мс

  // Цикл анимации. Если кадр "пропущен" (например, во время первой нагрузки страницы),
  // продвигаем сразу несколько кадров, чтобы средняя скорость оставалась постоянной.
  const animationLoop = useCallback((time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }

    const deltaTime = time - previousTimeRef.current;

    if (deltaTime >= FRAME_DURATION) {
      // Сколько кадров нужно «догнать»
      const framesToAdvance = Math.floor(deltaTime / FRAME_DURATION);

      // Сохраняем остаток, чтобы не накапливать ошибку во времени
      previousTimeRef.current = time - (deltaTime % FRAME_DURATION);

      // Обновляем индекс на необходимое количество кадров
      idxRef.current = (idxRef.current + framesToAdvance) % TOTAL;
      setIdx(idxRef.current);
    }

    requestRef.current = requestAnimationFrame(animationLoop);
  }, [TOTAL]);
  
  // Запускаем и останавливаем анимационный цикл
  useEffect(() => {
    if (!firstFrameLoaded) return;
    
    // Запускаем анимационный цикл
    requestRef.current = requestAnimationFrame(animationLoop);
    
    // Очищаем при размонтировании
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [firstFrameLoaded, animationLoop]);
  
  const currentFrame = sequence[idx];
  
  // Всегда рендерим контейнер: до загрузки показываем статический первый кадр, чтобы появлялся вместе с заголовком
  const displayedFrame = firstFrameLoaded ? currentFrame : 1;
  // Используем фоновый div с background-image вместо img для более плавной анимации
  return (
    <div 
      className="frame-animation-container"
      style={{
        backgroundImage: `url(/animation/${displayedFrame}.PNG)`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '400px',
        height: '400px'
      }}
    />
  );
};

const DISCOUNTS = [100, 80, 60, 40, 20, 0];
const BUTTON_WIDTH = 320;
const BUTTON_HEIGHT = 80;
// Увеличиваем радиус реакции и шаг смещения — кнопка уходит раньше и дальше, чтобы курсор не мог её «догнать»
const ESCAPE_DISTANCE = 300; // px
const MOVE_STEP = 100; // px per move
const MOVE_DURATION = 0.25; // seconds for framer-motion
// Уменьшаем шаг уменьшения скидки, чтобы «погоня» за кнопкой длилась дольше
const NEAR_DECREMENT = 2; // на сколько процентов уменьшаем при каждом событии движения мыши в зоне ESCAPE_DISTANCE

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const getRandomPosition = (containerWidth: number, containerHeight: number) => {
  const x = Math.random() * (containerWidth - BUTTON_WIDTH);
  const y = Math.random() * (containerHeight - BUTTON_HEIGHT);
  return { x, y };
};

const AnimatedDiscountButton: React.FC = () => {
  const [discount, setDiscount] = useState(100);
  const [isTip, setIsTip] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  // Measure container size and center button on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
      setPosition({
        x: rect.width / 2 - BUTTON_WIDTH / 2,
        y: 0, // начальная позиция у верхней границы
      });
    }
  }, []);

  // Убрали автоматический таймер. Скидка уменьшается только при приближении курсора.

  // When discount reaches 0, show tip button
  useEffect(() => {
    if (discount === 0 && !isTip) {
      setIsTip(true);
    }
  }, [discount, isTip]);

  // При первом появлении кнопки чаевых — позиционируем её по верхнему краю контейнера (по центру)
  useEffect(() => {
    if (!isTip) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: rect.width / 2 - BUTTON_WIDTH / 2,
      y: 0,
    });
  }, [isTip, containerSize]);

  // Изменили логику: пока кнопка — «Поймай скидку», она убегает, а после превращения в «Оставить чаевые» — преследует курсор.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current || !position) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Всегда запоминаем текущую позицию курсора
    mousePos.current = { x: mouseX, y: mouseY };

    if (isTip) {
      // В режиме чаевых — кнопка следует за курсором (её центр стремится к курсору)
      const newX = clamp(mouseX - BUTTON_WIDTH / 2, 0, containerSize.width - BUTTON_WIDTH);
      const newY = clamp(mouseY - BUTTON_HEIGHT / 2, 0, containerSize.height - BUTTON_HEIGHT);
      setPosition({ x: newX, y: newY });
      return;
    }

    // Режим «Поймай скидку» — классическая логика побега
    const btnCenter = {
      x: position.x + BUTTON_WIDTH / 2,
      y: position.y + BUTTON_HEIGHT / 2,
    };
    const dx = mouseX - btnCenter.x;
    const dy = mouseY - btnCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < ESCAPE_DISTANCE) {
      // Быстро уменьшаем скидку, пока пользователь пытается «поймать» кнопку
      setDiscount((d) => (d > 0 ? Math.max(d - NEAR_DECREMENT, 0) : 0));
      // Move smoothly in opposite direction
      let angle = Math.atan2(dy, dx);
      let newX = position.x - Math.cos(angle) * MOVE_STEP;
      let newY = position.y - Math.sin(angle) * MOVE_STEP;
      // Clamp to container
      newX = clamp(newX, 0, containerSize.width - BUTTON_WIDTH);
      newY = clamp(newY, 0, containerSize.height - BUTTON_HEIGHT);
      setPosition({ x: newX, y: newY });
    }
  };

  // Center button if mouse far away and not tip
  useEffect(() => {
    if (!containerRef.current || isTip) return;
    const rect = containerRef.current.getBoundingClientRect();
    const btnCenter = position
      ? {
          x: position.x + BUTTON_WIDTH / 2,
          y: position.y + BUTTON_HEIGHT / 2,
        }
      : { x: 0, y: 0 };
    const dx = mousePos.current.x - btnCenter.x;
    const dy = mousePos.current.y - btnCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 400 && position &&
      (Math.abs(position.x - (rect.width / 2 - BUTTON_WIDTH / 2)) > 1 ||
        Math.abs(position.y - 0) > 1)
    ) {
      setPosition({
        x: rect.width / 2 - BUTTON_WIDTH / 2,
        y: 0, // центр по X, верх по Y
      });
    }
  }, [position, isTip]);

  // Новый эффект: кнопка «Оставить чаевые» преследует курсор даже за пределами hero
  useEffect(() => {
    if (!isTip) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newX = clamp(mouseX - BUTTON_WIDTH / 2, 0, rect.width - BUTTON_WIDTH);
      const newY = clamp(mouseY - BUTTON_HEIGHT / 2, 0, rect.height - BUTTON_HEIGHT);
      setPosition({ x: newX, y: newY });
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, [isTip]);

  // Button click (for tip)
  const handleClick = () => {
    if (isTip) {
      alert('Спасибо за чаевые!');
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 580,
        marginTop: 24,
        marginBottom: 24,
        userSelect: 'none',
      }}
      onMouseMove={handleMouseMove}
    >
      {position && (
        <motion.button
          ref={buttonRef}
          className="px-16 py-6 rounded bg-[#ffc700] text-black font-furore text-2xl uppercase shadow-md transition-shadow duration-200 hover:bg-yellow-400 hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
          style={{
            position: 'absolute',
            // Держим кнопку в левом верхнем углу контейнера, смещение задаётся через transform
            left: 0,
            top: 0,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            cursor: isTip ? 'pointer' : 'not-allowed',
            zIndex: 2,
          }}
          initial={false}
          animate={{
            x: position.x,
            y: position.y,
            scale: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 180,
            damping: 25,
          }}
          onClick={handleClick}
          disabled={!isTip}
        >
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            {!isTip ? (
              <span style={{ color: '#000', whiteSpace: 'nowrap' }}>
                Поймай СКИДКУ <span style={{ color: '#e53935', fontWeight: 900 }}>-{discount}%</span>
              </span>
            ) : (
              <span style={{ color: '#000', whiteSpace: 'nowrap' }}>Оставить чаевые</span>
            )}
          </div>
        </motion.button>
      )}
    </div>
  );
};

export const Hero = ({ startHeroAnimations = false }: { startHeroAnimations?: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);
  const [showWelcomeElements, setShowWelcomeElements] = useState(false);
  // Если флаг startHeroAnimations передан как true — запускаем анимации сразу,
  // без дополнительного тика useEffect, чтобы синхронизировать их со шапкой.
  const [loadingDone, setLoadingDone] = useState<boolean>(() => {
    if (startHeroAnimations) {
      return true;
    }
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('loadingScreenComplete') === 'true';
    }
    return false;
  });
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Таймаут для скрытия контролов в полноэкранном режиме
  const controlsHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Показать контролы и спрятать через 2 сек, если курсор не двигается
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsHideTimeoutRef.current) clearTimeout(controlsHideTimeoutRef.current);
    controlsHideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  // Lightweight parallax: updates transform imperatively without React re-renders
  const innerParallaxRef = useRef<HTMLDivElement>(null);
  const parallaxRaf = useRef<number | null>(null);
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // Base transform for tablet position
  const baseIpadTransform = 'translate(calc(-60% - 500px), -50%) rotate(-5deg)';
  const [activeBounceIndex, setActiveBounceIndex] = useState(0);
  const [ipadAnimationDone, setIpadAnimationDone] = useState(false);
  // Активировать hover-эффекты (тень, масштаб) только после завершения анимации
  // и первого выхода курсора за пределы планшета, чтобы тень не появлялась
  // преждевременно, если курсор уже находился в области планшета.
  const [hoverReady, setHoverReady] = useState(false);
  // Motion values for tilt (faster & smoother than setState)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  // Смягчаем возврат заголовка – ниже жесткость, выше демпфирование
  const smoothTiltX = useSpring(tiltX, { stiffness: 140, damping: 30 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 140, damping: 30 });
  // Инвертируем ось Y специально для заголовка, чтобы все элементы наклонялись согласованно
  const inverseSmoothTiltY = useTransform(smoothTiltY, (v) => -v);
  // Motion values for translation of body text (paragraph & list)
  const bodyX = useMotionValue(0);
  const bodyY = useMotionValue(0);
  const smoothBodyX = useSpring(bodyX, { stiffness: 120, damping: 18 });
  const smoothBodyY = useSpring(bodyY, { stiffness: 120, damping: 18 });
  // Tilt for paragraph & list
  const bodyTiltX = useMotionValue(0);
  const bodyTiltY = useMotionValue(0);
  const smoothBodyTiltX = useSpring(bodyTiltX, { stiffness: 150, damping: 20 });
  const smoothBodyTiltY = useSpring(bodyTiltY, { stiffness: 150, damping: 20 });
  // Independent motion values for list with icons
  const listX = useMotionValue(0);
  const listY = useMotionValue(0);
  const smoothListX = useSpring(listX, { stiffness: 120, damping: 18 });
  const smoothListY = useSpring(listY, { stiffness: 120, damping: 18 });
  const listTiltX = useMotionValue(0);
  const listTiltY = useMotionValue(0);
  const smoothListTiltX = useSpring(listTiltX, { stiffness: 150, damping: 20 });
  const smoothListTiltY = useSpring(listTiltY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const handleLoadingComplete = () => {
      setLoadingDone(true);
    };

    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('loadingScreenComplete') === 'true') {
        setLoadingDone(true);
      } else {
        window.addEventListener('loadingScreenComplete', handleLoadingComplete);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('loadingScreenComplete', handleLoadingComplete);
      }
    };
  }, []);

  // Если флаг startHeroAnimations поменялся с false на true – синхронно выставляем loadingDone
  useEffect(() => {
    if (startHeroAnimations && !loadingDone) {
      setLoadingDone(true);
    }
  }, [startHeroAnimations, loadingDone]);

  useEffect(() => {
    if (loadingDone) {
      const timer = setTimeout(() => {
        setShowWelcomeElements(true);
      }, 1000); // Задержка в 1 секунду для кнопки приветствия и стрелки после экрана загрузки
      return () => clearTimeout(timer);
    }
  }, [loadingDone]);

  useEffect(() => {
    const bounceCount = 4;
    const interval = setInterval(() => {
      setActiveBounceIndex((prev) => (prev + 1) % bounceCount);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Обработчики полноэкранного режима
  // Обновили логику: теперь в полноэкранный режим переходит контейнер wrapperRef,
  // который включает видео и (при необходимости) кастомный курсор. Это позволяет
  // отображать курсор поверх видео в fullscreen.
  const handleFullscreen = () => {
    if (!isFullscreen) {
      const elem = wrapperRef.current ?? videoRef.current;
      if (elem) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        }
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Обработчик воспроизведения/паузы
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Обработчик включения/отключения звука
  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Синхронизация состояния с элементом видео
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) videoRef.current.play();
      else videoRef.current.pause();
    }
  }, [isMuted, isPlaying]);

  // Слежение за временем воспроизведения для таймлайна
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Если метаданные уже доступны – сразу устанавливаем длительность
    if (!isNaN(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  // Перемотка через таймлайн
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
    showControlsTemporarily();
  };

  // Показать элементы управления при наведении
  const handleMouseEnter = () => setShowControls(true);
  const handleMouseLeave = () => setShowControls(false);

  const handleScrollToAbout = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById('about');
    if (targetElement) {
      const headerElement = document.querySelector('.header') as HTMLElement | null;
      const headerHeight = headerElement?.clientHeight || 80;
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  // Parallax disabled – rely on pure CSS hover scale, no JS runtime work
  const handleParallax = undefined;
  const resetParallax = undefined;

  // Реакция заголовка на движение мыши: лёгкий наклон
  const applyHeroMouseMove = (clientX: number, clientY: number) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((clientX - rect.left) / rect.width - 0.5) * 2; // -1 .. 1
    const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
    const amp = 25; // углы наклона заголовка (сильнее)
    tiltX.set(ny * amp);
    tiltY.set(-nx * amp);

    const ampT = 12; // px translation for body text
    bodyX.set(nx * ampT);
    bodyY.set(ny * ampT);

    const ampTiltBody = 10; // degrees tilt for body text (усилено)
    bodyTiltX.set(ny * ampTiltBody);
    bodyTiltY.set(-nx * ampTiltBody);

    const ampTList = 14; // px translation for list
    listX.set(nx * ampTList);
    listY.set(ny * ampTList);

    const ampTiltList = 12; // degrees tilt for list (усилено)
    // Делаем направление наклона списка таким же, как у заголовка и абзаца,
    // чтобы все три надписи двигались синхронно.
    listTiltX.set(ny * ampTiltList);
    listTiltY.set(-nx * ampTiltList);
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    applyHeroMouseMove(e.clientX, e.clientY);
  };

  // Глобальный слушатель, чтобы заголовок/тексты реагировали даже когда курсор над футером
  useEffect(() => {
    const onWindowMove = (e: MouseEvent) => {
      // Обновляем только если hero хотя бы частично виден, чтобы не тратить ресурсы вне области
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const partiallyInView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!partiallyInView) return;
      applyHeroMouseMove(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', onWindowMove);
    return () => window.removeEventListener('mousemove', onWindowMove);
  }, []);

  const resetHeroMotion = () => {
    tiltX.set(0);
    tiltY.set(0);
    bodyX.set(0);
    bodyY.set(0);
    bodyTiltX.set(0);
    bodyTiltY.set(0);
    listX.set(0);
    listY.set(0);
    listTiltX.set(0);
    listTiltY.set(0);
  };

  // При входе и выходе из fullscreen управляем видимостью и таймером
  useEffect(() => {
    if (isFullscreen) {
      showControlsTemporarily();
    } else {
      setShowControls(false);
      if (controlsHideTimeoutRef.current) {
        clearTimeout(controlsHideTimeoutRef.current);
        controlsHideTimeoutRef.current = null;
      }
    }
    // Очистка на размонтирование
    return () => {
      if (controlsHideTimeoutRef.current) {
        clearTimeout(controlsHideTimeoutRef.current);
      }
    };
  }, [isFullscreen, showControlsTemporarily]);

  // Hover oscillation variants
  const hoverOscillate = (amp: number): import('framer-motion').Variants => ({
    hover: {
      x: [-amp, amp],
      transition: { duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
    },
  });

  // Variants for staged entrance of the three text blocks
  const containerVariants: import('framer-motion').Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
      },
    },
  };

  const blockVariants: import('framer-motion').Variants = {
    hidden: { x: '100vw', opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.8, 0, 0.2, 1] },
    },
  };

  // Для заголовка убираем возврат: используем whileHover с колебаниями, а после hover остаётся последняя позиция

  // --- iPad slight shift on hover ---
  const intensity = 12; // maximum px offset
  const handleIpadPointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!ipadAnimationDone || isFullscreen) return;
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      lastCoords.current = { x: nx * intensity, y: ny * intensity };
      if (parallaxRaf.current === null) {
        parallaxRaf.current = requestAnimationFrame(() => {
          if (wrapperRef.current) {
            const { x, y } = lastCoords.current;
            wrapperRef.current.style.transform = `${baseIpadTransform} translate3d(${x}px, ${y}px, 0)`;
          }
          parallaxRaf.current = null;
        });
      }
    },
    [ipadAnimationDone, isFullscreen]
  );

  const resetIpadParallax = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `${baseIpadTransform}`;
    }
  }, []);

  // Disable transition thrashing during mouse move and restore on leave
  const handleIpadPointerEnter = useCallback(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'none';
    }
  }, []);

  const handleIpadPointerLeave = useCallback(() => {
    // Restore transition and reset position
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)';
      wrapperRef.current.style.transform = `${baseIpadTransform}`;
    }
    lastCoords.current = { x: 0, y: 0 };
  }, []);

  // После завершения анимации ждём, пока курсор покинет область планшета,
  // прежде чем включать hover-эффекты.
  useEffect(() => {
    if (!ipadAnimationDone) return;

    const onPointerMove = (e: MouseEvent) => {
      if (!wrapperRef.current) {
        setHoverReady(true);
        window.removeEventListener('mousemove', onPointerMove);
        return;
      }
      const rect = wrapperRef.current.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        setHoverReady(true);
        window.removeEventListener('mousemove', onPointerMove);
      }
    };

    // Если пользователь сразу же убрал курсор – активируем мгновенно
    window.addEventListener('mousemove', onPointerMove);
    return () => window.removeEventListener('mousemove', onPointerMove);
  }, [ipadAnimationDone]);

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={resetHeroMotion}
        className="video-hero flex items-center justify-center w-full h-screen"
      >
        {/* Компонент анимации кадров на левой стороне - Этот блок удален */}
        
        <div
          className={`ipad-video-wrapper${hoverReady && ipadAnimationDone ? ' shadow-active' : ''}`}
          ref={wrapperRef}
          onMouseEnter={handleIpadPointerEnter}
          onMouseMove={handleIpadPointerMove}
          onMouseLeave={ipadAnimationDone ? (e => { handleIpadPointerLeave(); }) : undefined}
          style={{
            transform: `${baseIpadTransform}`,
            pointerEvents: hoverReady ? 'auto' : 'none',
          }}
        >
          <motion.div
            ref={innerParallaxRef}
            onMouseEnter={ipadAnimationDone ? handleMouseEnter : undefined}
            onMouseLeave={ipadAnimationDone ? (e => { handleMouseLeave(); resetIpadParallax(); }) : undefined}
            initial={{ x: '-100vw' }}
            animate={loadingDone ? { x: 0 } : { x: '-100vw' }}
            transition={{ duration: 0.7, ease: [0.8, 0, 0.2, 1] }}
            style={{ perspective: '1200px', transformStyle: 'preserve-3d', width: '100%', height: '100%', pointerEvents: hoverReady ? 'auto' : 'none' }}
            onAnimationComplete={() => setIpadAnimationDone(true)}
          >
            {!isFullscreen && (
              <>
                <img
                  src="/images/textures/ipad.PNG"
                  alt="iPad"
                  className="ipad-frame"
                />
                {/* SVG-контур поверх айпада */}
                <img
                  src="/images/textures/konturipad.svg"
                  alt="Контур iPad"
                  className="ipad-contour"
                />
              </>
            )}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="ipad-video"
              style={{ pointerEvents: 'auto' }}
            >
              <source src="/videos/background.mp4" type="video/mp4" />
              Ваш браузер не поддерживает тег видео.
            </video>
            {/* Пользовательские элементы управления */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-[68px] z-30 flex flex-col items-center gap-4"
                  style={{ left: 'calc(50% - 240px)', transform: 'translateX(-50%)' }}
                >
                  {/* Блок кнопок */}
                  <div className="flex gap-8 items-center">
                    {/* Включить/Выключить звук */}
                    <button
                      onClick={handleMute}
                      className="video-control-btn"
                      aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
                      style={{ cursor: 'pointer' }}
                    >
                      {isMuted ? <VolumeX stroke="#ffc700" color="#ffc700" /> : <Volume2 stroke="#ffc700" color="#ffc700" />}
                    </button>
                    {/* Воспроизведение/Пауза */}
                    <button
                      onClick={handlePlayPause}
                      className="video-control-btn"
                      aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                      style={{ cursor: 'pointer' }}
                    >
                      {isPlaying ? <Pause stroke="#ffc700" color="#ffc700" /> : <Play stroke="#ffc700" color="#ffc700" />}
                    </button>
                    {/* Полноэкранный режим */}
                    <button
                      onClick={handleFullscreen}
                      className="video-control-btn"
                      aria-label={isFullscreen ? 'Свернуть' : 'На весь экран'}
                      style={{ cursor: 'pointer' }}
                    >
                      {isFullscreen ? <Minimize2 stroke="#ffc700" color="#ffc700" /> : <Maximize2 stroke="#ffc700" color="#ffc700" />}
                    </button>
                  </div>
                  {/* Таймлайн только в полноэкранном режиме */}
                  {isFullscreen && (
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      onInput={handleSeek}
                      className="video-timeline mt-4"
                      style={{ width: 480, cursor: 'pointer', pointerEvents: 'auto' }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* Кастомный курсор отображается в fullscreen только пока видны элементы управления */}
          {isFullscreen && showControls && <CustomCursor />}
        </div>
        {/* Новый блок с текстом справа с анимацией прилёта и top: 10% */}
        <AnimatePresence>
          {loadingDone && isMounted && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className=" md:block absolute scale-[0.40] translate-x-[-90%] translate-y-[5%] 
              md:translate-x-[-75%] md:translate-y-[-10%] md:scale-[0.55] md:translate-y-[20%]
              lg:translate-x-[-60%] lg:translate-y-[5%] lg:scale-[0.8] 
              xl:translate-x-[-45%] xl:translate-y-[5%] xl:scale-[0.9]
              2xl:translate-x-[-25%] 2xl:scale-[1]"
              style={{
                left: 'calc(50% + 300px)',
                top: '10%',
                maxWidth: '1000px',
                textAlign: 'center',
                zIndex: 30,
                background: 'transparent',
              }}
            >
              {/* Block 1: Heading with frame animation */}
              <motion.div variants={blockVariants}>
                <div className="flex items-center mb-12" style={{ marginLeft: "-300px", perspective: "800px" }}>
                  {/* FrameAnimation now follows the same floating trajectory as the heading */}
                  <motion.div
                    className="frame-animation-container mr-6"
                    animate={{ y: [0, -24, 0, 24, 0], x: [0, 14, 0, -14, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  >
                    <FrameAnimation />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -24, 0, 24, 0], x: [0, 14, 0, -14, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <motion.h2
                      whileHover={{
                        x: 8,
                        transition: {
                          type: 'spring',
                          stiffness: 60,
                          damping: 12,
                          repeat: Infinity,
                          repeatType: 'mirror',
                        },
                      }}
                      className="text-8xl md:text-9xl font-bold text-accent font-furore uppercase leading-tight"
                      style={{ transformStyle: "preserve-3d", rotateX: smoothTiltX, rotateY: inverseSmoothTiltY }}
                    >
                      ПОЧЕМУ ВЫБИРАЮТ<br/>НАС?
                    </motion.h2>
                  </motion.div>
                </div>
              </motion.div>

              {/* Block 2: Paragraph */}
              <motion.div variants={blockVariants}>
                <motion.div
                  animate={{ y: [0, -12, 0, 12, 0], x: [0, 8, 0, -8, 0] }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{ perspective: '800px' }}
                >
                  <motion.p
                    variants={hoverOscillate(10)}
                    whileHover="hover"
                    className="text-2xl md:text-3xl mb-16 font-furore"
                    style={{ color: '#888888', x: smoothBodyX, y: smoothBodyY, rotateX: smoothBodyTiltX, rotateY: smoothBodyTiltY, transformStyle: 'preserve-3d' }}
                  >
                    МЫ - КОМАНДА ОПЫТНЫХ МАСТЕРОВ, УВЛЕЧЁННЫХ СВОИМ ДЕЛОМ. СБОРКА МЕБЕЛИ ДЛЯ НАС НЕ ПРОСТО РАБОТА, А ИСКУССТВО СОЗДАНИЯ УЮТА И ФУНКЦИОНАЛЬНОСТИ В ВАШЕМ ДОМЕ. МЫ ЦЕНИМ ВАШЕ ВРЕМЯ И ДОВЕРИЕ.
                  </motion.p>
                </motion.div>
              </motion.div>

              {/* Block 3: List */}
              <motion.div variants={blockVariants}>
                <motion.div
                  animate={{ y: [0, -10, 0, 10, 0], x: [0, -8, 0, 8, 0] }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  style={{ perspective: '800px' }}
                >
                  <motion.ul
                    className="text-left mb-16 space-y-8"
                    variants={hoverOscillate(12)}
                    whileHover="hover"
                    style={{ x: smoothListX, y: smoothListY, rotateX: smoothListTiltX, rotateY: smoothListTiltY, transformStyle: 'preserve-3d' }}
                  >
                    <li className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <img src="/images/icons/guarantee.png" alt="Гарантия" className={`icon-shield${activeBounceIndex === 0 ? ' bounce-check' : ''}`} />
                      </span>
                      ГАРАНТИЯ КАЧЕСТВА НА ВСЕ ВИДЫ РАБОТ
                    </li>
                    <li className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <img src="/images/icons/alarm-clock.png" alt="Пунктуальность" className={`icon-alarm${activeBounceIndex === 1 ? ' bounce-check' : ''}`} />
                      </span>
                      ПУНКТУАЛЬНОСТЬ И АККУРАТНОСТЬ МАСТЕРОВ
                    </li>
                    <li className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <img src="/images/icons/molotok.png" alt="Инструмент" className={`icon-hammer${activeBounceIndex === 2 ? ' bounce-check' : ''}`} />
                      </span>
                      ИСПОЛЬЗОВАНИЕ ПРОФЕССИОНАЛЬНОГО ИНСТРУМЕНТА
                    </li>
                    <li className="flex items-center gap-6 text-white font-furore text-2xl md:text-3xl">
                      <span className="icon-container">
                        <img src="/images/icons/lupa.png" alt="Цены" className={`icon-ruble${activeBounceIndex === 3 ? ' bounce-check' : ''}`} />
                      </span>
                      КОНКУРЕНТНЫЕ И ПРОЗРАЧНЫЕ ЦЕНЫ
                    </li>
                  </motion.ul>
                </motion.div>
              </motion.div>

              {/* Block 4: Discount button */}
              <motion.div variants={blockVariants}>
                <AnimatedDiscountButton />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      {/* Обложка книги под hero-секцией */}
      {/* УДАЛЕНО: блок с книгой перенесён в отдельную секцию AboutSection */}
      {/* Удалено: Желтый бордер под видео-секцией */}
      <style jsx global>{`
        .video-control-btn {
          background: none;
          color: #ffc700;
          border-radius: 50%;
          width: 144px;
          height: 144px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: none;
          box-shadow: none;
          outline: none;
          border: none;
        }
        .video-control-btn svg {
          width: 84px;
          height: 84px;
          stroke: #ffc700 !important;
          fill: none !important;
          color: #ffc700 !important;
          stroke-width: 2.5;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .video-control-btn:hover svg {
          transform: scale(1.3);
          filter: brightness(2) drop-shadow(0 0 12px #ffc700);
        }
        .video-control-btn:active svg {
          transform: scale(1.08);
          filter: brightness(1.5) drop-shadow(0 0 6px #ffc700);
        }
        .ipad-video-wrapper {
          position: absolute;
          transition: transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1);
          border-radius: 28px; /* более мягкий радиус для тени */
          overflow: visible;
        }
        .ipad-video-wrapper.shadow-active:hover {
          transform: translate(calc(-60% - 500px), 0) rotate(-5deg) scale(1.05);
          z-index: 10;
          /* Глубокая, но более мягкая скруглённая тень */
          box-shadow: 0 40px 80px 0 rgba(0,0,0,0.95), 70px 70px 48px 0 rgba(0,0,0,0.45);
          border-radius: 28px;
        }
        .ipad-video-wrapper.shadow-active:hover .ipad-frame {
          transform: scale(1.05);
        }
        .ipad-video-wrapper.shadow-active:hover .ipad-contour {
          opacity: 1;
          filter: drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099);
          transform: translate(-50%, -50%) scale(1.0605);
        }
        .ipad-video-wrapper.shadow-active:hover .ipad-video {
          transform: scale(1.05);
        }
        .ipad-frame {
          transition: transform 0.3s cubic-bezier(.4,2,.6,1);
        }
        .ipad-contour {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(1.01);
          opacity: 0;
          transition: opacity 0.25s, box-shadow 0.25s, transform 0.3s cubic-bezier(.4,2,.6,1);
          filter: drop-shadow(0 0 0 #ffc700);
        }
        @keyframes bounceCheck {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
          40% { transform: translateY(0); }
        }
        .bounce-check {
          animation: bounceCheck 1.2s;
          display: inline-block;
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 80px;
          max-width: 80px;
          height: 70px;
        }
        .icon-shield, .icon-alarm, .icon-hammer, .icon-ruble {
          height: 70px;
          width: auto;
          display: block;
          margin: 0 auto;
        }
        
        /* Стили для анимации кадров */
        .frame-animation-container {
          position: relative;
          width: 400px;
          height: 400px;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .frame-animation {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        /* Стили таймлайна */
        .video-timeline {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 3px;
        }
        .video-timeline::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #ffc700;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 6px #ffc700;
          transition: transform 0.15s;
        }
        .video-timeline::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .video-timeline::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #ffc700;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 6px #ffc700;
        }
        .video-timeline::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
};