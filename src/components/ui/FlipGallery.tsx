import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import FlibBook from './flipBook';

// One "spread" page consisting of left + right halves
type PageItem = {
  title: string;
  leftUrl: string;
  rightUrl: string;
  width?: number;  // specific width for the page spread
  height?: number; // specific height for the page spread
};

const pages: PageItem[] = [
  {
    title: 'Страницы 5-6',
    leftUrl: '/images/textures/5-6.png',
    rightUrl: '/images/textures/5-6.png',
  },
  {
    title: 'Страницы 5-8/5-9',
    leftUrl: '/images/textures/5-8.png',
    rightUrl: '/images/textures/5-9.png',
    width: 350,  // 800 * 0.92
    height: 381, // 425 * 0.92

  },
];

const DEFAULT_PAGE_WIDTH = 800;
const DEFAULT_PAGE_HEIGHT = 425;
const FLIP_SPEED = 750;
const flipTiming: KeyframeAnimationOptions = { duration: FLIP_SPEED, iterations: 1 };

// Flip-out / flip-in keyframes for **horizontal** (Y-axis) rotation
const flipAnimationLeft: Keyframe[] = [
  { transform: 'rotateY(0)' },
  { transform: 'rotateY(90deg)' },
  { transform: 'rotateY(90deg)' },
];

const flipAnimationRight: Keyframe[] = [
  { transform: 'rotateY(-90deg)' },
  { transform: 'rotateY(-90deg)' },
  { transform: 'rotateY(0)' },
];

// Reverse (flip back)
const flipAnimationLeftReverse: Keyframe[] = [
  { transform: 'rotateY(90deg)' },
  { transform: 'rotateY(90deg)' },
  { transform: 'rotateY(0)' },
];

const flipAnimationRightReverse: Keyframe[] = [
  { transform: 'rotateY(0)' },
  { transform: 'rotateY(-90deg)' },
  { transform: 'rotateY(-90deg)' },
];

const BACKGROUND_IMG = '/images/textures/5-6.png';

