
'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Drill, Hammer, Wrench, Construction } from 'lucide-react'; // Using Construction as Pliers
import type { PortfolioItem } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ItemDetailViewProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export const ItemDetailView: FC<ItemDetailViewProps> = ({ item, onClose }) => {
  if (!item) return null;

  const placeholderImageUrl = 'https://placehold.co/800x600.png';
  const itemImage = item.imageUrl || placeholderImageUrl;
  const itemDataAiHint = item.dataAiHint || item.title.split(' ').slice(0, 2).join(' ').toLowerCase() || 'furniture item';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-card text-card-foreground shadow-2xl flex flex-col relative overflow-hidden">
        {/* Floating Icons - Positioned absolutely relative to the Card */}
        <Construction
          className="absolute -top-5 -left-5 w-12 h-12 text-accent opacity-50 transform -rotate-12"
          aria-hidden="true"
        />
        <Hammer
          className="absolute -bottom-6 -right-6 w-14 h-14 text-accent opacity-60 transform rotate-[25deg]"
          aria-hidden="true"
        />
         <Wrench
          className="absolute top-1/2 -translate-y-1/2 -right-5 w-12 h-12 text-accent opacity-50 transform rotate-12 hidden sm:block"
          aria-hidden="true"
        />


        {/* Main Content Container with Yellow Border */}
        <div className="flex-grow overflow-y-auto border-2 border-border rounded-lg m-3 md:m-5 flex flex-col">
          <CardHeader className="p-3 md:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={onClose} className="text-accent hover:bg-accent/10">
                <ArrowLeft className="h-6 w-6" />
                <span className="sr-only">Назад</span>
              </Button>
              <CardTitle className="text-xl md:text-2xl font-furore text-accent uppercase text-center flex-grow mx-2 flex items-center justify-center">
                {item.title}
                <Wrench className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              </CardTitle>
              {/* Spacer or right-aligned element if needed, ensure Wrench icon is for title */}
              <div className="w-10"> {/* Spacer to balance the back button */}</div>
            </div>
          </CardHeader>

          <CardContent className="flex-grow p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
            {/* Left Column: Image */}
            <div className="relative aspect-[4/3] w-full bg-gray-200/10 rounded-md border-2 border-border shadow-md overflow-hidden">
              <Drill className="absolute top-2 left-2 w-5 h-5 text-accent z-10" />
              <Image
                src={itemImage}
                alt={`Изображение ${item.title}`}
                fill
                className="object-contain p-1" // p-1 so Drill icon is not over image edge
                data-ai-hint={itemDataAiHint}
                priority
              />
            </div>

            {/* Right Column: Text Info */}
            <div className="space-y-3 md:space-y-4 relative h-full flex flex-col justify-between">
              <div>
                <h3 className="font-furore text-foreground uppercase text-sm md:text-base">Описание:</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                  {item.description || 'Детальное описание для этого изделия скоро появится.'}
                </p>
                <h3 className="font-furore text-foreground uppercase text-sm md:text-base">Ориентировочная стоимость:</h3>
                <p className="text-2xl md:text-3xl font-bold font-furore text-accent mt-1">
                  {item.price ? `от ${item.price}₽` : 'По запросу'}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase">
                  *Точная стоимость рассчитывается индивидуально
                </p>
              </div>
              <Wrench className="absolute top-0 -right-1 md:right-1 w-6 h-6 text-accent opacity-70 hidden sm:block" />
            </div>
          </CardContent>

          <CardFooter className="p-3 md:p-4 border-t border-border flex-shrink-0 mt-auto">
            <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-furore uppercase">
              <Wrench className="mr-2 h-5 w-5" />
              Заказать сборку
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};
