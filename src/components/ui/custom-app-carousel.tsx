
"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect, type ReactNode, type SyntheticEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button as ShadButton } from "@/components/ui/button";

export interface SlideData {
  id: string;
  title: string;
  button: string;
  src: string;
  dataAiHint?: string;
  contentComponent?: ReactNode;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (slide: SlideData) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: SyntheticEvent<HTMLImageElement>) => {
    // Next/Image handles loading state, direct opacity manipulation less critical
    // event.currentTarget.style.opacity = "1"; 
  };

  const { src, button, title, dataAiHint } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(slide)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-card rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <Image
            fill
            className="absolute inset-0 w-[120%] h-[120%] object-cover transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded} // onLoad might not be necessary with Next/Image's handling
            priority={index === current} // Prioritize loading current slide image
            data-ai-hint={dataAiHint}
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/50 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold relative text-accent font-furore">
            {title}
          </h2>
          <div className="flex justify-center">
            <ShadButton 
              variant="default"
              className="mt-6 px-4 py-2 w-fit mx-auto sm:text-sm text-primary-foreground bg-accent h-12 text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] font-furore"
              onClick={(e) => {
                e.stopPropagation(); 
                handleSlideClick(slide);
              }}
            >
              {button}
            </ShadButton>
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={cn(
        "w-10 h-10 flex items-center mx-2 justify-center bg-secondary text-secondary-foreground border-3 border-transparent rounded-full focus:border-accent focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200",
        type === "previous" ? "rotate-180" : ""
      )}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-accent" />
    </button>
  );
};

interface AppCarouselProps {
  slides: SlideData[];
  onSlideClick: (slide: SlideData) => void;
}

export function AppCarousel({ slides, onSlideClick }: AppCarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClickInternal = (slide: SlideData) => {
    setCurrent(slides.findIndex(s => s.id === slide.id));
    onSlideClick(slide);
  };

  const uniqueId = useId();

  // Constants for slide dimensions and margins in vmin units
  const slideContentWidthVmin = 70;
  const slideMarginVmin = 4; // each side
  const totalSlideSpanVmin = slideContentWidthVmin + 2 * slideMarginVmin; // 70 + 8 = 78

  // Factor to adjust translation: current translation unit is 70vmin, desired is 78vmin
  const translationFactor = totalSlideSpanVmin / slideContentWidthVmin; // 78 / 70

  return (
    <div
      className="relative w-[70vmin] h-[70vmin] mx-auto" // This is the viewport
      aria-labelledby={`carousel-heading-${uniqueId}`}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          // UL width is N * viewport_width. Viewport width is 70vmin.
          // Each "slot" percentage (100 / slides.length)% corresponds to 70vmin.
          // We need to translate by `current * 78vmin`.
          // So, the percentage translation is `current * (78/70) * (100 / slides.length)%`.
          transform: `translateX(-${current * (100 / slides.length) * translationFactor}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={slide.id}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClickInternal}
          />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+2rem)]">
        <CarouselControl
          type="previous"
          title="Предыдущий слайд"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Следующий слайд"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
