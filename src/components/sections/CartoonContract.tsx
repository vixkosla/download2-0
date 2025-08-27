import React, { useRef, useState, useEffect } from 'react';

interface CartoonContractProps {
  lastName: string;
  firstName: string;
  middleName: string;
  children?: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  glowActive?: boolean;
}

export const CartoonContract: React.FC<CartoonContractProps> = ({
  lastName,
  firstName,
  middleName,
  children,
  onMouseEnter,
  onMouseLeave,
  glowActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const parallaxRaf = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const updateTransform = (scale: number) => {
    if (containerRef.current) {
      const { x, y } = parallaxRef.current;
      containerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
  };

  const handleParallax = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Disable transition while we are continuously updating the transform –
    // otherwise each new frame starts a new CSS animation which causes flicker.
    if (containerRef.current && containerRef.current.style.transition !== 'none') {
      containerRef.current.style.transition = 'none';
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 ... 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 ... 1
    parallaxRef.current.x = x * 18;
    parallaxRef.current.y = y * 18;
    if (parallaxRaf.current === null) {
      parallaxRaf.current = requestAnimationFrame(() => {
        updateTransform(isHovered ? 1.05 : 1);
        parallaxRaf.current = null;
      });
    }
  };

  // Сбрасываем параллакс и анимацию при выходе курсора.
  // Сначала возвращаем transition, а затем плавно анимируем элемент к исходному масштабу 1 —
  // это предотвращает короткую «вспышку», наблюдаемую ранее.
  const resetParallax = () => {
    parallaxRef.current = { x: 0, y: 0 };

    // Включаем плавную анимацию до изменения transform, чтобы переход был видимым, а не резким.
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.18s cubic-bezier(.22,1,.36,1)';
    }

    // Всегда возвращаем масштаб к 1 (без зависимости от старого isHovered),
    // чтобы не было лишнего скачка масштаба 1.05 → 1 → 1.
    updateTransform(1);
  };

  // Ensure consistent initial transform so that parallax updates do not cause a sudden first-frame jump.
  useEffect(() => {
    updateTransform(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateTransform(isHovered ? 1.05 : 1);
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleParallax}
      onMouseLeave={e => { setIsHovered(false); resetParallax(); if (onMouseLeave) onMouseLeave(e); }}
      onMouseEnter={e => { setIsHovered(true); if (onMouseEnter) onMouseEnter(e); }}
      style={{
        position: 'relative',
        width: 1000,
        height: 1200,
        margin: '2rem 0',
        background: `url('/images/textures/6-6.PNG') top center/contain no-repeat`,
        borderRadius: 16,
        overflow: 'visible',
        flexShrink: 0,
        // transform intentionally controlled imperatively to avoid flicker on re-renders.
        willChange: 'transform',
        transition: isHovered ? 'none' : 'transform 0.18s cubic-bezier(.22,1,.36,1)',
      }}
      className="cartoon-contract-hover"
    >
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 100,
          width: '80%',
          height: '95%',
          borderRadius: 16,
          backgroundColor: 'transparent',
          zIndex: -1
        }}
        className="cartoon-contract-shadow"
      />
      <style>{`
        @font-face {
          font-family: 'Furore';
          src: url('/fonts/Furore.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'Slavic-Regular';
          src: url('/fonts/Slavic-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        /* Transform now fully controlled via JS to avoid CSS–JS race causing flicker */
        .cartoon-contract-hover:hover {
          /* no-op */
        }
        .cartoon-contract-shadow {
          transition: box-shadow 0.18s cubic-bezier(.22,1,.36,1);
        }
        .cartoon-contract-hover:hover .cartoon-contract-shadow {
          box-shadow: 24px 32px 64px 0 rgba(0,0,0,1.95);
        }
        .contract-svg-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 30;
          opacity: 0;
          transform: scale(1.01);
          transform-origin: center;
        }
        .contract-svg-glow.active {
          opacity: 1;
          filter: drop-shadow(0 0 18px #ffc700cc) drop-shadow(0 0 8px #ffc70099);
        }
      `}</style>
      <svg
        className={`contract-svg-glow${glowActive ? ' active' : ''}`}
        viewBox="0 0 586.4 867.1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M331.3,3.5c3.8,0,23.5,0.9,23.5,19.1v18.7c0,0-0.7,7.1,6.6,7.1c7.2,0,203.7,0,203.7,0s0.7-0.1,1.9-0.1c4.6,0,15.8,1.6,15.8,16.7c0,19.1,0,784.4,0,784.4s0.5,14.2-17,14.2s-548.5,0-548.5,0s-13.4-1.3-13.4-14.9s0-782.4,0-782.4S2.7,48.5,23.2,48.5c22.7,0,201.6-0.2,201.6-0.2s0,0,0,0c0.1,0,6-0.1,5.2-11.2c-0.5-6,0-15.5,0-15.5s-0.8-18.2,23.7-18.2c24.5,0,76.9,0,76.9,0S330.9,3.5,331.3,3.5z"
          stroke="#FFC700"
          strokeWidth="3"
          fill="none"
          style={{ filter: 'url(#glow)' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '140px',
          left: '32px',
          right: '32px',
          fontFamily: 'Slavic-Regular, Arial, sans-serif',
          fontSize: '1.7rem',
          textShadow: '0 1px 2px #fff8',
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            color: '#AE2C2C',
            fontSize: '3.15em',
            letterSpacing: '2px',
            textAlign: 'center',
            marginBottom: '18px',
          }}
        >
          ДОГОВОР
        </div>
        <div style={{
          // marginBottom: 30,
          color: '#5f5e5f',
          maxWidth: 750,
          width: '100%',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: 1.2,
          textAlign: 'center',
          margin: '0 auto 30px auto',
          paddingLeft: 24,
          paddingRight: 24,
          fontWeight: 800,
        }}>
          <span style={{
            maxHeight: '100px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
          }}>
            <span style={{ color: '#5f5e5f' }}>Я, </span><span style={{ color: '#f7b801' }}>
              {(lastName || firstName || middleName)
                ? `${lastName} ${firstName} ${middleName}`.trim()
                : 'ФАМИЛИЯ ИМЯ ОТЧЕСТВО'}
            </span><span style={{ color: '#5f5e5f' }}>&nbsp;,обязуюсь:</span>
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 200,
              display: 'flex',
              justifyContent: 'center',
              width: '90%',
              pointerEvents: 'none',
              paddingLeft: 120,
              paddingRight: 20,
              fontWeight: 800,
            }}
          >
            <ol style={{ paddingLeft: 0, margin: 0, listStyle: 'none', textAlign: 'left', maxWidth: 730, width: '100%', pointerEvents: 'auto' }}>
              <li style={{ marginBottom: 8 }}>
                <span style={{ color: '#ffc700', fontWeight: 'bold', marginRight: 6 }}>1.</span>
                <span style={{ color: '#5f5e5f' }}>Обеспечить исполнителю доступ к помещению, в котором будет производиться сборка.</span>
              </li>
              <li style={{ marginBottom: 8 }}>
                <span style={{ color: '#ffc700', fontWeight: 'bold', marginRight: 6 }}>2.</span>
                <span style={{ color: '#5f5e5f', textDecoration: 'line-through' }}>Не брать исполнителя в заложники.</span> <span style={{ color: '#5f5e5f' }}>Обеспечить исполнителю возможность покинуть помещение по завершении работ.</span>
              </li>
              <li style={{ marginBottom: 8 }}>
                <span style={{ color: '#ffc700', fontWeight: 'bold', marginRight: 6 }}>3.</span>
                <span style={{ color: '#5f5e5f' }}>Пребывать в хорошем настроении.</span>
              </li>
              <li style={{ marginBottom: 8 }}>
                <span style={{ color: '#ffc700', fontWeight: 'bold', marginRight: 6 }}>4.</span>
                <span style={{ color: '#5f5e5f' }}>В случае, если выполнение пункта 3 невозможно, не вешать на исполнителя всех собак. (И не спускать тоже).</span>
              </li>
              <li>
                <span style={{ color: '#ffc700', fontWeight: 'bold', marginRight: 6 }}>5.</span>
                <span style={{ color: '#5f5e5f' }}>Искать любой повод оставить исполнителю чаевые без повода.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default CartoonContract; 