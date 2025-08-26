"use client";
import { useEffect, useState, useRef } from "react";

// Frame animation images (ordered as they should appear)
const frameImages = [
  "/loading/IMG_6085.PNG",
  "/loading/IMG_6086.PNG",
  "/loading/IMG_6087.PNG",
  "/loading/IMG_6088.PNG",
  "/loading/IMG_6089.PNG",
  "/loading/IMG_6091.PNG",
  "/loading/IMG_6092.PNG",
  "/loading/IMG_6094.PNG",
  "/loading/IMG_6095.PNG",
  "/loading/IMG_6096.PNG",
  "/loading/IMG_6097.PNG",
  "/loading/IMG_6098.PNG",
];

// Helper function for easing
function easeInCubic(t: number): number {
  return t * t * t;
}

// Frame Animation Component
const FrameAnimation: React.FC = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [activeBuffer, setActiveBuffer] = useState(0); // 0 or 1 to alternate between buffers
  const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
  const [isPaused, setIsPaused] = useState(false);
  const lastFrameIndex = frameImages.length - 1; // Index of IMG_6098.PNG
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const imageRefs = useRef<HTMLImageElement[]>([]);

  // Preload all images immediately without waiting
  useEffect(() => {
    // Assign refs to each image
    imageRefs.current = Array(frameImages.length).fill(null);

    // Create hidden img elements to preload all frames
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    frameImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({
          ...prev,
          [index]: true
        }));

        if (index === 0) {
          setFirstImageLoaded(true);
        }
      };
      img.src = src;
      imageRefs.current[index] = img;
      container.appendChild(img);
    });

    return () => {
      document.body.removeChild(container);
    };
  }, []);
  
  // Animation effect to cycle through frames
  useEffect(() => {
    if (!firstImageLoaded) return; // Wait for at least the first image

    const frameInterval = setInterval(() => {
      // Skip frame changes if we're paused (during delay at last frame)
      if (isPaused) return;
      
      // Calculate next frame
      let nextFrame = currentFrame;
      
      // Moving forward
      if (direction === 'forward') {
        // If we've reached the last frame
        if (currentFrame === lastFrameIndex) {
          setIsPaused(true);
          setTimeout(() => {
            setDirection('reverse');
            setIsPaused(false);
          }, 1000); // 1 second delay at last frame
          nextFrame = currentFrame; // Keep showing the same frame during pause
        } else {
          // Continue moving forward
          nextFrame = currentFrame + 1;
        }
      } 
      // Moving in reverse
      else {
        // If we've reached the first frame
        if (currentFrame === 0) {
          // Switch back to forward direction
          setDirection('forward');
          nextFrame = 1; // Move to second frame
        } else {
          // Continue moving backward
          nextFrame = currentFrame - 1;
        }
      }
      
      // If the next image is loaded, proceed with the update
      if (loadedImages[nextFrame]) {
        setCurrentFrame(nextFrame);
        setActiveBuffer(prev => prev === 0 ? 1 : 0);
      }
    }, 100);
    
    return () => clearInterval(frameInterval);
  }, [currentFrame, direction, isPaused, firstImageLoaded, loadedImages]);
  
  // Show loading placeholder before first image loads
  if (!firstImageLoaded) {
    return (
      <div style={{ width: '336px', height: '336px' }}>
        {/* Пустой контейнер, сохраняющий размер */}
      </div>
    );
  }
  
  // Display the current frame with visible images instead of background-image
  return (
    <div style={{ width: "336px", height: "336px", position: "relative" }}>
      {frameImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Animation frame ${index + 1}`}
          style={{
            width: "336px",
            height: "336px",
            objectFit: "contain",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: index === currentFrame ? 1 : 0,
            zIndex: index === currentFrame ? 2 : 1,
            display: loadedImages[index] ? "block" : "none"
          }}
        />
      ))}
    </div>
  );
};

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [dotCount, setDotCount] = useState(0); // для анимации многоточия
  const loadingScreenDoneRef = useRef(false); // To ensure event fires only once
  // Максимальное время ожидания (страховочный таймаут), если событие load не наступит
  const safetyTimeoutMs = 30000;

  // Базовые тексты без многоточия
  const baseLoadingTexts = [
    "Загружаем инструменты",
    "Ищем потерявшийся шуруп",
    "Разбираемся в инструкции",
    "Спасаем мебель от кривых рук",
    "Убеждаем шкаф не падать",
    "Ищем шестигранник под диваном",
    "Считаем оставшиеся детали",
    "Объясняем дивану, что он должен собраться",
    "Выпрямляем кривые гвозди",
    "Переворачиваем инструкцию ИКЕА",
    "Собираем стол вверх ногами",
    "Придумываем, куда деть лишние детали",
    "Объясняем, что молоток - не отвёртка",
    "Уговариваем шкаф встать ровно",
    "Читаем мантры над комодом",
    "Устанавливаем дверцы с третьей попытки",
  ];
  
  // Многоточие с анимацией
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4); // 0, 1, 2, 3, 0, ...
    }, 300);
    
    return () => clearInterval(dotInterval);
  }, []);
  
  // Получаем текущий текст с анимированным многоточием
  const getCurrentText = () => {
    const baseText = baseLoadingTexts[currentTextIndex];
    const dots = ".".repeat(dotCount);
    return `${baseText}${dots}`;
  };

  const lettersAppearDelay = 400; // задержка между появлением букв

  // Shelf text animation
  const shelfLetters = "SHELF".split('');
  const [animatedLetters, setAnimatedLetters] = useState<string[]>([]);
  const [glowingLetters, setGlowingLetters] = useState<boolean[]>([]);

  useEffect(() => {
    let letterTimeout: NodeJS.Timeout;
    let glowTimeout: NodeJS.Timeout;
    shelfLetters.forEach((letter, index) => {
      letterTimeout = setTimeout(() => {
        setAnimatedLetters(prev => [...prev, letter]);
        setGlowingLetters(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        
        // Отключаем свечение через 600мс после появления буквы
        glowTimeout = setTimeout(() => {
          setGlowingLetters(prev => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        }, 600);
      }, (index + 1) * lettersAppearDelay);
    });
    return () => {
      clearTimeout(letterTimeout);
      clearTimeout(glowTimeout);
    };
  }, [lettersAppearDelay]);

  // Эффект для смены текстов с фиксированным интервалом
  useEffect(() => {
    // Устанавливаем фиксированное время для каждого текста
    const textChangeInterval = 1200; 
    
    // Функция для выбора случайного текста
    const getRandomTextIndex = () => {
      return Math.floor(Math.random() * baseLoadingTexts.length);
    };
    
    // Начальный случайный текст
    setCurrentTextIndex(getRandomTextIndex());
    
    // Создаем один интервал и не пересоздаем его при каждом изменении прогресса
    const textInterval = setInterval(() => {
      setCurrentTextIndex(getRandomTextIndex());
    }, textChangeInterval);

    // Очищаем интервал при размонтировании
    return () => {
      clearInterval(textInterval);
    };
  }, [baseLoadingTexts.length]); // Убрали зависимость от progress
  
  // Отдельный эффект для финального текста
  useEffect(() => {
    if (progress > 90) {
      // Продолжаем показывать случайные тексты из основного массива
      const finalTextInterval = setInterval(() => {
        setCurrentTextIndex(Math.floor(Math.random() * baseLoadingTexts.length));
      }, 1200);
      
      return () => clearInterval(finalTextInterval);
    }
  }, [progress]);

  /* ----------------------- ПРОГРЕСС БЕЗ МИНИМАЛЬНОГО ВРЕМЕНИ ---------------------- */

  // Плавно увеличаем progress до 95 % пока не получим событие load
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? Math.min(prev + Math.random() * 5 + 1, 95) : prev));
    }, 200);
    return () => clearInterval(interval);
  }, [visible]);

  // Завершаем прелоадер при полной загрузке окна или по страховочному таймауту
  useEffect(() => {
    const finishLoading = () => {
      if (loadingScreenDoneRef.current) return;
      setProgress(100);
      setTimeout(() => setVisible(false), 200);
      const cssTransitionDuration = 500;
      setTimeout(() => {
        if (!loadingScreenDoneRef.current) {
          (window as any).loadingScreenCompleted = true;
          window.dispatchEvent(new CustomEvent('loadingScreenComplete'));
          sessionStorage.setItem('loadingScreenComplete', 'true');
          loadingScreenDoneRef.current = true;
        }
      }, cssTransitionDuration + 200);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
    }

    const safety = setTimeout(finishLoading, safetyTimeoutMs);

    return () => {
      window.removeEventListener('load', finishLoading);
      clearTimeout(safety);
    };
  }, []);

  if (!visible && loadingScreenDoneRef.current) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "hsl(var(--background))",
        zIndex: 200000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--main-font)",
        color: "hsl(var(--foreground))",
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        transition: "opacity 0.5s ease-out, visibility 0.5s ease-out",
      }}
    >
      <div className="mb-4 text-5xl md:text-7xl font-bold text-accent text-center" style={{ letterSpacing: '0.1em' }}>
        {shelfLetters.map((letter, index) => (
          <span
            key={index}
            style={{
              display: 'inline-block',
              opacity: animatedLetters[index] ? 1 : 0,
              transform: animatedLetters[index] ? 'translateY(0) rotateX(0deg) scale(1)' : 'translateY(20px) rotateX(-45deg) scale(0.8)',
              transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55), text-shadow 0.4s ease-out',
              transitionDelay: `${index * 0.1}s`,
              color: 'white',
              textShadow: glowingLetters[index] 
                ? '0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 199, 0, 0.3), 0 0 70px rgba(255, 199, 0, 0.2)'
                : 'none'
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Frame animation component placed between SHELF text and progress bar */}
      <div className="mb-8">
        <FrameAnimation />
      </div>

      <div style={{ width: "70%", maxWidth: "500px", marginBottom: "2rem", background: 'hsl(var(--muted))', borderRadius: 'var(--radius)' }}>
        <div
          style={{
            width: `${progress}%`,
            height: "10px",
            background: "hsl(var(--primary))",
            borderRadius: 'var(--radius)',
            boxShadow: "0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))",
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <p
          className="text-lg text-muted-foreground transition-opacity duration-500 ease-in-out"
          style={{ opacity: 1 }}
        >
          {getCurrentText()}
        </p>
      </div>
    </div>
  );
}
