
import type { ReactNode } from 'react';

export interface FurnitureCategory {
  id: string;
  name: string;
  icon?: ReactNode;
  // description?: string; // If needed later
  // basePrice?: number;   // If needed later
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // Should match FurnitureCategory['name'] (case-insensitive)
  dataAiHint?: string;
  price?: number; // Optional: specific price for this item
  // Add other specific details for an item if necessary
}

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  dataAiHint?: string;
}

    