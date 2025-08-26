'use client';

import type { FC } from 'react';
import { ServicesStepsDemo } from '@/components/ui/services-steps-demo';

export function ServicesSection({ mini = false }: { mini?: boolean }) {
  // Функция для генерации случайной позиции
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
        <div className="font-bold text-accent text-center text-lg tracking-wide">Наши услуги</div>
      </div>
    );
  }
  return <ServicesStepsDemo />;
}

