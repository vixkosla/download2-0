'use client';

import React, { useState, useEffect, useRef } from 'react';


// refs to hold the latest state so event handlers always have fresh values without re-creating listeners

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isHidden, setIsHidden] = useState(true); // Start hidden
  const [isMounted, setIsMounted] = useState(false); // Track mount state

  // Refs that mirror state for use inside stable event handlers
  const isHoveringInteractiveRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const isHiddenRef = useRef(true);
  const positionRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  const hotspotX = 13;
  const hotspotY = 2;

  const stickyHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track the interactive element (e.g. link / button) that the cursor is currently over
  const hoveredInteractiveElementRef = useRef<Element | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // We no longer depend on cursorRef being available right now; handlers will read it dynamically.

    document.body.classList.add('hide-default-cursor');

    const interactiveSelector = 'a, button, .btn, [role="button"], [onclick], .nav__link, .service-card, .pricing-card, .gallery-item, .social__link, .footer__link, input[type="submit"], input[type="button"], .modal__close, .modal__button, .mobile-menu-toggle, .phone-shake, #privacyPolicyArrow, #termsArrow, .process-toggle, .interactive-folder, .folder-item-content, .carousel-control';


    const moveCursor = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      positionRef.current = { x: newX, y: newY };
      requestAnimationFrame(() => {
        const cursorElementDynamic = cursorRef.current;
        if (cursorElementDynamic) {
          const rotation = isHoveringInteractiveRef.current && !isMouseDownRef.current ? 'rotate(-30deg)' : '';
          cursorElementDynamic.style.transform = `translate(${newX - hotspotX}px, ${newY - hotspotY}px) ${rotation}`;
        }
      });
      if (isHiddenRef.current) {
        isHiddenRef.current = false;
        setIsHidden(false);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const interactiveElement = target.closest(interactiveSelector);

      if (interactiveElement) {
        hoveredInteractiveElementRef.current = interactiveElement;
        if (!isHoveringInteractiveRef.current) {
          setIsHoveringInteractive(true);
          isHoveringInteractiveRef.current = true;
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as Element | null;

      if (
        hoveredInteractiveElementRef.current &&
        (!relatedTarget || !hoveredInteractiveElementRef.current.contains(relatedTarget))
      ) {
        // Cursor has completely left the previously hovered interactive element
        hoveredInteractiveElementRef.current = null;
        setIsHoveringInteractive(false);
        isHoveringInteractiveRef.current = false;
      }
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      isMouseDownRef.current = false;
    };

    const handleDocumentMouseLeave = () => {
      setIsHidden(true);
      isHiddenRef.current = true;
      if (stickyHoverTimeoutRef.current) {
        clearTimeout(stickyHoverTimeoutRef.current);
        stickyHoverTimeoutRef.current = null;
      }
      setIsHoveringInteractive(false); // Force hover off if mouse leaves window
      isHoveringInteractiveRef.current = false;
    };


    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleDocumentMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleDocumentMouseLeave);
      document.body.classList.remove('hide-default-cursor');
      if (stickyHoverTimeoutRef.current) {
        clearTimeout(stickyHoverTimeoutRef.current);
      }
    };
  }, []);

useEffect(() => {
  isHoveringInteractiveRef.current = isHoveringInteractive;
}, [isHoveringInteractive]);

useEffect(() => {
  isMouseDownRef.current = isMouseDown;
}, [isMouseDown]);

useEffect(() => {
  isHiddenRef.current = isHidden;
}, [isHidden]);

  const cursorStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '64px',
    height: '64px',
    backgroundImage: `url(${isHoveringInteractive ? '/images/3.cur' : '/images/2.cur'})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    pointerEvents: 'none',
    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.1s ease-out, background-image 0.1s ease-out',
    filter: isHoveringInteractive ? 'drop-shadow(0 0 8px #fff) drop-shadow(0 0 16px #fff)' : 'none',
    zIndex: 99999,
    willChange: 'transform, opacity',
    transformOrigin: `${hotspotX}px ${hotspotY}px`,
    opacity: isHidden || !isMounted ? 0 : 1,
    transform: `translate(${positionRef.current.x - hotspotX}px, ${positionRef.current.y - hotspotY}px) ${
      isHoveringInteractive && !isMouseDown ? 'rotate(-30deg)' : ''
    }`,
  };

  return isMounted ? <div ref={cursorRef} style={cursorStyle} /> : null;
};

export default CustomCursor;
