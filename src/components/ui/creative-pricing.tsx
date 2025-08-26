'use client';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react"; 
import { cn } from "@/lib/utils";
import React from "react"; 

export type PricingTier = {
  name: string;
  icon?: React.ReactNode;
  price?: number;
  description?: string;
  features?: string[];
  popular?: boolean;
  id?: string | number;
};

// This component is likely no longer directly used in page.tsx as its functionality
// is merged into InteractivePriceGallery. However, its type `PricingTier`
// (now aliased from FurnitureCategory) might still be relevant for the data structure.

function CreativePricing({
    title = "Наши Цены", 
    tiers,
    sectionId,
}: {
    title?: string;
    tiers: PricingTier[];
    sectionId?: string;
}) {
    return (
        <div id={sectionId} className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24"> 
            <div className="text-center mb-16"> 
                <h2 className="section-title text-accent"> 
                    {title}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier, index) => {
                    const bgX = Math.floor(Math.random() * 80);
                    const bgY = Math.floor(Math.random() * 80);
                    const tierColor = "hsl(var(--primary))"; // Default to primary, or can be part of FurnitureCategory type
                    const popular = index === 1; // Example: make the second tier popular for demo

                    return (
                        <div
                            key={tier.id} // Assuming FurnitureCategory has an id
                            className={cn(
                                "relative group",
                                "transition-all duration-300",
                                index === 0 && "rotate-[-1deg]",
                                index === 1 && "rotate-[1deg]",
                                index === 2 && "rotate-[-2deg]"
                            )}
                        >
                            <div
                                className={cn(
                                    "absolute inset-0 bg-card",
                                    "border-2 border-border",
                                    "rounded-lg shadow-[4px_4px_0px_0px] shadow-[hsl(var(--foreground))]",
                                    "transition-all duration-300",
                                    "group-hover:shadow-[8px_8px_0px_0px]",
                                    "group-hover:translate-x-[-4px]",
                                    "group-hover:translate-y-[-4px]"
                                )}
                                style={{
                                    backgroundImage: `url(/images/textures/wood-grey.jpg)`,
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: `${bgX}% ${bgY}%`,
                                    mixBlendMode: 'multiply',
                                    opacity: 0.7
                                }}
                            />

                            <div className="relative p-6">
                                <div className="mb-6">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-full mb-4",
                                            "flex items-center justify-center",
                                            "border-2 border-border",
                                            `text-[${tierColor}]`
                                        )}
                                        style={{ color: tierColor }} 
                                    >
                                        {tier.icon || <Check />} {/* Fallback icon */}
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground font-furore">
                                        {tier.name}
                                    </h3>
                                    {/* Description might come from FurnitureCategory type if added */}
                                    {/* <p className="text-muted-foreground">
                                        {tier.description}
                                    </p> */}
                                </div>

                                <div className="mb-6">
                                    {/* Price might come from FurnitureCategory or be handled differently */}
                                    {/* <span className="text-4xl font-bold text-foreground font-furore">
                                        {tier.price}₽ 
                                    </span>
                                    <span className="text-muted-foreground">
                                        /усл*
                                    </span> */}
                                </div>

                                <div className="space-y-3 mb-6">
                                    {/* Features might come from FurnitureCategory */}
                                    {/* {tier.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-center gap-3"
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full border-2 border-border
                                                 flex items-center justify-center"
                                            >
                                                <Check className="w-3 h-3 text-accent" /> 
                                            </div>
                                            <span className="text-lg text-foreground font-furore">
                                                {feature}
                                            </span>
                                        </div>
                                    ))} */}
                                </div>

                                <Button
                                    className={cn(
                                        "w-full h-12 text-base relative font-furore",
                                        "border-2 border-border", 
                                        "transition-all duration-300",
                                        "shadow-[4px_4px_0px_0px] shadow-[hsl(var(--foreground))]", 
                                        "hover:shadow-[6px_6px_0px_0px]",
                                        "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                                        popular
                                            ? [ 
                                                  "bg-accent text-accent-foreground",
                                                  "hover:bg-accent/90",
                                                  "active:bg-accent/80",
                                              ]
                                            : [ 
                                                  "bg-secondary text-secondary-foreground", 
                                                  "hover:bg-secondary/90",
                                                  "active:bg-secondary/80",
                                              ]
                                    )}
                                    onClick={() => {
                                        const form = document.getElementById('order-form');
                                        if (form) {
                                            form.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    Заказать
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
             {/* <p className="text-center text-muted-foreground mt-8 text-sm">
               * Цена является ориентировочной. Точная стоимость определяется после оценки объема работ.
             </p> */}
        </div>
    );
}

export { CreativePricing }

    