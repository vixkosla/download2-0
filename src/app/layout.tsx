import type { Metadata } from 'next';
import './globals.css'; // Must be here
import { furore } from '@/fonts'; // For global font variable
import { ClientLayoutWrapper } from '@/components/layout/ClientLayoutWrapper';
import { cn } from '@/lib/utils';


export const metadata: Metadata = {
  title: 'Профессиональная Сборка Мебели | SHELF',
  description: 'Качественная и быстрая сборка мебели в вашем городе. Шкафы, кухни, кровати и многое другое. Сайт-визитка.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn(furore.variable)}>
      <body
        className={cn(
          'bg-background text-foreground' // Basic styles for body, more detailed styling in ClientLayoutWrapper
        )}
      >
        <ClientLayoutWrapper>
          {/* <div className="mat-overlay">
            <img src="/images/textures/4-4.jpg" alt="Коврик" />
          </div> */}
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
