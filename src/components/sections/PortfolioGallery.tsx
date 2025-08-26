'use client';

import type { FC } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import InteractiveFolder from '@/components/ui/interactive-folder'; // Not used according to latest structure
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { PortfolioItem as PortfolioItemType } from '@/types'; // Renamed to avoid conflict

interface PortfolioGalleryProps {
  items: PortfolioItemType[];
  initialCategory?: string | null;
  onViewItemDetail: (item: PortfolioItemType) => void; // Callback to open ItemDetailView
  sectionId?: string;
  className?: string;
}

// This component is being replaced by InteractivePriceGallery.
// Keeping the file for now but it's not actively used in page.tsx.
// The logic here might be useful for reference if specific parts are needed elsewhere.

export const PortfolioGallery: FC<PortfolioGalleryProps> = ({
  items,
  initialCategory = null,
  onViewItemDetail,
  sectionId = "gallery",
  className
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [filteredItems, setFilteredItems] = useState<PortfolioItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItemType | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const categories = Array.from(new Set(items.map(item => item.category)));

  useEffect(() => {
    if (selectedCategory) {
      const newFilteredItems = items.filter(item => item.category === selectedCategory);
      setFilteredItems(newFilteredItems);
      if (newFilteredItems.length > 0) {
        setSelectedItem(newFilteredItems[0]); // Select first item in new category
        if (carouselApi) carouselApi.scrollTo(0, true); // Scroll carousel to first
      } else {
        setSelectedItem(null);
      }
    } else {
      setFilteredItems(items); // Show all if no category selected
       if (items.length > 0) {
        setSelectedItem(items[0]);
        if (carouselApi) carouselApi.scrollTo(0, true);
      } else {
        setSelectedItem(null);
      }
    }
  }, [selectedCategory, items, carouselApi]);


  useEffect(() => {
    if (selectedItem && filteredItems.length > 0) {
      const index = filteredItems.findIndex(item => item.id === selectedItem.id);
      if (index !== -1 && carouselApi && index !== currentCarouselIndex) {
         // carouselApi.scrollTo(index); // This can cause loops if not handled carefully
      }
    }
  }, [selectedItem, filteredItems, carouselApi, currentCarouselIndex]);


  const onSelectCarousel = useCallback(() => {
    if (!carouselApi || !filteredItems.length) return;
    const newIndex = carouselApi.selectedScrollSnap();
    setCurrentCarouselIndex(newIndex);
    setSelectedItem(filteredItems[newIndex]);
  }, [carouselApi, filteredItems, setCurrentCarouselIndex, setSelectedItem]);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", onSelectCarousel);
    return () => {
      if (carouselApi) {
        carouselApi.off("select", onSelectCarousel);
      }
    };
  }, [carouselApi, onSelectCarousel]);

  const handleThumbnailClick = (item: PortfolioItemType) => {
    setSelectedItem(item);
    const index = filteredItems.findIndex(fi => fi.id === item.id);
    if (index !== -1 && carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  const handleLargeImageClick = (item: PortfolioItemType) => {
    onViewItemDetail(item);
  };

  if (!items || items.length === 0) {
    return (
      <section id={sectionId} className={cn("container mx-auto py-16 md:py-24 text-center", className)}>
        <h2 className="section-title text-accent">Примеры Наших Работ</h2>
        <p className="text-muted-foreground mt-4">Пока нет примеров работ для отображения.</p>
      </section>
    );
  }


  return (
    <section id={sectionId} className={cn("container mx-auto py-16 md:py-24 bg-background", className)}>
      <h2 className="section-title text-accent mb-8 md:mb-12">Примеры Наших Работ</h2>
      
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(null)}
          className={cn(selectedCategory === null && "bg-primary text-primary-foreground")}
        >
          Все
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={cn(selectedCategory === category && "bg-primary text-primary-foreground")}
          >
            {category}
          </Button>
        ))}
      </div>

      {filteredItems.length === 0 && selectedCategory && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl text-foreground">В категории "{selectedCategory}" пока нет примеров.</p>
          <p className="text-muted-foreground">Попробуйте выбрать другую категорию.</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {filteredItems.length > 0 && (
          <motion.div
            key={selectedCategory || "all"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-[1fr,400px] lg:grid-cols-[1fr,500px] gap-8 md:gap-12"
          >
            {/* Left: Carousel */}
            <div className="relative aspect-video md:aspect-auto md:min-h-[500px] bg-muted rounded-lg overflow-hidden shadow-xl border-2 border-accent/30">
              <Carousel
                setApi={setCarouselApi}
                opts={{ loop: true, align: "start" }}
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                className="w-full h-full"
              >
                <CarouselContent className="h-full">
                  {filteredItems.map((item) => (
                    <CarouselItem key={item.id} className="h-full">
                      <div
                        className="relative w-full h-full group cursor-pointer"
                        onClick={() => handleLargeImageClick(item)}
                      >
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={item.dataAiHint || item.title.split(' ').slice(0,2).join(' ').toLowerCase()}
                          priority={item.id === selectedItem?.id}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                            <Maximize className="w-12 h-12 text-white mb-2" />
                            <p className="text-white text-lg font-semibold text-center">{item.title}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {filteredItems.length > 1 && (
                  <>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/70 hover:bg-background"
                        onClick={() => carouselApi?.scrollPrev()}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/70 hover:bg-background"
                        onClick={() => carouselApi?.scrollNext()}
                    >
                        <ChevronRight />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                        {filteredItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => carouselApi?.scrollTo(index)}
                            className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            index === currentCarouselIndex ? "bg-primary scale-125" : "bg-muted-foreground/50 hover:bg-primary/70"
                            )}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                        ))}
                    </div>
                  </>
                )}
              </Carousel>
            </div>

            {/* Right: List of items */}
            <div className="flex flex-col">
                <div className="bg-muted text-muted-foreground p-3 md:p-4 rounded-t-lg text-center font-furore text-sm md:text-base uppercase tracking-wider">
                    Наименование изделия
                </div>
                <ScrollArea className="flex-grow border border-muted rounded-b-lg max-h-[400px] md:max-h-[500px]">
                    <div className="divide-y divide-muted">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "p-3 md:p-4 grid grid-cols-[64px,1fr] md:grid-cols-[80px,1fr] gap-3 md:gap-4 items-center cursor-pointer hover:bg-muted/50 transition-colors duration-150",
                                item.id === selectedItem?.id ? "bg-primary/10 border-l-4 border-primary" : "border-l-4 border-transparent"
                            )}
                            onClick={() => handleThumbnailClick(item)}
                        >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border border-border">
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                                data-ai-hint={item.dataAiHint || item.title.split(' ').slice(0,2).join(' ').toLowerCase()}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="font-furore text-sm md:text-base text-foreground leading-tight truncate mb-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">
                                {item.price ? `${item.price}₽` : "Подробнее..."}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

    