export default function FlipGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uniteRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Initialize the first image only once
  useEffect(() => {
    if (!containerRef.current) return;
    uniteRef.current = containerRef.current.querySelectorAll<HTMLElement>('.unite');
    defineFirstImg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                Helpers                                     */
  /* -------------------------------------------------------------------------- */

  const defineFirstImg = () => {
    uniteRef.current?.forEach((el, idx) => setActiveImage(el, idx));
    setImageTitle();
  };

  const setActiveImage = (el: HTMLElement, idx: number) => {
    const page = pages[currentIndex];
    const isLeft = idx === 0 || idx === 2; // left half
    const url = isLeft ? page.leftUrl : page.rightUrl;
    el.style.backgroundImage = `url('${url}')`;

    // Apply custom background sizes if provided
    const width = page.width ?? DEFAULT_PAGE_WIDTH;
    const height = page.height ?? DEFAULT_PAGE_HEIGHT;
    el.style.backgroundSize = `${width}px ${height}px`;
    // Center if page uses custom size, else align to side
    if (page.width || page.height) {
      el.style.backgroundPosition = 'center';
    } else {
      el.style.backgroundPosition = isLeft ? 'left' : 'right';
    }
  };

  const setImageTitle = () => {
    const gallery = containerRef.current;
    if (!gallery) return;
    gallery.setAttribute('data-title', pages[currentIndex].title);
    gallery.style.setProperty('--title-y', '0');
    gallery.style.setProperty('--title-opacity', '1');
  };

  const updateGallery = (nextIndex: number, isReverse = false) => {
    const gallery = containerRef.current;
    if (!gallery) return;

    // Determine direction (horizontal left/right)
    const leftAnim = isReverse ? flipAnimationLeftReverse : flipAnimationLeft;
    const rightAnim = isReverse ? flipAnimationRightReverse : flipAnimationRight;

    gallery.querySelector('.overlay-left')?.animate(leftAnim, flipTiming);
    gallery.querySelector('.overlay-right')?.animate(rightAnim, flipTiming);

    // Hide title while flipping
    gallery.style.setProperty('--title-y', '-1rem');
    gallery.style.setProperty('--title-opacity', '0');
    gallery.setAttribute('data-title', '');

    // Update images with slight delay so animation looks continuous
    uniteRef.current?.forEach((el, idx) => {
      const delay =
        (isReverse && (idx !== 1 && idx !== 2)) ||
          (!isReverse && (idx === 1 || idx === 2))
          ? FLIP_SPEED - 200
          : 0;

      setTimeout(() => setActiveImage(el, idx), delay);
    });

    // Reveal the new title roughly half-way through the animation
    setTimeout(setImageTitle, FLIP_SPEED * 0.5);
  };

  const updateIndex = (increment: number) => {
    const inc = Number(increment);
    const newIndex = (currentIndex + inc + pages.length) % pages.length;
    const isReverse = inc < 0;
    setCurrentIndex(newIndex);
    updateGallery(newIndex, isReverse);
  };

  /* -------------------------------------------------------------------------- */
  /*                                 Render                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center font-sans">
      <div
        className="relative p-2"
        style={{ '--gallery-bg-color': 'rgba(255 255 255 / 0.075)' } as React.CSSProperties}
      >
        {/* Flip gallery core */}

        <div
          id="flip-gallery"
          ref={containerRef}
          className="relative w-[800px] h-[425px] text-center scale-[0.70] md:scale-[1.0] xl:scale-[1.25]" 
          style={{
            perspective: '800px',
            backgroundImage: `url(${BACKGROUND_IMG})`,
            backgroundSize: `${DEFAULT_PAGE_WIDTH}px ${DEFAULT_PAGE_HEIGHT}px`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ">
            <FlibBook
              width={DEFAULT_PAGE_WIDTH}
              height={DEFAULT_PAGE_HEIGHT * 2}
              scale={0.75}
            />
          </div>

          {/* <div className="left unite bg-cover bg-no-repeat" /> */}
          {/* <div className="right unite bg-cover bg-no-repeat" /> */}
          {/* <div className="overlay-left unite bg-cover bg-no-repeat" /> */}
          {/* <div className="overlay-right unite bg-cover bg-no-repeat" /> */}
        </div>

        {/* Navigation */}
        {/* <div className="absolute top-full right-0 mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => updateIndex(-1)}
            title="Previous"
            className="text-white opacity-75 hover:opacity-100 hover:scale-125 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => updateIndex(1)}
            title="Next"
            className="text-white opacity-75 hover:opacity-100 hover:scale-125 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div> */}
      </div>

      {/* Component-scoped styles that Tailwind cannot express */}
      <style jsx>{`
        #flip-gallery::after {
          content: '';
          position: absolute;
          background-color: black;
          width: 2px;
          height: 100%;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
           background: rgba(0,0,0,0.6);
          z-index: 15;
        }

        // #flip-gallery::before {
        //   content: attr(data-title);
        //   color: rgba(255 255 255 / 0.75);
        //   font-size: 0.75rem;
        //   left: -0.5rem;
        //   position: absolute;
        //   top: calc(100% + 1rem);
        //   line-height: 2;
        //   opacity: var(--title-opacity, 0);
        //   transform: translateY(var(--title-y, 0));
        //   transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
        // }

        /* Применяем позиционирование только к слоям flip-галереи, а не к FlibBook */
        #flip-gallery > .unite,
        #flip-gallery > .overlay-left,
        #flip-gallery > .overlay-right {
          position: absolute;
          width: 50%;
          height: 100%;
          overflow: hidden;
          background-size: ${DEFAULT_PAGE_WIDTH}px ${DEFAULT_PAGE_HEIGHT}px;
        }
         
        /* You can add responsive adjustments if needed */

        .left,
        .overlay-left {
          left: 0;
          transform-origin: right;
          background-position: left;
        }

        .right,
        .overlay-right {
          right: 0;
          transform-origin: left;
          background-position: right;
        }
      `}</style>
    </div>
  );
} 