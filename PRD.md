# Product Requirements Document (PRD) — SHELF Sborka

## 1. Цель проекта
Одностраничный сайт-визитка для сервиса профессиональной сборки мебели «SHELF Sborka», демонстрирующий услуги, процесс работы, галерею примеров работ и позволяющий оставить заявку или связаться через контактную форму и карточки контактов.

## 2. Технологический стек
- **Фреймворк:** Next.js 13 (App Router)
- **Язык:** TypeScript + React 18
- **Стили:** Tailwind CSS + глобальные стили (`globals.css`)
- **UI-библиотеки:**
  - Shadcn/UI (`Button`, `Dialog`, `Form` и др.)
  - Lucide-react (иконки)
- **Анимации:** Framer Motion (`motion`, `AnimatePresence`)
- **Валидация форм:** Zod + React Hook Form (`zodResolver`, `useForm`)
- **Кастомные UI-компоненты и хуки:**
  - `FeatureStepsDemo`, `LogoCarousel`, `AnimatedTestimonials` и др.
  - `useToast`, `submitContactForm`, `cn` (утилиты)
- **Сборка и билд:** Vercel/Netlify (TypeScript, ESBuild)

## 3. Основные разделы (модули)
1. **Layout**
   - `RootLayout` + `ClientLayoutWrapper` – общая разметка, шрифт Furore, `Header`/`Footer`, кастомный курсор, прелоадер и тосты
2. **Hero** (`Hero.tsx`) – главная секция с анимированным видеобэкграундом и кнопками прокрутки
3. **О нас** (`AboutSection.tsx`) – блочная верстка с анимацией появления и «книжным» эффектом (CartoonContract)
4. **Как мы работаем** (`ProcessSection.tsx`) – пять шагов процесса с иконками и демонстрацией через `FeatureStepsDemo`
5. **Услуги** (`ServicesSection.tsx`) – сетка карточек с мини-версией и развёрнутым видом
6. **Галерея примеров**
   - `PortfolioGallery.tsx` (статическая)
   - `InteractivePriceGallery.tsx` – фильтрация по категориям мебели и карусель
7. **Форма заявки** (`ContactFormSection.tsx`) – форма с валидацией и отправкой через `submitContactForm`
8. **Контактная информация** (`ContactInfoSection.tsx` + `ContactCard.tsx`) – тел., почта и соцсети
9. **Footer** (`Footer.tsx`) – ссылки на политику, логотипы, контакты

## 4. Архитектура и структура папок
```
/app
  layout.tsx
  page.tsx
/components
  layout/
    Header.tsx
    Footer.tsx
    ClientLayoutWrapper.tsx
  sections/
    Hero.tsx
    AboutSection.tsx
    ProcessSection.tsx
    ServicesSection.tsx
    PortfolioGallery.tsx
    InteractivePriceGallery.tsx
    ContactFormSection.tsx
    ContactInfoSection.tsx
  ui/
    Button.tsx
    Form.tsx
    FeatureStepsDemo.tsx
    AnimatedTestimonials.tsx
    LogoCarousel.tsx
    CartoonContract.tsx
/lib
  utils.ts
  hooks.ts
/styles
  globals.css
/public
  images/
```

## 5. Функциональные требования
- **Адаптивность:** поддержка мобильных устройств
- **SEO & метаданные:** `metadata` (title, description)
- **Доступность:** alt-теги, семантические теги
- **Интерактивность:** анимации, карусель, фильтрация
- **Форма обратной связи:** валидация, уведомления, сброс формы

## 6. Нефункциональные требования
- **Производительность:** ленивая загрузка, минимальный вес
- **Кросс-браузерность:** Chrome, Firefox, Safari, Edge
- **Безопасность:** CSRF/XSS-защита
- **Локализация:** русский язык
- **Поддержка:** модульная структура, типизация

## 7. Риски и зависимости
- Будущая интеграция бэкенда для галереи
- Расширение мультиязычности
- Совместимость с UI-библиотеками

## 8. Следующие шаги
1. Сгенерировать `tasks.md` с детализированными тасками
2. Дополнить `docs.md` технической документацией
3. Интеграция и деплой на Vercel/Netlify
