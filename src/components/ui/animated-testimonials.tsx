"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react"; // Import React
import { cn } from "@/lib/utils";

export type Testimonial = { // Export the type
  quote: string;
  name: string;
  designation: string;
  src: string;
  dataAiHint?: string; // Add optional data-ai-hint
};

export function AnimatedTestimonials({
  testimonials,
  autoplay = true,
  className = "",
  mini = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
  mini?: boolean;
}) {
  const [active, setActive] = useState(0);
  // State to hold rotations, calculated client-side
  const [rotations, setRotations] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false); // Track mount state

  // Calculate initial random rotations only on the client after mount
  useEffect(() => {
    setIsMounted(true);
    setRotations(testimonials.map(() => Math.floor(Math.random() * 11) - 5)); // Reduced rotation range
  }, [testimonials.length]); // Recalculate if the number of testimonials changes

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay && isMounted) { // Ensure component is mounted before starting autoplay
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, isMounted, testimonials.length]); // Added testimonials.length to dependencies

  // Ensure component is mounted and rotations array is populated before rendering images
   if (!isMounted || rotations.length !== testimonials.length) {
     // You might want a placeholder or loading state here
     // Render a basic structure or null to avoid mismatch during initial render
     return (
        <div className={cn("container mx-auto max-w-sm md:max-w-4xl px-4 md:px-8 lg:px-12 py-16 md:py-24", className)}>
           {/* Placeholder structure or loading indicator */}
           <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                <div><div className="relative h-80 w-full bg-muted rounded-3xl"></div></div>
                <div className="flex justify-between flex-col py-4">
                    <div>
                        <div className="h-8 w-3/4 bg-muted rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-muted rounded mb-6"></div>
                        <div className="h-24 w-full bg-muted rounded"></div>
                    </div>
                    <div className="flex gap-4 pt-12 md:pt-0">
                        <div className="h-8 w-8 rounded-full bg-secondary"></div>
                        <div className="h-8 w-8 rounded-full bg-secondary"></div>
                    </div>
                </div>
           </div>
        </div>
     );
   }

  function getRandomPosition() {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    return `${x}% ${y}%`;
  }

  if (mini) {
    const bgPos = getRandomPosition();
    return (
      <div
        className="rounded-2xl bg-card/90 shadow-xl p-4 text-base min-h-[70px] flex flex-col items-center justify-center max-w-[220px] mx-auto cursor-pointer service-card transition-all duration-200 hover:scale-105 border-2 border-yellow-400"
        style={{
          backgroundImage: "url('/images/textures/wood-grey.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: bgPos,
          mixBlendMode: 'multiply',
        }}
        role="button"
        tabIndex={0}
      >
        <div className="font-bold text-accent text-center text-lg tracking-wide">Наши мастера</div>
      </div>
    );
  }

  return (
    <div
      className={cn("container mx-auto max-w-sm md:max-w-4xl px-4 md:px-8 lg:px-12 py-16 md:py-24 flex flex-col items-center border-2 border-yellow-400 rounded-2xl bg-card/90 shadow-xl", className)}
      style={{
        backgroundImage: "url('/images/textures/wood-grey.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: getRandomPosition(),
        mixBlendMode: 'multiply',
      }}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 w-full items-center justify-items-center min-h-[420px]">
        <div>
          <div className="relative h-80 w-full flex items-center justify-center rounded-2xl overflow-hidden bg-background">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => {
                return (
                  <motion.div
                    key={`${testimonial.src}-${index}-${rotations[index]}`}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: rotations[index],
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : rotations[index],
                      zIndex: isActive(index)
                        ? testimonials.length + 1
                        : testimonials.length - index,
                      y: isActive(index) ? [0, -40, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: rotations[index],
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom flex items-center justify-center rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={320}
                      draggable={false}
                      priority={isActive(index)}
                      className="h-full w-full object-cover object-center rounded-2xl border-2 border-accent/30"
                      data-ai-hint={testimonial.dataAiHint}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {/* Миниатюры */}
          <div className="flex gap-2 justify-center mt-4">
            {testimonials.map((testimonial, idx) => (
              <button
                key={idx}
                onClick={e => { e.stopPropagation(); setActive(idx); }}
                className={cn(
                  "w-12 h-12 rounded-full border-2 overflow-hidden transition-all duration-200",
                  idx === active ? "border-accent scale-110 shadow-lg" : "border-muted-foreground opacity-70 hover:opacity-100"
                )}
                aria-label={`Показать мастера ${testimonial.name}`}
              >
                <Image
                  src={testimonial.src}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  data-ai-hint={testimonial.dataAiHint}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between flex-col py-4 items-center">
          <AnimatePresence mode="wait">
             <motion.div
               key={active}
               initial={{
                 y: 20,
                 opacity: 0,
               }}
               animate={{
                 y: 0,
                 opacity: 1,
               }}
               exit={{
                 y: -20,
                 opacity: 0,
               }}
               transition={{
                 duration: 0.3,
                 ease: "easeInOut",
               }}
             >
               <h3 className="text-2xl md:text-3xl font-bold text-foreground font-furore text-center mb-2">
                 {testimonials[active].name}
               </h3>
               <p className="text-sm text-accent font-medium font-furore text-center mb-4">
                 {testimonials[active].designation}
               </p>
               <motion.p className="text-lg text-muted-foreground mt-6 font-furore text-center">
                 {testimonials[active].quote.split(" ").map((word, index, arr) => (
                    <React.Fragment key={index}>
                        <motion.span
                        initial={{
                            filter: "blur(8px)",
                            opacity: 0,
                            y: 5,
                        }}
                        animate={{
                            filter: "blur(0px)",
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                            delay: 0.015 * index,
                        }}
                        className="inline-block"
                        >
                        {word}
                        </motion.span>
                        {index < arr.length - 1 && ' '}
                    </React.Fragment>
                 ))}
               </motion.p>
             </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
