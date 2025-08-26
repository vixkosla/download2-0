# SHELF Sborka — Техническая документация

## 1. Обзор проекта
- Одностраничный сайт-визитка для сервиса сборки мебели.
- Основной стек: Next.js 13 (App Router), TypeScript, Tailwind CSS, Framer Motion.

## 2. Структура папок
```
/app
  ├ layout.tsx
  └ page.tsx
/components
  ├ layout/
  │   ├ Header.tsx
  │   ├ Footer.tsx
  │   └ ClientLayoutWrapper.tsx
  ├ sections/
  │   ├ Hero.tsx
  │   ├ AboutSection.tsx
  │   ├ ProcessSection.tsx
  │   ├ ServicesSection.tsx
  │   ├ PortfolioGallery.tsx
  │   ├ InteractivePriceGallery.tsx
  │   ├ ContactFormSection.tsx
  │   └ ContactInfoSection.tsx
  └ ui/
      ├ Button.tsx
      ├ Form.tsx
      ├ FeatureStepsDemo.tsx
      ├ CartoonContract.tsx
      └ AnimatedTestimonials.tsx
/lib
  ├ utils.ts       — `cn`, прочие утилиты
  └ hooks.ts       — `useToast`, `submitContactForm`
/styles
  └ globals.css
/public
  └ images/
```

## 3. Компоненты и хуки
- **cn(...):** объединение классов Tailwind, поддержка условного CSS.
- **useToast():** добавление уведомлений, примеры вызова.
- **submitContactForm(data):** отправка POST-запроса, обработка ответов и ошибок.

## 4. Формы и валидация
- Используем React Hook Form + Zod:
  ```ts
  const schema = z.object({
    name: z.string().min(2, "Введите имя"),
    phone: z.string().regex(/^\+?\d{10,15}$/, "Неверный формат телефона"),
    message: z.string().optional(),
  });
  ```
- Обвязка через `zodResolver(schema)`.

## 5. Анимации
- **Framer Motion**:
  - `motion.div` для появления секций.
  - `AnimatePresence` для условных элементов (модалки, тосты).
- **CartoonContract**: параллакс-эффект при скролле.

## 6. Стили и темы
- Основная тема: светлая.
- Tailwind-конфиг: расширения (`extend`) цветов, шрифтов.
- Переменные для отступов, респонсив-брейкпоинтов.

## 7. Деплой
- Автоматический билд на push в main.
- Переменные окружения: URL API, ключ Sentry (если используется).
- Конфиг Vercel: переадресации, заголовки (Cache-Control).

## 8. Лучшие практики
- Каждый компонент — отдельный файл.
- Минималистичная логика в секциях, утиль-функции — в `/lib`.
- Покрытие тестами утилит и критичных пользовательских сценариев.
