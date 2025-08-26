import { FeatureSteps } from "@/components/ui/feature-section"
import { Box, Package, BedDouble, Sofa, Wrench, Lamp } from 'lucide-react';

const services = [
  {
    step: 'Услуга 1',
    title: 'Сборка Корпусной Мебели',
    content: 'Сборка шкафов, комодов, стеллажей, стенок, прихожих любой сложности.',
    image: '/images/services/box.jpg',
    icon: Box,
  },
  {
    step: 'Услуга 2',
    title: 'Сборка Кухонных Гарнитуров',
    content: 'Монтаж кухонных модулей, навесных шкафов, установка столешницы, врезка мойки и техники.',
    image: '/images/services/kitchen.jpg',
    icon: Package,
  },
  {
    step: 'Услуга 3',
    title: 'Сборка Кроватей и Спален',
    content: 'Сборка кроватей (включая с подъемным механизмом), тумб, шкафов для спальни.',
    image: '/images/services/bed.jpg',
    icon: BedDouble,
  },
  {
    step: 'Услуга 4',
    title: 'Сборка Мягкой Мебели',
    content: 'Сборка диванов (прямых, угловых, модульных), кресел.',
    image: '/images/services/sofa.jpg',
    icon: Sofa,
  },
  {
    step: 'Услуга 5',
    title: 'Сборка Офисной Мебели',
    content: 'Сборка столов, стульев, офисных кресел, стеллажей и шкафов для документов.',
    image: '/images/services/office.jpg',
    icon: Wrench,
  },
  {
    step: 'Услуга 6',
    title: 'Прочие Услуги',
    content: 'Разборка мебели, мелкий ремонт, навеска полок, зеркал и другие сопутствующие работы.',
    image: '/images/services/other.jpg',
    icon: Lamp,
  },
]

export function ServicesStepsDemo() {
  // Для примера можно убрать icon, если FeatureSteps не поддерживает
  return (
    <FeatureSteps
      features={services}
      title="Наши услуги"
      autoPlayInterval={4000}
      imageHeight="h-[400px]"
      className="w-full"
    />
  )
} 