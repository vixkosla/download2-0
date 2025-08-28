'use client'; // Add this directive to mark the component as a Client Component

import Link from 'next/link';
import Image from 'next/image'; // For logo
import { Phone, Mail, MapPin, X } from 'lucide-react'; // Assuming Youtube instead of WhatsApp based on file names, added MapPin and X
import { useState, useEffect, useRef, useCallback } from 'react';
import { PrivacyPolicyContent } from '@/components/ui/PrivacyPolicyModal';
// Removed unused Button import

// Placeholder SVG icons (replace with actual SVGs or Lucide icons if available)
const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13"></path><path d="M22 2L15 22l-4-9-9-4 20-6z"></path>
  </svg>
);
const WhatsAppIcon = () => ( // Placeholder - consider Lucide's MessageSquare or similar
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);
const InstagramIcon = () => ( // Placeholder if Lucide Instagram is not used
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
);

const TABS = [
  {
    key: 'terms',
    label: 'Пользовательское соглашение',
    image: '/images/textures/img_6309.png', // visual icon for the terms of service tab
  },
  {
    key: 'privacy',
    label: 'Политика конфиденциальности',
    image: '/images/textures/img_6308.png', // visual icon for the privacy policy tab
  },
];

export const Footer = () => {
  const [showTabModal, setShowTabModal] = useState(false);
  const [activeTab, setActiveTab] = useState('privacy');
  const [headerHeight, setHeaderHeight] = useState(140); // default min-height
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  // Состояние наведения на вкладки
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // State for throw animation
  const [showThrown, setShowThrown] = useState(false);
  const [thrownTab, setThrownTab] = useState<string | null>(null);
  const [animationName, setAnimationName] = useState('animation-throw-in');
  const [hoveredTabKey, setHoveredTabKey] = useState<string | null>(null);
  const [isReverseThrow, setIsReverseThrow] = useState(false); // Новое состояние для реверса
  const [hideStaticText, setHideStaticText] = useState(false);
  const TAB_OUTLINES: Record<string, string> = {
    privacy: '/images/textures/soglas.svg',
    terms: '/images/textures/politika.svg',
  };

  const folderContainerRef = useRef<HTMLDivElement>(null);
  const parallaxRaf = useRef<number | null>(null);
  const lastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // --- mouse parallax for modal cards (hero-style) ---
  const modalCardsRef = useRef<HTMLDivElement>(null);
  const modalParallaxRaf = useRef<number | null>(null);
  const modalLastCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleModalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalCardsRef.current) return;
    const rect = modalCardsRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const intensity = 30;
    modalLastCoords.current = { x: nx * intensity, y: ny * intensity };
    if (modalParallaxRaf.current === null) {
      modalParallaxRaf.current = requestAnimationFrame(() => {
        if (modalCardsRef.current) {
          const { x, y } = modalLastCoords.current;
          modalCardsRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
        modalParallaxRaf.current = null;
      });
    }
  };
  const handleModalMouseLeave = () => {
    if (modalCardsRef.current) {
      modalCardsRef.current.style.transition = 'transform 0.4s cubic-bezier(0.6,0.05,0.4,1)';
      modalCardsRef.current.style.transform = 'translate3d(0,0,0)';
      setTimeout(() => {
        if (modalCardsRef.current) {
          modalCardsRef.current.style.transition = '';
        }
      }, 400);
    }
    modalLastCoords.current = { x: 0, y: 0 };
  };

  // Lock page scroll while footer modal is open
  useEffect(() => {
    if (showTabModal) {
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, [showTabModal]);

  useEffect(() => {
    const header = document.querySelector('.header');
    if (header) {
      setHeaderHeight(header.clientHeight);
    }
  }, [showTabModal]);

  // Mark client-side to trigger animation class after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFolderMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!folderContainerRef.current) return;

    const rect = folderContainerRef.current.getBoundingClientRect();
    if (!rect) return;

    const intensity = 15;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    lastCoords.current = { x: nx * intensity, y: ny * intensity };

    if (parallaxRaf.current === null) {
      parallaxRaf.current = requestAnimationFrame(() => {
        if (folderContainerRef.current) {
          const { x, y } = lastCoords.current;
          const hoverTransform = 'scale(1.1)';
          folderContainerRef.current.style.transform = `${hoverTransform} translate3d(${x}px, ${y}px, 0)`;
        }
        parallaxRaf.current = null;
      });
    }
  }, []);

  const handleFolderMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (folderContainerRef.current) {
      folderContainerRef.current.style.transition = 'none';
      folderContainerRef.current.style.transform = 'scale(1.1)';
    }
  }, []);

  const handleFolderMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (folderContainerRef.current) {
      folderContainerRef.current.style.transition = 'transform 0.4s cubic-bezier(0.6,0.05,0.4,1)';
      folderContainerRef.current.style.transform = 'scale(1)';
    }
    if (parallaxRaf.current) {
      cancelAnimationFrame(parallaxRaf.current);
      parallaxRaf.current = null;
    }
  }, []);

  // При закрытии модального окна просто сдвигаем всё вниз вместе с футером,
  // избегая отдельной «проваливающейся» анимации карточек.
  const handleClose = () => {
    // Если открыт брошенный лист, сначала запускаем реверсивную анимацию throw-out
    if (showThrown) {
      setIsReverseThrow(true);
      setAnimationName('animation-throw-out');
      setIsHovered(false);
      setHoveredTabKey(null);
      // Остальное делаем после завершения анимации (onAnimationEnd)
      return;
    }
    // Если лист не брошен, просто закрываем модалку
    setShowTabModal(false);
    setIsExpanded(false);
    setIsClosing(false);
    setActiveTab('privacy');
    setShowThrown(false);
    setAnimationName('');
    setIsHovered(false);
    setHoveredTabKey(null);
  };

  // Контент для вкладок (можно вынести в отдельные компоненты)
  const tabContent: Record<string, JSX.Element> = {
    privacy: (
      <div className="p-8 text-lg md:max-w-[1400px] mx-auto w-full">
        <p className="privacy-intro">НАСТОЯЩАЯ ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ ОПРЕДЕЛЯЕТ ПОРЯДОК ОБРАБОТКИ И ЗАЩИТЫ ПЕРСОНАЛЬНЫХ ДАННЫХ ФИЗИЧЕСКИХ ЛИЦ, ПОЛЬЗУЮЩИХСЯ СЕРВИСАМИ САЙТА SHELF (ДАЛЕЕ – КОМПАНИЯ).</p>
        <h3 className="text-accent mt-6 text-xl font-bold">1. Общие положения</h3>
        <p>1.1. Настоящая Политика является официальным документом Компании и определяет порядок обработки и защиты информации о физических лицах, пользующихся услугами сайта SHELF.</p>
        <p>1.2. Целью настоящей Политики является обеспечение надлежащей защиты информации о пользователях, в том числе их персональных данных, от несанкционированного доступа и разглашения.</p>
        <h3 className="text-accent mt-6 text-xl font-bold">2. Собираемая информация</h3>
        <p>2.1. Компания собирает следующие данные: имя, номер телефона, адрес электронной почты и адрес выполнения работ.</p>
        <h3 className="text-accent mt-6 text-xl font-bold">3. Цели сбора и обработки</h3>
        <p>3.1. Компания собирает и хранит только ту персональную информацию, которая необходима для предоставления сервисов сайта.</p>
        <p>3.2. Персональная информация пользователя используется в следующих целях:</p>
        <ul className="list-disc ml-8">
          <li>Оказание услуг по сборке мебели</li>
          <li>Осуществление клиентской поддержки</li>
          <li>Информирование о новых услугах и акциях</li>
          <li>Улучшение качества предоставляемых услуг</li>
        </ul>
        <h3 className="text-accent mt-6 text-xl font-bold">4. Защита, изменение и удаление информации</h3>
        <p>4.1. Компания защищает ваши персональные данные и по первому запросу изменит либо удалит их — достаточно связаться с нами по указанным контактам.</p>
        <h3 className="text-accent mt-6 text-xl font-bold">5. Контакты</h3>
        <p>5.1. По всем вопросам, связанным с настоящей Политикой, пользователи могут обращаться в Компанию по следующим контактным данным:</p>
        <ul className="list-disc ml-8">
          <li>Телефон: <a href="tel:+79219992200" className="text-accent underline">+7 (921) 999-22-00</a></li>
          <li>Email: <a href="mailto:shelf.sborka.spb@gmail.com" className="text-accent underline">shelf.sborka.spb@gmail.com</a></li>
          <li>Адрес: г. Санкт-Петербург, Большой пр. В.О. 80</li>
        </ul>
      </div>
    ),
    terms: (
      <div className="p-8 text-lg md:max-w-[1400px] mx-auto w-full">
        <h3 className="text-accent mt-6 text-xl font-bold">1. Общие положения</h3>
        <p>1.1. Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между владельцем сайта SHELF и пользователями данного сайта.</p>
        <p>1.2. Используя сайт, вы соглашаетесь с условиями данного Соглашения.</p>
        <h3 className="text-accent mt-6 text-xl font-bold">2. Права и обязанности сторон</h3>
        <ul className="list-disc ml-8">
          <li>Пользователь обязуется предоставлять достоверную информацию при заполнении форм на сайте.</li>
          <li>Пользователь не имеет права использовать сайт в целях, противоречащих законодательству РФ.</li>
          <li>Владелец сайта вправе изменять содержание сайта, приостанавливать или прекращать его работу без предварительного уведомления.</li>
        </ul>
        <h3 className="text-accent mt-6 text-xl font-bold">3. Персональные данные</h3>
        <p>3.1. Владелец сайта обязуется соблюдать конфиденциальность персональных данных пользователей в соответствии с Политикой конфиденциальности.</p>
        <h3 className="text-accent mt-6 text-xl font-bold">4. Ответственность</h3>
        <ul className="list-disc ml-8">
          <li>Владелец сайта не несет ответственности за возможные убытки, возникшие в результате использования или невозможности использования сайта.</li>
          <li>Пользователь самостоятельно несет ответственность за достоверность предоставляемых данных.</li>
        </ul>
        <h3 className="text-accent mt-6 text-xl font-bold">5. Изменения в соглашении</h3>
        <p>5.1. Владелец сайта вправе в любое время изменять условия настоящего Соглашения. Изменения вступают в силу с момента публикации на сайте.</p>
        <h3 className="text-accent mt-6 text-xl font-bold">6. Контакты</h3>
        <p>По всем вопросам, связанным с использованием сайта, вы можете обратиться по следующим контактам:</p>
        <ul className="list-disc ml-8">
          <li>Телефон: <a href="tel:+79219992200" className="text-accent underline">+7 (921) 999-22-00</a></li>
          <li>Email: <a href="mailto:shelf.sborka.spb@gmail.com" className="text-accent underline">shelf.sborka.spb@gmail.com</a></li>
          <li>Адрес: г. Санкт-Петербург, Большой пр. В.О. 80</li>
        </ul>
      </div>
    ),
  };

  const activeTabImage = TABS.find((t) => t.key === activeTab)?.image;

  // При старте throw-in: скрываем static-text на 0.5s
  const handleStartThrowIn = (tabKey: string) => {
    if (hideStaticText) setHideStaticText(false);
    setHideStaticText(true);
    setTimeout(() => setHideStaticText(false), 550); // длительность throw-in 0.5s + запас
    setIsExpanded(true);
    setActiveTab(tabKey);
    setShowTabModal(true);
    setThrownTab(tabKey);
    setShowThrown(true);
    setAnimationName('animation-throw-in');
  };

  return (
    <>
      <footer
      className={`footer ${isExpanded ? 'footer--expanded' : 'footer--collapsed'}`}
      /* В свернутом состоянии скрываем лишнее содержимое футера */
      style={{ background: 'transparent', overflow: isExpanded ? 'visible' : 'hidden', height: isExpanded ? `calc(100vh - ${headerHeight}px)` : '200px' }}
    >
      {!isExpanded && (
        <div className="footer__bottom" style={{ background: 'transparent', borderTop: 'none' }}>
          <div className="footer__bottom-content container flex justify-center py-4">
            {/* Мобильный скейл кнопок в свернутом состоянии, без влияния на раскрытие */}
            <div className="-translate-x-[188px] sm:-translate-x-[88px] translate-y-[90px] sm:translate-y-[90px] md:translate-x-0 md:translate-y-0">
              <div className="origin-top scale-[0.4] sm:scale-[0.55] md:scale-100">
                <div
                  ref={folderContainerRef}
                  className="relative w-[800px] h-[1200px] mt-6 md:mt-20" 
                  onMouseEnter={handleFolderMouseEnter}
                  onMouseLeave={handleFolderMouseLeave}
                  onMouseMove={handleFolderMouseMove}
                  style={{
                    transform: 'scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.6,0.05,0.4,1)',
                  }}
                >
              {TABS.map((tab, idx) => {
                const isSecond = idx === 1;
                const buttonZ = isSecond ? 10 : 20;
                return (
                  <button
                    key={tab.key}
                    aria-label={tab.label}
                    className="interactive-folder absolute left-0 top-0 p-0 bg-transparent border-none focus:outline-none"
                    style={{
                      zIndex: buttonZ,
                      pointerEvents: 'none',
                    }}
                    onAnimationEnd={(e) => e.currentTarget.classList.remove('animate-button-header-like-bounce-in')}
                  >
                    <Image
                      src={tab.image}
                      alt={tab.label}
                      width={800}
                      height={460}
                      className="object-contain select-none"
                      priority
                    />
                  </button>
                );
              })}
              {/* SVG-обводка при ховере */}
              {hoveredTabKey && (
                <Image
                  src={TAB_OUTLINES[hoveredTabKey]}
                  alt="outline"
                  width={800}
                  height={520}
                  className="absolute left-0 top-0 object-contain pointer-events-none z-40"
                  style={{
                    top: hoveredTabKey === 'terms' ? 2 : 6, // Move 4px lower for 'terms'
                    left: 1,
                    transform: 'translate(-0.25%, -0.25%) scale(1.005)',
                    filter: 'drop-shadow(0 0 6px #FFC700)',
                  }}
                />
              )}

              {/* Кнопка для первой вкладки */}
              <button
                aria-label={TABS[0].label}
                className="absolute left-0 top-0 w-[400px] h-[120px] bg-transparent focus:outline-none"
                style={{ zIndex: 30 }}
                onClick={() => handleStartThrowIn(TABS[0].key)}
                onMouseEnter={() => setHoveredTabKey(TABS[0].key)}
                onMouseLeave={() => setHoveredTabKey(null)}
              />
              {/* Кнопка для второй вкладки */}
              <button
                aria-label={TABS[1].label}
                 className="absolute right-0 top-0 w-[520px] h-[120px] bg-transparent focus:outline-none"
                style={{ zIndex: 25 }}
                onClick={() => handleStartThrowIn(TABS[1].key)}
                onMouseEnter={() => setHoveredTabKey(TABS[1].key)}
                onMouseLeave={() => setHoveredTabKey(null)}
              />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </footer>
      {/* Модальное окно с вкладками под шапкой */}
      {showTabModal && (
        <div
          className={`fixed left-0 right-0 z-[20000] flex flex-col items-center ${isClosing ? 'footer-slide-down' : ''}`}
          onClick={handleClose}
          style={{
            top: headerHeight,
            height: `calc(100vh - ${headerHeight}px)` ,
            animation: isClosing
              ? 'footer-slide-down 0.25s cubic-bezier(0.6,0.05,0.4,1)'
              : 'footer-slide-up 0.3s cubic-bezier(0.6,0.05,0.4,1)',
            background: 'transparent',
            backdropFilter: isClosing ? 'none' : 'blur(8px)',
            perspective: '2000px',
          }}
        >
          {/* Нижняя текстура сайта поверх блюра, как у реального низа страницы */}
          <div
            className="footer-overlay-bottom-texture"
            aria-hidden
            onClick={(e) => e.stopPropagation()}
          />
          {/* Крестик закрытия — вне области с onMouseMove */}
          {!isClosing && (
            <div
              className="absolute right-[1106px] top-16 float-animation"
              style={{ height: '80px', width: '80px', zIndex: 65000 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="w-full h-full p-4 rounded-full text-accent flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-150 hover:brightness-150"
                onClick={handleClose}
                aria-label="Закрыть"
              >
                <X size={56} />
              </button>
            </div>
          )}
          {/* Только этот контейнер реагирует на мышь */}
          <div
            ref={modalCardsRef}
            style={{ willChange: 'transform', width: '100%', height: '100%' }}
            onMouseMove={handleModalMouseMove}
            onMouseLeave={handleModalMouseLeave}
          >
            {/* Если reverse throw, показываем оба листа и оба текста с throw-out */}
            {isReverseThrow && (
              <>
                {/* Оба листа */}
                {TABS.map((tab, idx) => (
                  <div
                    key={tab.key}
                    className={`thrown-container animation-throw-out`}
                    style={{ transform: `translate(-50%, -50%) translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0) scale(1)` }}
                    onAnimationEnd={idx === 0 ? () => {
                      // Скрываем всё после throw-out
                      setShowTabModal(false);
                      setIsExpanded(false);
                      setIsClosing(false);
                      setActiveTab('privacy');
                      setShowThrown(false);
                      setIsReverseThrow(false);
                      setAnimationName('');
                      setIsHovered(false);
                      setHoveredTabKey(null);
                    } : undefined}
                  >
                    <Image
                      src={tab.image}
                      alt={tab.label}
                      width={800}
                      height={520}
                      className="object-contain select-none"
                      priority
                    />
                    {/* Обводка */}
                    <Image
                      src={TAB_OUTLINES[tab.key]}
                      alt="outline-active"
                      width={800}
                      height={520}
                      className="absolute left-0 top-0 object-contain pointer-events-none z-[51000]"
                      style={{
                        top: 4,
                        left: 2,
                        transform: 'translate(-0.25%, -0.25%) scale(1.008)',
                        filter: 'drop-shadow(0 0 6px #FFC700)',
                      }}
                    />
                    {/* Текст только у активного листа во время reverse throw */}
                    {tab.key === thrownTab && (
                      <div className={`thrown-text ${tab.key}`}>{tabContent[tab.key]}</div>
                    )}
                  </div>
                ))}
              </>
            )}
            {/* Обычный режим (старый рендер) */}
            {!isReverseThrow && showThrown && !isClosing && thrownTab && (
              <>
                {/* Статический лист под брошенным (без отдельной drop-анимации при закрытии) */}
                <div className={`static-container ${isClosing ? '' : 'animation-throw-in'}`}
                  style={{ transform: `translate(-50%, -50%) translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0)` }}
                >
                  <Image
                    src={TABS.find((t) => t.key !== thrownTab)?.image || ''}
                    alt={TABS.find((t) => t.key !== thrownTab)?.label || ''}
                    width={800}
                    height={460}
                    className="object-contain select-none"
                    priority
                  />
                </div>
                {/* Рендер static-text всегда, скрываем только на время первичного throw-in */}
                {!isReverseThrow && (
                  <div
                    className={`static-text ${activeTab} ${hideStaticText ? 'static-text--hidden' : ''} ${isClosing ? '' : ''}`}
                  >
                    {activeTab && tabContent[activeTab]}
                  </div>
                )}
                {/* Брошенный лист с текстом и кнопками (без отдельной drop-анимации при закрытии) */}
                <div
                  className={`thrown-container ${isClosing ? '' : animationName}`}
                  key={thrownTab}
                  onClick={(e) => e.stopPropagation()}
                  onAnimationEnd={(e) => {
                    // Если завершилась throw-out (реверс), закрываем модалку сразу
                    if (isReverseThrow && animationName === 'animation-throw-out') {
                      setShowTabModal(false);
                      setIsExpanded(false);
                      setIsClosing(false);
                      setActiveTab('privacy');
                      setShowThrown(false);
                      setIsReverseThrow(false);
                      setAnimationName('');
                      setIsHovered(false);
                      setHoveredTabKey(null);
                    }
                  }}
                  style={{ transform: `translate(-50%, -50%) translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0) scale(1)` }}
                >
                  {/* Невидимые кнопки для броска каждого листа */}
                  <button
                    aria-label="Соглашение"
                    className="invisible-tab-btn left"
                    onClick={() => {
                      if (activeTab !== 'terms') {
                        setAnimationName('animation-slide-out-left-and-drop');
                      }
                      setActiveTab('terms');
                      setThrownTab('terms');
                      setShowThrown(true);
                    }}
                  />
                  <button
                    aria-label="Политика"
                    className="invisible-tab-btn right"
                    onClick={() => {
                      if (activeTab !== 'privacy') {
                        setAnimationName('animation-slide-out-right-and-drop');
                      }
                      setActiveTab('privacy');
                      setThrownTab('privacy');
                      setShowThrown(true);
                    }}
                  />
                  <Image
                    src={TABS.find((t) => t.key === thrownTab)?.image || ''}
                    alt={thrownTab}
                    width={800}
                    height={460}
                    className="object-contain select-none"
                    priority
                  />
                  {/* Постоянная обводка выбранного листа */}
                  {thrownTab && (
                    <Image
                      src={TAB_OUTLINES[thrownTab]}
                      alt="outline-active"
                      width={800}
                      height={520}
                      className="absolute left-0 top-0 object-contain pointer-events-none z-[51000]"
                      style={{
                        top: 4,
                        left: 2,
                        transform: 'translate(-0.25%, -0.25%) scale(1.008)',
                        filter: 'drop-shadow(0 0 6px #FFC700)',
                      }}
                    />
                  )}
                  <div className={`thrown-text ${thrownTab === 'privacy' ? 'terms' : 'privacy'}`}>{thrownTab && tabContent[thrownTab === 'privacy' ? 'terms' : 'privacy']}</div>
                </div>
              </>
            )}
            <div className="relative w-full py-4 bg-transparent sticky top-0 z-10">
              {/* Centered stacked folder buttons */}
              <div className="relative w-[800px] h-[1200px] mx-auto">
                 {/* При showThrown кнопки скрыты */}
                 {!showThrown && TABS.map((tab, idx) => {
                    const isActive = activeTab === tab.key;
                    const zIndex = isActive ? 20 : 10;
                    return (
                      <button
                        key={tab.key}
                        aria-label={tab.label}
                        className="absolute left-0 top-0 p-0 bg-transparent border-none focus:outline-none"
                        style={{ pointerEvents: 'auto', zIndex, transform: `translate3d(${modalLastCoords.current.x}px, ${modalLastCoords.current.y}px, 0)` }}
                        onClick={() => {
                          setActiveTab(tab.key);
                          setThrownTab(tab.key);
                          setShowThrown(true);
                        }}
                      >
                        <Image
                          src={tab.image}
                          alt={tab.label}
                          width={800}
                          height={460}
                          className="object-contain select-none"
                        />
                      </button>
                    );
                  })}
                {/* Overlay policy/terms text directly on the folder image */}
                {/* Текст подложки (скрыт при showThrown) */}
                {!showThrown && (
                  <div
                    className={`policy-container absolute inset-0 z-[40000] overflow-y-auto p-4 flex flex-col items-center justify-start text-xs md:text-sm leading-tight ${activeTab === 'privacy' ? 'terms' : 'privacy'}`}
                    style={{ pointerEvents: isClosing ? 'none' : 'auto' }}
                  >
                    {tabContent[activeTab === 'privacy' ? 'terms' : 'privacy']}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .footer--collapsed {
          position: relative;
        }

        .footer--expanded {
          animation: footer-raise-up 0.3s cubic-bezier(0.6,0.05,0.4,1) forwards;
        }

        @keyframes footer-raise-up {
          from {
            transform: translateY(calc(100vh - 200px));
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes footer-slide-up {
          from {
            transform: translateY(100%);
            opacity: 0.7;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes footer-slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }

        /* Slide thrown/static cards down together with overlay */
        @keyframes card-slide-down {
          from {
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            transform: translate(-50%, 100vh) scale(1);
          }
        }

        .slide-down-card {
          animation: card-slide-down 0.25s cubic-bezier(0.6,0.05,0.4,1) forwards !important;
        }

        /* Ensure policy text is grey */
        .policy-container,
        .policy-container * {
          color: #888888 !important;
          font-family: 'Slavic', sans-serif !important;
        }
        /* Убираем :hover, так как теперь управляем через JS */
        /* Hide scrollbar but keep scroll ability */
        .policy-container::-webkit-scrollbar {
          display: none;
        }
        .policy-container {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        /* Throw-in with impact */
        @keyframes throw-in {
          0% { opacity: 0; transform: translate(-50%, 150vh) rotate(30deg) scale(0.5); }
          60% { opacity: 1; transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          80% { transform: translate(-50%, -50%) rotate(-5deg) scale(1); }
          100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
        }
        /* Брошенный лист: ниже на 5px, под текст */
        .thrown-container {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 80%;
          // height: 0%;
          // padding: 40px 0;
          max-width: 800px;
          transform: translate(-50%, -50%) scale(1);
          z-index: 50000; /* уровень 3: выше static-text */
          pointer-events: auto;
        }

        @media (min-width: 768px) {
          .thrown-container {
            width: 60%;
          }
        }


        @keyframes slide-out-left-and-drop {
          0% {
            transform: translate3d(-50%, -50%, -200px) rotateY(30deg);
            opacity: 0;
          }
          50% {
            transform: translate3d(-150%, -60vh, 0) rotateY(0deg) rotateZ(-20deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) rotateZ(0deg);
            opacity: 1;
          }
        }

        @keyframes slide-out-right-and-drop {
          0% {
            transform: translate3d(-50%, -50%, -200px) rotateY(-30deg);
            opacity: 0;
          }
          50% {
            transform: translate3d(50%, -60vh, 0) rotateY(0deg) rotateZ(20deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(-50%, -50%, 0) rotateZ(0deg);
            opacity: 1;
          }
        }

        .animation-throw-in {
          animation: throw-in 0.5s ease-out forwards;
        }
        .animation-slide-out-left-and-drop {
          animation: slide-out-left-and-drop 0.4s cubic-bezier(0.5, 0, 0.2, 1) forwards;
        }
        .animation-slide-out-right-and-drop {
          animation: slide-out-right-and-drop 0.4s cubic-bezier(0.5, 0, 0.2, 1) forwards;
        }

        @keyframes float-animation {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(5px, 5px);
          }
          50% {
            transform: translate(-5px, -5px);
          }
          75% {
            transform: translate(5px, -5px);
          }
        }

        .float-animation {
          animation: float-animation 6s ease-in-out infinite;
        }

        /* Статический лист под брошенным */
        .static-container {
          position: fixed;
          top: calc(50% + 15px);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 1200px;
          pointer-events: none;
          z-index: 30000; /* уровень 1: самый низ */
        }
        /* Текст статического листа */
        .static-text {
          position: fixed;
          top: calc(50% + 15px);
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 1200px;
          overflow-y: auto;
          padding: 1rem;
          z-index: 40000; /* уровень 2: выше static-container */
          color: #888888 !important;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          font-family: 'Slavic', sans-serif !important;
        }
        .static-text.terms,
        .thrown-text.terms,
        .policy-container.terms {
          padding-top: 20px;
        }
        .static-text * {
          font-family: 'Slavic', sans-serif !important;
        }
        /* Текст и контент поверх брошенного листа */
        .thrown-text {
          position: absolute;
          inset: 0;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          z-index: 55000; /* уровень 4: между thrown-container и buttons */
          color: #888888 !important;
          font-family: 'Slavic', sans-serif !important;
        }
        .thrown-text * {
          font-family: 'Slavic', sans-serif !important;
        }
        /* Жирный шрифт в модальном окне на обеих вкладках */
        .static-text,
        .static-text *,
        .thrown-text,
        .thrown-text *,
        .policy-container,
        .policy-container * {
          font-weight: 500 !important;
        }
        .thrown-text::-webkit-scrollbar { display: none; }
        .thrown-text { -ms-overflow-style: none; scrollbar-width: none; }
        /* Невидимые кнопки для переключения табов */
        .invisible-tab-btn {
          position: absolute;
          top: 0;
          width: 280px;
          height: 120px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 60000; /* уровень 4: выше thrown-container и thrown-text */
        }
        .invisible-tab-btn.left { left: 0; }
        .invisible-tab-btn.right { right: 0; }
        @font-face {
          font-family: 'Slavic';
          src: url('/fonts/Slavic-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        /* Абзацы и пункты списков – серый */
        .static-text p,
        .static-text li,
        .thrown-text p,
        .thrown-text li {
          color: #888888 !important;
        }
        /* Смещение текста вкладки «Политика» на 50px вниз */
        .static-text.privacy,
        .thrown-text.privacy,
        .policy-container.privacy {
          padding-top: 75px;
        }
        /* Accent color for intro paragraph (override grey) */
        .static-text .privacy-intro,
        .thrown-text .privacy-intro,
        .policy-container .privacy-intro {
          color: #ae2c2c !important;
        }
        
        /* --- ДОБАВЛЕНО: ГАРАНТИРОВАННЫЙ СЕРЫЙ ЦВЕТ ДЛЯ ВСЕХ ЭЛЕМЕНТОВ --- */
        .static-text,
        .static-text * {
          color: #888888 !important;
          font-family: 'Slavic', sans-serif !important;
        }
        .thrown-text,
        .thrown-text * {
          color: #888888 !important;
          font-family: 'Slavic', sans-serif !important;
        }

        @keyframes throw-out {
          0% { opacity: 1; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          60% { opacity: 1; transform: translate(-50%, 10vh) rotate(-10deg) scale(0.9); }
          100% { opacity: 0; transform: translate(-50%, 150vh) rotate(30deg) scale(0.5); }
        }
        .animation-throw-out {
          animation: throw-out 0.25s ease-in forwards;
        }
        
        /* Добавляю класс для скрытия static-text на время throw-in */
        .static-text--hidden {
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 0.2s;
        }
        
        /* Нижняя текстура внутри оверлея футерной модалки */
        .footer-overlay-bottom-texture {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 50px; /* равна .bottom-marker (закрытое состояние) */
          border-top: 2px solid #ffc700;
          pointer-events: none;
          z-index: 60000;
          background-image: url('/images/textures/3-2.jpg');
          background-size: cover;
          background-repeat: repeat-x;
        }
        /* Скрыть скроллбар в статическом текстовом блоке */
        .static-text::-webkit-scrollbar { display: none; }
        .static-text { -ms-overflow-style: none; scrollbar-width: none; }
        
      `}</style>
    </>
  );
};